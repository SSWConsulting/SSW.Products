import { getLocale, getPageWithFallback, getRelativePath } from "@utils/i18n";

const defaultBranch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const getPageData = async (product: string, filename: string, branch=defaultBranch) => {
  const locale = await getLocale();
  const fileData = await getPageWithFallback({product, filename, locale, revalidate: 10, branch});
  const relativePath = getRelativePath(product, filename, locale);



  const filteredBlocks = fileData.data.pages.pageBlocks?.filter(block => block !== null && block !== undefined);
  fileData.data.pages.pageBlocks = filteredBlocks;
  return {...fileData, relativePath};
}

export default getPageData;