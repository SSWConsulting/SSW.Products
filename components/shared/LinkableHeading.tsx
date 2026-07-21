import type { HTMLAttributes, ReactNode } from "react";
import { FaLink } from "react-icons/fa";
import { extractText, slugifyHeading } from "@utils/anchorSlug";

type LinkableHeadingProps = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Raw title to slugify; falls back to the text content of children. */
  anchor?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

// ponytail: no dedup for repeated headings on a page; the second wins a
// duplicate id. Add a per-page counter if authors need both to anchor.
export default function LinkableHeading({
  as: Tag,
  anchor,
  children,
  className,
  ...rest
}: LinkableHeadingProps) {
  const slug = slugifyHeading(anchor ?? extractText(children));

  if (!slug) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      id={slug}
      className={`group scroll-mt-28 ${className ?? ""}`}
      {...rest}
    >
      {children}
      {/* sibling anchor, never wrapping children: heading text may contain its
          own <a>, and nesting anchors is invalid HTML */}
      <a
        href={`#${slug}`}
        aria-label="Link to this section"
        className="ml-2 inline-flex items-center align-middle text-[0.6em] text-ssw-red opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
      >
        <FaLink aria-hidden="true" />
      </a>
    </Tag>
  );
}
