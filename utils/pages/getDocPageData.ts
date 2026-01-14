import { DocsTableOfContents } from "@tina/__generated__/types";
import { getDocPost, getDocsTableOfContents } from "@utils/fetchDocs";
import { getLocale } from "@utils/i18n";
import NotFoundError from "../../src/errors/not-found";
import { locale } from "dayjs";


interface PaginationLink {
  title: string;
  slug: string;
}


const getDocPageData = async (
  {product,
  slug,
  locale, 
  branch = "main"}: {
    product: string;
    slug: string;
    locale?: string;
    branch?: string;
  }
) => {
  const currentLocale = locale || await getLocale();
  const documentData = await getDocPost({product, slug, locale: currentLocale, branch});

  const tableOfContentsData = await getDocsTableOfContents(
    product,
    currentLocale
  );

  if(!documentData)
  {
    throw new NotFoundError(`Document not found '${slug}' for product '${product}'`);
  }

  const paginationData = getPaginationData(
    tableOfContentsData as DocsTableOfContents,
    slug
  );

  return {
    query: documentData.query,
    variables: documentData.variables,
    pageData: {docs: documentData.docs},
    tableOfContentsData: tableOfContentsData as DocsTableOfContents,
    paginationData
};
};


const getPaginationData = (
  tableOfContentsData: DocsTableOfContents,
  currentSlug: string
) => {
  const result: { prev: PaginationLink | null; next: PaginationLink | null } = {
    prev: null,
    next: null,
  };

  const allDocs: PaginationLink[] = [];
  tableOfContentsData.parentNavigationGroup?.forEach((group: any) => {
    if (!group?.items) return;

    group.items.forEach((item: any) => {
      if (item.slug && item.slug._sys && item.slug._sys.filename) {
        allDocs.push({
          title: item.title || "",
          slug: item.slug._sys.filename,
        });
      }
    });
  });
  const currentIndex = allDocs.findIndex((doc) => doc.slug === currentSlug);
  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      result.prev = allDocs[currentIndex - 1];
    }

    if (currentIndex < allDocs.length - 1) {
      result.next = allDocs[currentIndex + 1];
    }
  }

  return result;
};

export default getDocPageData;