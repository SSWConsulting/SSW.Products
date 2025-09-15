"use client";
import Link from "next/link";
import Image from "next/image";
import { useContextualLink } from "@utils/contextualLink";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FooterQuery } from "../../tina/__generated__/types";

interface FooterClientProps {
  results: FooterQuery | null;
  hasPrivacyPolicy: boolean;
  locale?: string;
}

const iconMap: { [key: string]: { svg: JSX.Element; linkText: string } } = {
  FaYouTube: {
    svg: <FaYoutube />,
    linkText: "Link to YouTube channel",
  },
  FaLinkedIn: { svg: <FaLinkedin />, linkText: "Link to LinkedIn profile" },
  FaFacebook: { svg: <FaFacebook />, linkText: "Link to Facebook page" },
  FaTwitter: { svg: <FaTwitter />, linkText: "Link to Twitter profile" },
  FaXTwitter: {
    svg: <FaXTwitter />,
    linkText: "Link to X (formerly Twitter) profile",
  },
  FaInstagram: { svg: <FaInstagram />, linkText: "Link to Instagram profile" },
  FaTiktok: { svg: <FaTiktok />, linkText: "Link to TikTok profile" },
  FaGithub: { svg: <FaGithub />, linkText: "Link to GitHub project" },
  FaDiscord: { svg: <FaDiscord />, linkText: "Link to Discord server" },
};

export default function FooterContent({ results, hasPrivacyPolicy, locale }: FooterClientProps) {
  const contextualHref = useContextualLink();
  if (!results?.footer) {
    return <p>Tina connection broken</p>;
  }

  const footerItems = results.footer.footer;
  const footerTitle = results.footer.footerTitle;
  const footerColor = results.footer.footerColor || "#000";
  const dynamicYear = new Date().getFullYear();

  let icpFiling: string | null = null;
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (locale === "zh" || hostname === "yakshaver.cn" || hostname === "www.yakshaver.cn") {
      icpFiling = "浙ICP备20009588号-6";
    } else if (hostname === "yakshaver.com.cn" || hostname === "www.yakshaver.com.cn") {
      icpFiling = "浙ICP备20009588号-7";
    }
  }

  return (
    <footer
      className="text-white p-6 transition-opacity duration-300 bg-ssw-charcoal opacity-100"
      style={{ backgroundColor: footerColor }}
    >
      <div className="max-w-7xl xl:mx-auto mx-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
          {/* Left: Copyright & Policy (bottom on mobile) */}
          <div className="order-3 lg:order-1 text-center lg:text-left md:text-sm text-xs">
            &copy; {dynamicYear} {footerTitle || "Default Footer Title"} {hasPrivacyPolicy && (
              <>
                {"| "}
                <Link href={contextualHref("/privacy")} className="underline">
                  Privacy Policy
                </Link>
              </>
            )}
            {icpFiling && (
              <div className="mt-1">
                网站备案号:{" "}
                <a
                  href="https://beian.miit.gov.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {icpFiling}
                </a>
              </div>
            )}
          </div>

          {/* Center: Tina Banner (top on mobile) */}
          <div className="order-1 lg:order-2 flex justify-center">
            <a
              className="flex items-center justify-center py-2 hover:text-orange-500 no-underline"
              href="https://tina.io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Powered by TinaCMS"
            >
              <Image alt="TinaCMS logo" width={30} height={30} src="/tina-llama-orange.png" />
              <span className="ml-2 uppercase tracking-widest text-xs md:text-sm">Powered by TinaCMS</span>
            </a>
          </div>

          {/* Right: Social Icons (middle on mobile) */}
            <div className="order-2 lg:order-3 flex space-x-4 justify-center lg:justify-end">
            {footerItems?.map((item, index: number) => {
              if (!item) return null;
              const icon = iconMap[item.footerItemIcon || ""];
              return (
                <a
                  key={index}
                  aria-label={icon?.linkText || "Social media link"}
                  href={item.footerItemLink ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-lg md:text-2xl hover:-translate-y-1 animation ease-in-out duration-300"
                >
                  {icon && icon.svg}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
