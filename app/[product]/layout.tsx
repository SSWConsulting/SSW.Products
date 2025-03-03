import "../globals.css";
import "ssw-tinacms-landingkit/dist/style.css";
import { Inter } from "next/font/google";
const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen ${inter.className}`}
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="1728" height="1080" viewBox="0 0 1728 1080" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_270_472)"><rect width="1728" height="1080" fill="url(%23paint0_radial_270_472)"/><rect width="1728" height="1080" fill="url(%23paint1_radial_270_472)" fill-opacity="0.2"/><rect width="1728" height="1080" fill="url(%23paint2_radial_270_472)" fill-opacity="0.2"/><rect width="1728" height="1080" fill="url(%23paint3_radial_270_472)" fill-opacity="0.2"/><rect width="1728" height="1080" fill="black" fill-opacity="0.35"/><mask id="mask0_270_472" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><rect width="1920" height="1080" fill="url(%23paint4_linear_270_472)"/></mask><g mask="url(%23mask0_270_472)"><rect width="1920" height="1080" fill="url(%23paint5_linear_270_472)"/></g></g><defs><radialGradient id="paint0_radial_270_472" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(850.95 1512.5) rotate(-18.0309) scale(1109.75 1210.61)"><stop offset="0.065" stop-color="%23868686"/><stop offset="0.223498" stop-color="%23868686"/><stop offset="1" stop-color="%232F2F2F"/></radialGradient><radialGradient id="paint1_radial_270_472" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(168.75 119.5) rotate(8.21255) scale(511.041 565.622)"><stop/><stop offset="1" stop-color="%23333333"/></radialGradient><radialGradient id="paint2_radial_270_472" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1246.95 78) rotate(11.5126) scale(390.813 766.133)"><stop/><stop offset="1"/></radialGradient><radialGradient id="paint3_radial_270_472" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(164.25 158) rotate(35.1989) scale(1194.45 2210.46)"><stop/><stop offset="1" stop-color="%23E2E2E2"/></radialGradient><linearGradient id="paint4_linear_270_472" x1="960" y1="0" x2="960" y2="1080" gradientUnits="userSpaceOnUse"><stop stop-color="%23D9D9D9" stop-opacity="0.45"/><stop offset="0.163534" stop-color="%23D9D9D9" stop-opacity="0.1678"/><stop offset="0.597744" stop-color="%23D9D9D9" stop-opacity="0.0513"/><stop offset="1" stop-color="%23D9D9D9" stop-opacity="0"/></linearGradient><linearGradient id="paint5_linear_270_472" x1="0" y1="540" x2="1920" y2="540" gradientUnits="userSpaceOnUse"><stop stop-color="%23747474"/><stop offset="0.333333" stop-color="%232A2C30"/><stop offset="0.666667" stop-color="%23464A5A"/><stop offset="1"/></linearGradient><clipPath id="clip0_270_472"><rect width="1728" height="1080" fill="white"/></clipPath></defs></svg>')`,
          backgroundSize: "cover",
        }}
      >
        {children}
      </body>
    </html>
  );
}
