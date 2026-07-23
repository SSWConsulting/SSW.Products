import type { HTMLAttributes, ReactNode } from "react";
import { FaLink } from "react-icons/fa";
import { extractText, slugifyHeading } from "@utils/anchorSlug";

type LinkableHeadingProps = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Raw title to slugify; falls back to the text content of children. */
  anchor?: string;
  /**
   * Make the heading text itself the link, as the rule's good example does.
   * Only safe when children can't contain their own <a> (plain Tina titles);
   * markdown headings must leave this off, or the anchors nest illegally.
   */
  wrap?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

/**
 * The self-link that sits beside a heading. Rendered by LinkableHeading, and
 * exported for blocks whose heading markup can't be a single element (e.g.
 * responsive variants of the same title) and so carry the id themselves.
 * Reveal it with `group scroll-mt-28` on the element holding the id.
 */
export function HeadingAnchorLink({ slug }: { slug: string }) {
  return (
    <a
      href={`#${slug}`}
      aria-label="Link to this section"
      className="ml-2 inline-flex items-center align-middle text-[0.6em] text-ssw-red opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
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
  wrap,
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
    <Tag
      {...rest}
      id={slug}
      className={`group scroll-mt-28 ${className ?? ""}`}
    >
      {wrap ? (
        // The link's accessible name is the heading text, so no aria-label here
        <a
          href={`#${slug}`}
          className="text-inherit no-underline hover:no-underline"
        >
          {children}
          <FaLink
            aria-hidden="true"
            className="ml-2 inline-block align-middle text-[0.6em] text-ssw-red opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
          />
        </a>
      ) : (
        <>
          {children}
          {/* sibling anchor, never wrapping children: heading text may contain
              its own <a>, and nesting anchors is invalid HTML */}
          <HeadingAnchorLink slug={slug} />
        </>
      )}
    </Tag>
  );
}
