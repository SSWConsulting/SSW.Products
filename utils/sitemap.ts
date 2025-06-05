import client from "@tina/__generated__/client";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { tenantHasPrivacyPolicy } from "./privacy";
import { filterEdgesByTenant, getSlugsFromCollections } from "./tina";

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
    ...pageLinks.filter((page) => page !== "home").map((page) => `${page}`),
    ...privacyPage,
  ];
};

export { buildSitemap, getAllUrls };
