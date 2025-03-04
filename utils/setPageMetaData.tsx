
export async function setPageMetadata(seo: any, product?: string) {
    return {
      title: seo?.title,
      description: seo?.description,
      openGraph: {
        title: seo?.openGraphTitle || seo?.title || "",
        description: seo?.openGraphDescription || seo?.description || "",
        images: seo?.openGraphImage || `./public/default-images/${product}-default.png` || "",
      },
    };
  }