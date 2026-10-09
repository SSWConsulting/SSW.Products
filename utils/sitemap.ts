import client from "@tina/__generated__/client";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { tenantHasPrivacyPolicy } from "./privacy";
import { filterEdgesByTenant, getSlugsFromCollections } from "./tina";
import { docSlugFromBreadcrumbs } from "./docPath";
import type { Edge, Edges } from "@/types/tina";

type SitemapEntry = { url: string; lastmod?: string };

const buildSitemap = async (hostname: string, entries: SitemapEntry[]) => {
  const links = entries.map((entry) => ({
    url: entry.url,
    changefreq: "daily",
    priority: 0.7,
    ...(entry.lastmod ? { lastmod: entry.lastmod } : {}),
  }));

  const stream = new SitemapStream({ hostname });
  const sitemap = await streamToPromise(Readable.from(links).pipe(stream));
  return sitemap.toString();
};

// Tina connection queries return one page at a time (default ~10), so follow the
// cursor to the end — otherwise large collections (docs) are silently truncated.
const getAllEdges = async (
  runQuery: (vars: { first: number; after?: string }) => Promise<{ data: Record<string, unknown> }>,
  field: string
): Promise<Edge[]> => {
  const all: Edge[] = [];
  let after: string | undefined;
  // hard cap guards against a malformed pageInfo turning this into a loop
  for (let page = 0; page < 50; page++) {
    const res = await runQuery({ first: 100, after });
    const connection = res.data[field] as {
      edges?: Edges;
      pageInfo?: { hasNextPage?: boolean; endCursor?: string };
    };
    for (const edge of connection?.edges ?? []) {
      if (edge) all.push(edge);
    }
    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) break;
    after = connection.pageInfo.endCursor;
  }
  return all;
};

const getAllUrls = async (product: string): Promise<SitemapEntry[]> => {
  const [allDocs, allPages, allBlogs] = await Promise.all([
    getAllEdges((vars) => client.queries.docsConnection(vars), "docsConnection"),
    getAllEdges((vars) => client.queries.pagesConnection(vars), "pagesConnection"),
    getAllEdges((vars) => client.queries.blogsConnection(vars), "blogsConnection"),
  ]);

  // Docs keep their folder in the URL, and a zh doc shares its English doc's URL,
  // so they are mapped from the full breadcrumb trail and de-duplicated.
  const docLinks = [
    ...new Set(
      filterEdgesByTenant(allDocs, product)
        .map((edge) => docSlugFromBreadcrumbs(edge?.node?._sys?.breadcrumbs))
        .filter(Boolean)
    ),
  ];

  // Pages and blogs likewise share one URL across language variants, so
  // de-duplicate their slugs (previously each zh variant produced a duplicate).
  const pageLinks = [
    ...new Set(getSlugsFromCollections(filterEdgesByTenant(allPages, product))),
  ];

  const blogEdges = filterEdgesByTenant(allBlogs, product);
  const blogLinks = [...new Set(getSlugsFromCollections(blogEdges))];

  // Newest publish date across a blog's language variants, for <lastmod>.
  const latestBlogDate = (slug: string): string | undefined => {
    const dates = blogEdges
      .filter((edge) => edge?.node?._sys?.breadcrumbs?.at(-1) === slug)
      .map((edge) => (edge?.node as { date?: string } | undefined)?.date)
      .filter((date): date is string => Boolean(date));
    return dates.length ? dates.sort().at(-1) : undefined;
  };

  const privacyPage: SitemapEntry[] = (await tenantHasPrivacyPolicy(product))
    ? [{ url: "privacy" }]
    : [];

  return [
    ...docLinks.map((doc) => ({ url: `docs/${doc}` })),
    ...blogLinks.map((blog) => ({ url: `blog/${blog}`, lastmod: latestBlogDate(blog) })),
    ...pageLinks.map((page) => ({ url: page === "home" ? "" : page })),
    ...privacyPage,
    { url: "blog" },
    { url: "docs" },
  ];
};

export { buildSitemap, getAllUrls };
