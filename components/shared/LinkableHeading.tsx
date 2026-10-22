import type { HTMLAttributes, ReactNode } from "react";
import { FaLink } from "react-icons/fa";
import { extractText, slugifyHeading } from "@utils/anchorSlug";

type LinkableHeadingProps = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Raw title to slugify; falls back to the text content of children. */
  anchor?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

/**
 * The self-link that sits beside a heading. The heading text stays a plain
 * heading; only this red icon is the link (the GitHub/docs convention), which
 * also works where the heading text contains its own <a>. Reveal it with
 * `group scroll-mt-28` on the element holding the id.
 *
 * pointer-coarse keeps the icon visible on touch, where group-hover never fires
 * (Tailwind wraps hover variants in @media (hover: hover)).
 */
export function HeadingAnchorLink({ slug }: { slug: string }) {
  return (
    <a
      href={`#${slug}`}
      aria-label="Link to this section"
      className="ml-2 inline-flex items-center align-middle text-[0.6em] text-ssw-red opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 pointer-coarse:opacity-100"
    >
      <FaLink aria-hidden="true" />
    </a>
  );
}

// NOTE: no dedup for repeated headings on a page; duplicates share an id, and
// links resolve to the first in document order. Add a per-page counter if
// authors need both to anchor.
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
      <Tag {...rest} className={className}>
        {children}
      </Tag>
    );
  }

  // Spread rest first so the component always owns id and className: a
  // caller-supplied id must not override the computed anchor slug.
  return (
    <Tag {...rest} id={slug} className={`group scroll-mt-28 ${className ?? ""}`}>
      {children}
      {/* sibling anchor, never wrapping children: heading text may contain its
          own <a>, and nesting anchors is invalid HTML */}
      <HeadingAnchorLink slug={slug} />
    </Tag>
  );
}
