import { getLocale, getPageWithFallback, getRelativePath } from "@utils/i18n";

const getPageData = async (product: string, filename: string, branch="main") => {
  const locale = await getLocale();
  const fileData = await getPageWithFallback(product, filename, locale, {
    fetchOptions: {
      next: {
        revalidate: 10,
      },
    },
  });
  const relativePath = getRelativePath(product, filename, locale);

  return {fileData, relativePath};
}

export default getPageData;