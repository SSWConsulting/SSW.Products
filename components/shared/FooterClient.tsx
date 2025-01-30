"use client";

import { useEffect, useState } from "react";
import { FooterQuery } from "../../tina/__generated__/types";
import {
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaGithub,
  FaDiscord,
} from "react-icons/fa";

interface FooterClientProps {
  results: FooterQuery | null;
}

const iconMap: { [key: string]: JSX.Element } = {
  FaYouTube: <FaYoutube />,
  FaLinkedIn: <FaLinkedin />,
  FaFacebook: <FaFacebook />,
  FaTwitter: <FaTwitter />,
  FaInstagram: <FaInstagram />,
  FaTiktok: <FaTiktok />,
  FaGithub: <FaGithub />,
  FaDiscord: <FaDiscord />,
};

export default function FooterClient({ results }: FooterClientProps) {
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

  return (
    <footer
      className={`text-white py-6 transition-opacity duration-300 ${
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
                  className="flex items-center space-x-2 text-lg md:text-2xl"
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
          {footerTitle || "Default Footer Title"}
        </div>
      </div>
    </footer>
  );
}
