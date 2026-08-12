import type { Metadata } from "next";
import { COMPANY } from "@/data/company";
import { SITE, absoluteUrl, getRobotsDirective } from "@/data/site";

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage = SITE.defaultOgImage,
  ogType = "website",
  keywords,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
    robots: getRobotsDirective(),
    openGraph: {
      type: ogType,
      url,
      title,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: COMPANY.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const DEFAULT_KEYWORDS = [
  "CareNest Home Health",
  "home care Pune",
  "home nursing Pune",
  "elder care Pune",
  "caregiver Pune",
];
