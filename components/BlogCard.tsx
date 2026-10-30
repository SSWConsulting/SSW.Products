"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Author as AuthorType } from "@/types/author";
import { Blog } from "@/types/blog";
import { Modify } from "@/types/modify";
import Image from "next/image";
import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { ReactNode } from "react";
import ArticleMetadata from "./shared/ArticleMetadata";
import Author from "./shared/Author";
import GridBackground from "./shared/GridBackground";
import { useContextualLink } from "@utils/contextualLink";

type BlogCardProps = Modify<Blog, {
  author?: AuthorType | null;
  slug?: string | null;
  groupHover?: boolean;
}>;

// Hidden on cards: it's the fallback for posts nobody categorised (#840)
const UNCATEGORIZED = "uncategorized";

// Render excerpt headings and links as inline text: the excerpt is clamped
// body text, not a document outline, and the whole card already links to the
// post, so a link inside it could never be clicked (#858)
const InlineText = (props: { children: ReactNode } | undefined) => (
  <span>{props?.children}</span>
);

const BlogCard = ({
  bannerImage,
  category,
  readLength,
  body,
  groupHover,
  slug,
  title,
  author,
  date,
}: BlogCardProps) => {
  const contextualHref = useContextualLink();
  const blogUrl = contextualHref(`/blog/${slug || ''}`);
  const showCategory =
    category && category.toLowerCase() !== UNCATEGORIZED;
  return (
    // No card box: posts sit on the page background, split by a thin line (#810)
    <article className="h-full flex flex-col gap-3 relative border-t border-white/10 pt-6 group">
      {groupHover && (
        // the title already links to the post; hide this full-card overlay
        // link from assistive tech so it isn't announced as an unnamed link
        <Link
          href={blogUrl}
          className="absolute inset-0 z-20"
          aria-hidden
          tabIndex={-1}
        />
      )}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 mb-2">
        {bannerImage ? (
          <Image
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={cn(
              groupHover && "group-hover:scale-105",
              "object-cover transition-transform duration-700"
            )}
            aria-hidden={true}
            src={bannerImage}
          />
        ) : (
          <GridBackground />
        )}
      </div>
      {showCategory && (
        <span className="text-xs font-semibold uppercase tracking-wider text-ssw-red">
          {category}
        </span>
      )}
      <Link className="w-fit" href={blogUrl}>
        <h3 className={cn(
          "text-xl font-bold text-gray-100 transition-colors",
          groupHover ? "group-hover:text-ssw-red" : "hover:text-ssw-red"
        )}>
          {title}
        </h3>
      </Link>
      <section className="text-gray-300 text-base line-clamp-2">
        <TinaMarkdown
          content={body}
          components={{
            img: () => <></>,
            a: InlineText,
            h1: InlineText,
            h2: InlineText,
            h3: InlineText,
            h4: InlineText,
            h5: InlineText,
            h6: InlineText,
          }}
        />
      </section>
      {/* Author and date sit under the blurb, smaller than it (#810, #840) */}
      <div className="mt-auto pt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {author && (
          <Author
            author={author.author}
            authorImage={author.authorImage}
            sswPeopleLink={author.sswPeopleLink}
          />
        )}
        <ArticleMetadata date={date} readLength={readLength} />
      </div>
    </article>
  );
};

const SkeletonCard = () => {
  return (
    <div className="h-full **:data-[slot=skeleton]:bg-gray-light flex flex-col gap-3 border-t border-white/10 pt-6">
      <Skeleton className="w-full aspect-video rounded-xl mb-2" />
      <Skeleton className="w-24 h-4 rounded-md" />
      <Skeleton className="w-5/6 h-7 rounded-md" />
      <Skeleton className="w-full h-12 rounded-md" />
      <div className="flex gap-3 items-center mt-auto pt-1">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-5 w-40 rounded-md" />
      </div>
    </div>
  );
};

export { BlogCard, SkeletonCard };
