import type { HTMLAttributes, ReactNode } from "react";
import { FaLink } from "react-icons/fa";
import { extractText, slugifyHeading } from "@utils/anchorSlug";

type LinkableHeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  /** Raw title to slugify; falls back to the text content of children. */
  anchor?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

// Heading with its own anchor target per
// https://www.ssw.com.au/rules/heading-to-anchor-targets - a link icon that
// fades in on hover/focus links to #slug.
// The icon is a SIBLING anchor, not a wrapper around the heading text: heading
// content routinely contains its own markdown links, and wrapping it would nest
// <a> inside <a> (invalid HTML -> the browser unnests it -> React hydration
// mismatch). Keeping children as direct descendants also preserves any flex
// layout the consumer put on the heading (e.g. the h4's inline-icon spacing).
// ponytail: no dedup for duplicate headings on one page; add a per-page
// counter context if authors ever repeat a heading and need both anchors.
export default function LinkableHeading({
  as: Tag = "h2",
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
