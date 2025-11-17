import { buildSitemap, getAllUrls } from "@utils/sitemap";
import { getDomainForTenant } from "@utils/tenancy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ product: string }> }
): Promise<Response> {

  const { product } = await params;

  const hostname = getDomainForTenant(product);
  if (!hostname) {
    return new Response(`No tenant found matching parameter \"${product}\"`, {
      status: 404,
    });
  }

  const baseUrl = `https://${hostname}`;

  const allUrls = await getAllUrls(product);

  const sitemap = await buildSitemap(baseUrl, allUrls);
  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
