import Link from "next/link";
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
}

const iconMap: { [key: string]: { svg: JSX.Element; linkText: string } } = {
  FaYouTube: {
    svg: <FaYoutube />,
    linkText: "Link to YouTube channel",
  },
  FaLinkedIn: { svg: <FaLinkedin />, linkText: "Link to LinkedIn profile" },
  FaFacebook: {
    svg: <FaFacebook />,

    linkText: "Link to Facebook page",
  },
  FaTwitter: { svg: <FaTwitter />, linkText: "Link to Twitter profile" },
  FaXTwitter: {
    svg: <FaXTwitter />,
    linkText: "Link to X (formerly Twitter) profile",
  },
  FaInstagram: {
    svg: <FaInstagram />,
    linkText: "Link to Instagram profile",
  },
  FaTiktok: {
    svg: <FaTiktok />,
    linkText: "Link to TikTok profile",
  },
  FaGithub: {
    linkText: "Link to GitHub project",
    svg: <FaGithub />,
  },
  FaDiscord: { svg: <FaDiscord />, linkText: "Link to Discord server" },
};

export default function FooterContent({
  results,
  hasPrivacyPolicy,
}: FooterClientProps) {
  if (!results?.footer) {
    return <p>Tina connection broken</p>;
  }

  const footerItems = results?.footer?.footer;
  const footerTitle = results?.footer?.footerTitle;
  const footerColor = results.footer.footerColor!;

  const dynamicYear = new Date().getFullYear();

  return (
    <footer
      className={
        "text-white p-6 transition-opacity duration-300 bg-ssw-charcoal opacity-100"
      }
      style={{ backgroundColor: footerColor }}
    >
      <div className="max-w-7xl xl:mx-auto mx-4 flex flex-col lg:flex-row justify-between items-center lg:items-start">
        {/* Footer Items */}
        <div className="flex space-x-4 mb-4 lg:mb-0 justify-center lg:order-2">
          {footerItems?.map((item, index) => {
            if (item) {
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
                  {icon && icon["svg"]}
                </a>
              );
            }
            return null;
          })}
        </div>

        {/* Footer Title */}
        <div className="text-center lg:text-left md:text-sm text-xs lg:order-1">
          &copy; {dynamicYear.toString()}{" "}
          {footerTitle || "Default Footer Title"}{" "}
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
