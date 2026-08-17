import type { Metadata } from "next";

export async function setPageMetadata(
  seo: any,
  product?: string,
  pageArea?: string,
  fallbackImage?: string
): Promise<Metadata> {
  return {
    title: product ? `${product} ${pageArea ? ` ${pageArea}` : ''} - ${seo?.title}` : seo?.title,
    description: seo?.description,
    openGraph: {
      siteName: product,
      type: pageArea === "Blog" ? "article" : "website",
      title: seo?.openGraphTitle || seo?.title || "",
      description: seo?.openGraphDescription || seo?.description || "",
      images:
        seo?.openGraphImage ||
        fallbackImage ||
        `/default-images/${product}-og.png`,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

// TODO: Reimplement usage when we know what structure types we want to use ** confirm with Rick **
// export async function setPageStructuredData(structuredData: any, product?: string){

//   const schema = {
//     "@context": `${structuredData.context}`,
//     "@type": `${structuredData.type}`,
//     "name": `${structuredData.name} ` || `${product}`,
//     "applicationCategory": `${structuredData.applicationCategory}` || "WebApplication",
//     "operatingSystem": `${structuredData.operatingSystem}` || "ALL",
//     "offers": {
//       "@type": "offer",
//       "price": "0",
//       "priceCurrency": "USD"
//     }
//   }
//   return schema;
// }
