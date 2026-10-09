import { MetadataRoute } from "next";
import { getHostname } from "@utils/i18n";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Multi-tenant: point each domain at its own sitemap so crawlers can find it.
  const host = await getHostname();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
    ],
    ...(host ? { sitemap: `https://${host}/sitemap.xml` } : {}),
  };
}
