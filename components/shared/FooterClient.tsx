"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { FooterQuery } from "../../tina/__generated__/types";
import { FaXTwitter } from "react-icons/fa6";

interface FooterClientProps {
  results: FooterQuery | null;
  hasPrivacyPolicy: boolean;
}

const iconMap: { [key: string]: JSX.Element } = {
  FaYouTube: <FaYoutube />,
  FaLinkedIn: <FaLinkedin />,
  FaFacebook: <FaFacebook />,
  FaTwitter: <FaTwitter />,
  FaXTwitter: <FaXTwitter />,
  FaInstagram: <FaInstagram />,
  FaTiktok: <FaTiktok />,
  FaGithub: <FaGithub />,
  FaDiscord: <FaDiscord />,
};

export default function FooterClient({
  results,
  hasPrivacyPolicy,
}: FooterClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!results?.footer) {
    return <p>Tina connection broken</p>;
  }

  const footerItems = results?.footer?.footer;
  const footerTitle = results?.footer?.footerTitle;
  const footerColor = results.footer.footerColor!;

  const dynamicYear = new Date().getFullYear();

  return (
    <footer
      className={`text-white p-6 transition-opacity duration-300 ${
        !footerColor ? "bg-ssw-charcoal" : ""
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: footerColor }}
    >
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start">
        {/* Footer Items */}
        <div className="flex space-x-4 mb-4 lg:mb-0 justify-center lg:order-2">
          {footerItems?.map((item, index) => {
            if (item) {
              return (
                <a
                  key={index}
                  href={item.footerItemLink ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-lg md:text-2xl hover:-translate-y-1 animation ease-in-out duration-300"
                >
                  {item.footerItemIcon && iconMap[item.footerItemIcon]}
                </a>
              );
            }
            return null;
          })}
        </div>

        {/* Footer Title */}
        <div className="text-center lg:text-left md:text-sm text-xs lg:order-1">
          {dynamicYear.toString()} {footerTitle || "Default Footer Title"}{" "}
          {hasPrivacyPolicy && (
            <>
              {"| "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
