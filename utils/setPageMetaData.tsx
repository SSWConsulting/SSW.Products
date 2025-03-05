
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