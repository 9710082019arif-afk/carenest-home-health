// Post-build: inject path-aware SEO bootstrap into index.html and
// prerender critical routes so raw HTML has unique title/canonical/robots
// before React hydrates. Soft 404 root cause for SPAs: every URL returns
// homepage HTML with the homepage canonical.

const fs = require("fs");
const path = require("path");
const { SITE, ROUTES } = require("./seo-static-routes");

const buildDir = path.join(__dirname, "..", "build");
const indexPath = path.join(buildDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("prerender-seo: build/index.html missing — run craco build first");
  process.exit(1);
}

const rawIndex = fs.readFileSync(indexPath, "utf8");

const bootstrapMap = {};
ROUTES.forEach((r) => {
  bootstrapMap[r.path] = {
    title: r.title,
    description: r.description,
    canonical: r.canonical,
    robots: r.robots || undefined,
    keywords: r.keywords || undefined,
  };
});

const bootstrapScript = `<script id="carenest-seo-bootstrap">
(function(){
  try {
    var SITE=${JSON.stringify(SITE)};
    var MAP=${JSON.stringify(bootstrapMap)};
    var path=(location.pathname||"/").replace(/\\/+$/,"")||"/";
    if(path!=="/"&&MAP[path+"/"]&&!MAP[path]) path=path+"/";
    var seo=MAP[path];
    function setMeta(attr,key,val){
      if(!val) return;
      var el=document.head.querySelector("meta["+attr+"=\\""+key+"\\"]");
      if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
      el.setAttribute("content",val);
    }
    function setCanonical(url){
      var el=document.head.querySelector('link[rel="canonical"]');
      if(!el){el=document.createElement("link");el.setAttribute("rel","canonical");document.head.appendChild(el);}
      el.setAttribute("href",url);
      document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function(a){a.setAttribute("href",url);});
    }
    if(seo){
      if(seo.title) document.title=seo.title;
      setMeta("name","description",seo.description);
      if(seo.keywords) setMeta("name","keywords",seo.keywords);
      setCanonical(seo.canonical);
      setMeta("property","og:url",seo.canonical);
      setMeta("property","og:title",seo.title);
      setMeta("property","og:description",seo.description);
      setMeta("name","twitter:title",seo.title);
      setMeta("name","twitter:description",seo.description);
      if(seo.robots){
        setMeta("name","robots",seo.robots);
        setMeta("name","googlebot",seo.robots);
      }
    } else if(path!=="/"){
      var url=SITE+path;
      setCanonical(url);
      setMeta("property","og:url",url);
    }
  } catch(e){}
})();
</script>`;

function applyHead(html, route) {
  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttr(route.canonical)}" />`
  );
  out = out.replace(
    /<link rel="alternate" hreflang="en-IN" href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="en-IN" href="${escapeAttr(route.canonical)}" />`
  );
  out = out.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/?>/i,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(route.canonical)}" />`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeAttr(route.canonical)}" />`
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
  );
  if (route.robots) {
    if (/<meta name="robots"/i.test(out)) {
      out = out.replace(
        /<meta name="robots" content="[^"]*"\s*\/?>/i,
        `<meta name="robots" content="${escapeAttr(route.robots)}" />`
      );
    } else {
      out = out.replace(
        "</title>",
        `</title>\n    <meta name="robots" content="${escapeAttr(route.robots)}" />`
      );
    }
    if (/<meta name="googlebot"/i.test(out)) {
      out = out.replace(
        /<meta name="googlebot" content="[^"]*"\s*\/?>/i,
        `<meta name="googlebot" content="${escapeAttr(route.robots)}" />`
      );
    }
  }
  if (route.keywords) {
    if (/<meta name="keywords"/i.test(out)) {
      out = out.replace(
        /<meta name="keywords" content="[^"]*"\s*\/?>/i,
        `<meta name="keywords" content="${escapeAttr(route.keywords)}" />`
      );
    } else {
      out = out.replace(
        "</title>",
        `</title>\n    <meta name="keywords" content="${escapeAttr(route.keywords)}" />`
      );
    }
  }
  return out;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}
function escapeAttr(s) {
  return String(s).replace(/&/g, "&").replace(/"/g, """).replace(/</g, "<");
}

function injectBootstrap(html) {
  if (html.includes("carenest-seo-bootstrap")) {
    return html.replace(/<script id="carenest-seo-bootstrap">[\s\S]*?<\/script>/, bootstrapScript);
  }
  return html.replace(/<head[^>]*>/i, (m) => `${m}\n    ${bootstrapScript}`);
}

function injectBodyContent(html, route) {
  if (!route.bodyHtml) return html;
  const noscript = `<noscript>${route.bodyHtml}</noscript>`;
  const seed = `<div id="carenest-seo-seed" data-seo-path="${escapeAttr(route.path)}">${route.bodyHtml}</div>
<script>/* remove SEO seed once React mounts */(function(){var r=document.getElementById('root');if(!r)return;var obs=new MutationObserver(function(){var s=document.getElementById('carenest-seo-seed');if(s&&r.childNodes.length){s.remove();obs.disconnect();}});obs.observe(r,{childList:true});setTimeout(function(){var s=document.getElementById('carenest-seo-seed');if(s)s.remove();},8000);})();</script>`;
  if (html.includes('id="root"')) {
    return html.replace(/<div id="root"><\/div>/, `${seed}<div id="root"></div>${noscript}`);
  }
  return html + seed + noscript;
}

let mainHtml = injectBootstrap(rawIndex);
fs.writeFileSync(indexPath, mainHtml);
console.log("prerender-seo: injected path-aware SEO bootstrap into build/index.html");

let count = 0;
ROUTES.filter((r) => r.path !== "/").forEach((route) => {
  let html = applyHead(mainHtml, route);
  html = injectBodyContent(html, route);
  const outFile = path.join(buildDir, route.file);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  count += 1;
  console.log(`prerender-seo: wrote ${route.file} → ${route.canonical} [${route.robots}]`);
});

console.log(`prerender-seo: done (${count} prerendered routes)`);
