import { getLocale, getPageWithFallback, getRelativePath } from "@utils/i18n";

const defaultBranch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const getPageData = async (product: string, filename: string, branch=defaultBranch) => {
  const locale = await getLocale();
  // 1h so the [filename] route's `revalidate = 3600` isn't capped by a shorter
  // fetch-level revalidate (Next uses the lowest revalidate across the route).
  const fileData = await getPageWithFallback({product, filename, locale, revalidate: 3600, branch});
  const relativePath = getRelativePath(product, filename, locale);



  const filteredBlocks = fileData.data.pages.pageBlocks?.filter(block => block !== null && block !== undefined);
  fileData.data.pages.pageBlocks = filteredBlocks;
  return {...fileData, relativePath};
}

export default getPageData;