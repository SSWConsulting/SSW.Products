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
// https://www.ssw.com.au/rules/heading-to-anchor-targets - the heading links to
// #slug and a link icon fades in on hover/focus.
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
      <a href={`#${slug}`} className="text-inherit no-underline">
        {children}
        <FaLink
          aria-hidden="true"
          className="ml-2 inline-block align-baseline text-[0.55em] text-ssw-red opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      </a>
    </Tag>
  );
}
