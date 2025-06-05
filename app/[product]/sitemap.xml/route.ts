import { Product } from "@/types/product-list";
import client from "@tina/__generated__/client";
import { SystemInfo } from "@tina/__generated__/types";
import { tenantHasPrivacyPolicy } from "@utils/privacy";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

function filterEdgesByTenant<T extends Edges>(connection: T, product: string) {
  return mapConnection(connection, (acc: Edge[], curr) => {
    const breadcrumb = curr?.node?._sys.breadcrumbs?.at(0);
    if (!breadcrumb || breadcrumb !== product) return acc;
    return [...acc, curr];
  });
}

function getSlugsFromCollections<T extends Edges>(edges: T): string[] {
  if (!edges) return [];
  return edges.reduce<string[]>((acc, curr) => {
    const slug = curr?.node?._sys.breadcrumbs?.at(-1);
    if (!slug) return acc;
    return [...acc, slug];
  }, []);
}

const buildSitemap = async (hostname: string, paths: string[]) => {
  const links = paths.map((path) => ({
    url: path,
    changefreq: "daily",
    priority: 0.7,
  }));

  const stream = new SitemapStream({ hostname });
  const sitemap = await streamToPromise(Readable.from(links).pipe(stream));
  return sitemap.toString();
};

export async function GET(
  request: Request,
  { params }: { params: { product: string } }
): Promise<Response> {
  const product = params.product;

  const hostname = getDomainForTenant(product);
  if (!hostname) {
    return new Response(`No tenant found matching parameter \"${product}\"`, {
      status: 404,
    });
  }

  const baseUrl = `https://${hostname}`;

  const allUrls = await getAllUrls(product);

  console.log("allUrls", allUrls.length);
  const sitemap = await buildSitemap(baseUrl, allUrls);
  return new Response(sitemap, {
    status: 200,
    headers: {
      "content-Type": "application/xml",
    },
  });
}

const getAllUrls = async (product: string) => {
  const [allDocs, allPages, allBlogs] = await Promise.all([
    client.queries.docsConnection(),
    client.queries.pagesConnection(),
    client.queries.blogsConnection(),
  ]);

  const [docLinks, blogLinks, pageLinks] = [
    allDocs.data.docsConnection.edges,
    allBlogs.data.blogsConnection.edges,
    allPages.data.pagesConnection.edges,
  ].map((collection) => {
    const filteredCollection = filterEdgesByTenant(collection, product);
    return getSlugsFromCollections(filteredCollection);
  });

  const privacyPage = (await tenantHasPrivacyPolicy(product))
    ? [`privacy`]
    : [];

  return [
    ...docLinks.map((doc) => `docs/${doc}`),
    ...blogLinks.map((blog) => `blog/${blog}`),
    ...pageLinks.map((page) => `${page}`),
    ...privacyPage,
  ];
};

const getDomainForTenant = (product: string) => {
  if (!process.env.NEXT_PUBLIC_PRODUCT_LIST)
    throw new Error("NEXT_PUBLIC_PRODUCT_LIST is not defined");
  const productList: Product[] = JSON.parse(
    process.env.NEXT_PUBLIC_PRODUCT_LIST
  );

  for (const item of productList) {
    if (item.product === product) {
      return item.domain;
    }
  }
};

type Edges = Edge[] | null | undefined;

type Edge =
  | {
      node?: {
        _sys: Partial<SystemInfo>;
      } | null;
    }
  | null
  | undefined;
function mapConnection<T extends Edges, R>(
  edges: T,
  mapFn: (acc: R[], curr: Edge) => R[]
): R[] {
  if (!edges) return [];
  return edges.reduce<R[]>((acc: R[], curr: Edge) => {
    return mapFn(acc, curr);
  }, []);
}
