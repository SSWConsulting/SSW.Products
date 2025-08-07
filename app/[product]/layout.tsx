import FooterServer from "@comps/shared/FooterServer";
import { Inter } from "next/font/google";
import Script from "next/script";
import NavBarServer from "../../components/shared/NavBarServer";
import { getGoogleTagId } from "../../utils/getGoogleTagId";
import { headers } from 'next/headers';
import "../globals.css";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

function getLocaleFromPath(): string {
  const headersList = headers();
  return headersList.get('x-language') || 'en';
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { product: string };
}) {
  const googleTagId = getGoogleTagId(params.product);
  const locale = getLocaleFromPath();
  const htmlLang = locale === 'zh' ? 'zh-CN' : 'en';

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="icon" href={`/favicons/${params.product}.ico`} />

        {params?.product === "YakShaver" && (
          <Script
            data-domain="yakshaver.ai"
            src="https://plausible.io/js/script.hash.outbound-links.pageview-props.tagged-events.js"
          />
        )}
        {googleTagId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${googleTagId}');`}
          </Script>
        )}
      </head>
      <body
        className={`min-h-screen flex-col flex ${inter.className} relative bg-gray-light`}
      >
        <main className="overflow-clip grow">
          <NavBarServer product={params.product} locale={locale} />
          {children}
        </main>
        <FooterServer product={params.product} locale={locale} />
      </body>
    </html>
  );
}
