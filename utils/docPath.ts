// A doc's URL slug is its path underneath content/docs/<Product>/, so a doc in a
// subfolder is reachable at /docs/<folder>/<filename>. Tina gives breadcrumbs as
// [product, ...folders, filename], with an optional "zh" right after the product
// for translated docs - the locale comes from the request, never the URL, so it
// is dropped here and the translation shares its English doc's slug.
export const docSlugFromBreadcrumbs = (
  breadcrumbs?: readonly string[] | null
): string => {
  if (!breadcrumbs?.length) return "";
  const [, ...rest] = breadcrumbs;
  return (rest[0] === "zh" ? rest.slice(1) : rest).join("/");
};

// Docs that were *renamed* while being moved into a folder, keyed by product and
// old slug. A doc that only moved needs no entry: it is matched by filename (see
// findDocSlugByFilename), which is why this list stays short.
const RENAMED_DOCS: Record<string, Record<string, string>> = {
  TimePro: {
    "ezl-introduction": "easyleave/introduction",
    "ezl-public-holidays-exclude-employees":
      "easyleave/public-holidays-exclude-employees",
  },
};

export const renamedDocSlug = (product: string, slug: string): string | null =>
  RENAMED_DOCS[product]?.[slug] ?? null;
