import { MetadataRoute } from "next";
import { getHostname } from "@utils/i18n";
import { isCanonicalTenantHost } from "@utils/tenancy";

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
    // Only advertise the sitemap on a tenant's canonical domain. The sitemap's
    // <loc>s use getDomainForTenant(product); on a .cn mirror or staging host
    // they'd point at a different host, which crawlers treat as unverified.
    ...(isCanonicalTenantHost(host)
      ? { sitemap: `https://${host}/sitemap.xml` }
      : {}),
  };
}
