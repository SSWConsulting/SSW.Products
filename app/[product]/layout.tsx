import FooterServer from "@comps/shared/FooterServer";
import { Inter } from "next/font/google";
import Script from "next/script";
import NavBarServer from "../../components/shared/NavBarServer";
import { getGoogleTagId } from "../../utils/getGoogleTagId";
import { getLocale } from "../../utils/i18n";
import "../globals.css";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

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
    <html lang={htmlLang}>
      <head>
        <link rel="icon" href={`/favicons/${product}.ico`} />

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

        <main className="overflow-clip grow">
          <NavBarServer product={product} locale={locale} />
          {children}
        </main>
        <FooterServer product={product} locale={locale} />
      </body>
    </html>
  );
}
