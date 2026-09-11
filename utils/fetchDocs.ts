import { Docs } from "@tina/__generated__/types";
import client from "../tina/__generated__/client";
import { docSlugFromBreadcrumbs, renamedDocSlug } from "./docPath";

const getDocsForProduct = async (product: string, offset = 0, limit = 5) => {
  try {
    const res = await client.queries.getAllDocs();

    if (
      !res.data ||
      !res.data.docsConnection ||
      !res.data.docsConnection.edges ||
      !res.data.docsConnection.edges.length
    ) {
      throw new Error("No documents found");
    }

    const filteredDocs = res.data.docsConnection.edges?.filter((edge) =>
      edge?.node?._sys?.path?.includes(`/docs/${product}/`)
    );

    if (!filteredDocs || !filteredDocs.length) {
      throw new Error("No documents found");
    }

    const sortedBlogs = filteredDocs.sort((a: any, b: any) => {
      // First check if both documents have displayOrder
      if (a.node.displayOrder != null && b.node.displayOrder != null) {
        return a.node.displayOrder - b.node.displayOrder;
      }

      // If only one has displayOrder, prioritize it
      if (a.node.displayOrder != null) return -1;
      if (b.node.displayOrder != null) return 1;

      // Fall back to date-based sorting
      const dateA = new Date(a.node.date);
      const dateB = new Date(b.node.date);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedBlogs = sortedBlogs.slice(offset, offset + limit);

    return {
      query: res.query,
      data: paginatedBlogs.map((edge) => edge?.node),
      hasMore: sortedBlogs.length > offset + limit,
    };
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    throw error;
  }
};

const getDocsTableOfContents = async (product: string, locale: string = 'en') => {
  const paths = locale === 'zh' 
    ? [`${product}/zh/toc.mdx`, `${product}/toc.mdx`]
    : [`${product}/toc.mdx`];

  for (const relativePath of paths) {
    try {
      const res = await client.queries.docsTableOfContents({ relativePath });
      return res.data.docsTableOfContents;
    } catch (error) {
      if (relativePath.includes('/zh/')) {
        console.log(`Chinese docs table of contents not found, falling back to English for ${product}`);
      } else {
        console.error("Error fetching docs table of contents:", error);
        throw error;
      }
    }
  }
};

const getDocPost = async ({product, slug, locale = 'en', branch}: {product: string, slug: string, locale?: string, branch?: string}) => {
  const paths = locale === 'zh' 
    ? [`${product}/zh/${slug}.mdx`, `${product}/${slug}.mdx`]
    : [`${product}/${slug}.mdx`];
  for (const relativePath of paths) {
    try {
      let fetchOptions = {};
      if (branch) {
        fetchOptions = { fetchOptions: { headers: { "x-branch": branch } } };
      }
      const res = await client.queries.docs({ relativePath }, fetchOptions);
      if (res?.data?.docs) {
        return {
          query: res.query,
          variables: res.variables,
          docs: res.data.docs as Docs,
        };
      }
    } catch (error) {
      if (relativePath.includes('/zh/')) {
        console.log(`Chinese doc post not found, falling back to English for ${product}/${slug}`);
      } else {
        console.error("Error fetching doc post:", error);
        return null;
      }
    }
  }
  return null;
};


// Resolves the slug a doc has *now* from a slug it used to have, so links to a
// doc from before it was filed into a folder keep working. Renames are looked up
// explicitly; a doc that only moved is found by its filename, which is unchanged.
// Returns null when nothing matches, or when more than one doc shares the
// filename - guessing between them would send readers to the wrong page.
const findMovedDocSlug = async (product: string, slug: string) => {
  const renamed = renamedDocSlug(product, slug);
  if (renamed) return renamed;

  const filename = slug.split("/").pop();
  if (!filename) return null;

  const res = await client.queries.docsConnection();
  const matches = (res.data.docsConnection.edges ?? [])
    .map((edge) => edge?.node?._sys?.breadcrumbs)
    .filter(
      (breadcrumbs): breadcrumbs is string[] =>
        !!breadcrumbs?.length &&
        breadcrumbs[0] === product &&
        breadcrumbs[1] !== "zh" &&
        breadcrumbs[breadcrumbs.length - 1] === filename
    )
    .map(docSlugFromBreadcrumbs);

  if (matches.length !== 1 || matches[0] === slug) return null;
  return matches[0];
};

export {
  findMovedDocSlug,
  getDocPost,
  getDocsForProduct,
  getDocsTableOfContents,
};
