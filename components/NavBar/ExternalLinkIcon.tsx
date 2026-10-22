import { FaExternalLinkAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

// Renders the external-link icon when `href` points off-site. Keeps the
// "is this external?" check in one place — it was duplicated across the
// desktop nav items, the dropdown subitems and the mobile menu (and the
// desktop copy had an operator-precedence bug that dropped the icon for
// http:// links).
export default function ExternalLinkIcon({
  href,
  className,
}: {
  href?: string | null;
  className?: string;
}) {
  const isExternal =
    !!href && (href.startsWith("http://") || href.startsWith("https://"));
  if (!isExternal) return null;
  return (
    <FaExternalLinkAlt className={cn("text-white text-xs ml-0.5", className)} />
  );
}
