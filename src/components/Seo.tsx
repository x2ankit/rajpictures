import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.rajpictures.in";
const DEFAULT_TITLE = "Raj Pictures | Wedding Photography & Cinematic Films in Odisha";
const DEFAULT_DESCRIPTION =
  "Premium wedding photography, cinematic films, and pre-wedding stories across Odisha. Crafted by Raj Pictures for couples who want artful storytelling.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export type SeoProps = {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: "website" | "article" | string;
  noIndex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  keywords?: string[];
};

const buildUrl = (pathname?: string) => {
  if (!pathname) return SITE_URL;
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalized}`;
};

export const Seo = ({
  title,
  description,
  pathname,
  image,
  type = "website",
  noIndex = false,
  schema,
  keywords,
}: SeoProps) => {
  const fullTitle = title ? `${title} | Raj Pictures` : DEFAULT_TITLE;
  const pageDescription = description ?? DEFAULT_DESCRIPTION;
  const canonicalUrl = buildUrl(pathname);
  const ogImage = image ?? DEFAULT_IMAGE;
  const structuredData = !schema
    ? []
    : Array.isArray(schema)
    ? schema
    : [schema];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={pageDescription} />
      <meta name="author" content="Raj Pictures" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {structuredData.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};
