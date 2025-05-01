import { Inter } from "next/font/google";
import Script from "next/script";

import "ssw-tinacms-landingkit/dist/style.css";
import NavBarServer from "../../components/shared/NavBarServer";
import { getGoogleTagId } from "../../utils/getGoogleTagId";
import "../globals.css";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { product: string };
}) {
  const googleTagId = getGoogleTagId(params.product);

  return (
    <html lang="en">
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
      <body className={`min-h-screen ${inter.className} bg-[#222222]`}>
        <NavBarServer product={params.product} />
        {children}
      </body>
    </html>
  );
}
