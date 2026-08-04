import React, { useLayoutEffect } from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME, SITE_URL } from "@/lib/seo";

const upsertMeta = (attr, key, value) => {
  if (!value || typeof document === "undefined") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const upsertCanonical = (url) => {
  if (!url || typeof document === "undefined") return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((a) => {
    a.setAttribute("href", url);
  });
};

/**
 * Per-page document head: title, description, canonical, robots,
 * Open Graph and Twitter Card tags.
 *
 * Also forces canonical/og:url via useLayoutEffect so SPA shells that ship
 * with homepage canonical in index.html cannot Soft-404 deep URLs.
 */
const SEOHead = ({ seo }) => {
  const title = seo?.title;
  const description = seo?.description;
  const canonical = seo?.canonical;
  const keywords = seo?.keywords;
  const robots = seo?.robots;
  const og = seo?.og || {};
  const twitter = seo?.twitter || {};

  const ogImage = og.image || DEFAULT_OG_IMAGE;
  const ogImageAlt = og.imageAlt || DEFAULT_OG_IMAGE_ALT;

  useLayoutEffect(() => {
    if (!seo) return;
    if (title) document.title = title;
    if (description) upsertMeta("name", "description", description);
    if (keywords) upsertMeta("name", "keywords", keywords);
    if (robots) {
      upsertMeta("name", "robots", robots);
      upsertMeta("name", "googlebot", robots);
    }
    if (canonical) {
      upsertCanonical(canonical);
      upsertMeta("property", "og:url", og.url || canonical);
    }
    if (og.title) upsertMeta("property", "og:title", og.title);
    if (og.description) upsertMeta("property", "og:description", og.description);
    if (twitter.title) upsertMeta("name", "twitter:title", twitter.title);
    if (twitter.description) upsertMeta("name", "twitter:description", twitter.description);
  }, [seo, title, description, canonical, keywords, robots, og.url, og.title, og.description, twitter.title, twitter.description]);

  if (!seo) return null;

  return (
    <Helmet prioritizeSeoTags>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}
      {robots && <meta name="googlebot" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={og.type || "website"} />
      <meta property="og:site_name" content={og.siteName || SITE_NAME} />
      <meta property="og:locale" content={og.locale || "en_IN"} />
      {og.title && <meta property="og:title" content={og.title} />}
      {og.description && <meta property="og:description" content={og.description} />}
      {og.url && <meta property="og:url" content={og.url} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitter.card || "summary_large_image"} />
      {twitter.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter.title && <meta name="twitter:title" content={twitter.title} />}
      {twitter.description && <meta name="twitter:description" content={twitter.description} />}
      <meta name="twitter:image" content={twitter.image || ogImage} />
      <meta name="twitter:image:alt" content={twitter.imageAlt || ogImageAlt} />

      {/* Geo / business hints for local SEO */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Pune" />
      <meta name="author" content={SITE_NAME} />
      {canonical && <link rel="alternate" hrefLang="en-IN" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="x-default" href={canonical} />}
      {/* Helpful for debugging Soft 404s in view-source after hydrate */}
      {canonical && <meta name="carenest:path" content={canonical.replace(SITE_URL, "") || "/"} />}
    </Helmet>
  );
};

export default SEOHead;
