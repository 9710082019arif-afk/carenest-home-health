import React from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME, SITE_URL } from "@/lib/seo";

/**
 * Per-page document head: title, description, canonical, robots,
 * Open Graph and Twitter Card tags.
 */
const SEOHead = ({ seo }) => {
  if (!seo) return null;
  const {
    title,
    description,
    canonical,
    keywords,
    robots,
    og = {},
    twitter = {},
  } = seo;

  const ogImage = og.image || DEFAULT_OG_IMAGE;
  const ogImageAlt = og.imageAlt || DEFAULT_OG_IMAGE_ALT;

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
    </Helmet>
  );
};

export default SEOHead;
