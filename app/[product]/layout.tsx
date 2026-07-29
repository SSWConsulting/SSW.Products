import FooterServer from "@comps/shared/FooterServer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import NavBarServer from "../../components/shared/NavBarServer";
import { withAssetVersion } from "../../utils/assetVersion";
import { getGoogleTagId } from "../../utils/getGoogleTagId";
import { getLocale } from "../../utils/i18n";
import { getDomainForTenant } from "../../utils/tenancy";
import "../globals.css";
import QueryProvider from "@comps/providers/QueryProvider";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product } = await params;
  const domain = getDomainForTenant(product);

  return {
    metadataBase: domain ? new URL(`https://${domain}`) : undefined,
    title: {
      default: product,
      template: "%s",
    },
    openGraph: {
      siteName: product,
      type: "website",
      images: [`/default-images/${product}-og.png`],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ product: string }>;
}) {
  
  const { product } = await params;
  const googleTagId = getGoogleTagId(product);
  const locale = await getLocale();
  const htmlLang = locale === "zh" ? "zh-CN" : "en";

  return (
    // data-scroll-behavior tells next's router to suppress the smooth scroll
    // from globals.css while it navigates, so only in-page hash links animate
    <html lang={htmlLang} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href={withAssetVersion(`/favicons/${product}.ico`)} />
        
        {product === "YakShaver" && (
          <Script
            data-domain="yakshaver.ai"
            src="https://plausible.io/js/script.hash.outbound-links.pageview-props.tagged-events.js"
          />
        )}
        {product === "EagleEye" && (
          <>
            <Script
              async
              src="https://plausible.io/js/pa-mLKH9kmb_Ab1FoQjBIRMA.js"
            />
            <Script id="plausible-init">
              {`
                window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
                plausible.init()
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`min-h-screen flex-col flex ${inter.className} relative bg-gray-light`}
        >
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagId}');
          `}
        </Script>
        <QueryProvider>
          <main className="overflow-clip grow">
            <NavBarServer product={product} locale={locale} />
            {children}
          </main>
        </QueryProvider>
        <FooterServer product={product} locale={locale} />
      </body>
    </html>
  );
}
