import client from "@tina/__generated__/client";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { tenantHasPrivacyPolicy } from "./privacy";
import { filterEdgesByTenant, getSlugsFromCollections } from "./tina";
import { docSlugFromBreadcrumbs } from "./docPath";

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

const getAllUrls = async (product: string) => {
  const [allDocs, allPages, allBlogs] = await Promise.all([
    client.queries.docsConnection(),
    client.queries.pagesConnection(),
    client.queries.blogsConnection(),
  ]);

  const [blogLinks, pageLinks] = [
    allBlogs.data.blogsConnection.edges,
    allPages.data.pagesConnection.edges,
  ].map((collection) => {
    const filteredCollection = filterEdgesByTenant(collection, product);
    return getSlugsFromCollections(filteredCollection);
  });

  // Docs keep their folder in the URL, and a zh doc shares its English doc's URL,
  // so they are mapped from the full breadcrumb trail and de-duplicated.
  const docLinks = [
    ...new Set(
      filterEdgesByTenant(allDocs.data.docsConnection.edges, product)
        .map((edge) => docSlugFromBreadcrumbs(edge?.node?._sys?.breadcrumbs))
        .filter(Boolean)
    ),
  ];

  const privacyPage = (await tenantHasPrivacyPolicy(product))
    ? [`privacy`]
    : [];

  return [
    ...docLinks.map((doc) => `docs/${doc}`),
    ...blogLinks.map((blog) => `blog/${blog}`),
    ...pageLinks.map((page) => (page === "home" ? "" : page)),
    ...privacyPage,
    "blog",
    "docs",
  ];
};

export { buildSitemap, getAllUrls };
