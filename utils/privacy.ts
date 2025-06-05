import client from "@tina/__generated__/client";

export const tenantHasPrivacyPolicy = async (product: string) => {
  try {
    const res = await client.queries.privacy({
      relativePath: `${product}/index.mdx`,
    });
    return Boolean(res);
  } catch {
    return false;
  }
};
