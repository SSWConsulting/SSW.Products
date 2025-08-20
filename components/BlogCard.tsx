"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Author as AuthorType } from "@/types/author";
import { Blog } from "@/types/blog";
import { Modify } from "@/types/modify";
import Image from "next/image";
import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import ArticleMetadata from "./shared/ArticleMetadata";
import Author from "./shared/Author";
import CategoryLabel from "./shared/CategoryLabel";
import GridBackground from "./shared/GridBackground";
import ReadMore from "./shared/ReadMore";
import { useBlogUrl } from "@utils/blogUrl";

type BlogCardProps = Modify<Blog, {
  author?: AuthorType | null;
  slug?: string | null;
  groupHover?: boolean;
  locale?: string;
}>;

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
  locale = 'en',
}: BlogCardProps) => {
  const getBlogUrl = useBlogUrl(locale);
  return (
    <div className="h-full flex flex-col grow shrink-0 relative border bg-gradient-black border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
      {groupHover && (
        <Link href={getBlogUrl(slug || '')} className="absolute inset-0 z-20" />
      )}
      <div className="relative aspect-video ">
        <div className="inset-0 absolute align-middle items-center justify-center flex">
          {bannerImage && (
            <div
              className={cn(
                groupHover && "group-hover:scale-105",
                "rounded-md transition-transform  duration-700 mask-to-bottom z-10 h-5/6 relative aspect-video"
              )}
            >
              <Image
                alt=""
                fill
                className="object-cover"
                aria-hidden={true}
                src={bannerImage}
              />
            </div>
          )}
        </div>
        <div className="w-full h-full mask-to-bottom">
          <GridBackground />
        </div>
      </div>
      <div className="grow shrink-0 gap-3 flex flex-col p-6">
        {category && (
          <CategoryLabel className="text-sm">{category}</CategoryLabel>
        )}
        <Link className="w-fit" href={getBlogUrl(slug || '')}>
          <h3
            className={cn(
              "text-xl font-bold text-gray-100 transition-colors",
              groupHover ? "group-hover:text-ssw-red" : "hover:text-ssw-red"
            )}
          >
            {title}
          </h3>
        </Link>
        {author && (
          <Author
            author={author.author}
            authorImage={author.authorImage}
            sswPeopleLink={author.sswPeopleLink}
          />
        )}
        <ArticleMetadata
          className="h-fit"
          date={date}
          readLength={readLength}
        />
        <section className="text-gray-300 text-sm mb-4 line-clamp-2">
          <TinaMarkdown
            content={body}
            components={{
              img: () => <></>,
            }}
          />
        </section>
        <ReadMore groupHover={groupHover} fileName={slug || ""} locale={locale} />
      </div>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="h-full **:data-[slot=skeleton]:bg-gray-light flex flex-col grow shrink-0 relative  bg-gradient-black rounded-xl overflow-hidden shadow-lg">
      <div className="rounded-md relative aspect-video">
        <div className="relative aspect-video ">
          <div className="inset-0 absolute align-middle items-center justify-center flex">
            <Skeleton className="rounded-md z-10 h-5/6 relative aspect-video" />
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col grow shrink-0 gap-3">
        <Skeleton className="w-36 rounded-full h-7" />
        <Skeleton className="w-5/6 rounded-md h-7" />
        <div className="flex gap-3 items-center">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-5 w-19 rounded-md" />
        </div>
        <Skeleton className="h-6 w-50 rounded-md" />
        <Skeleton className="h-10 mb-4 w-full rounded-md" />
        <Skeleton className="h-6 w-25 mt-auto rounded-md" />
      </div>
    </div>
  );
};

export { BlogCard, SkeletonCard };
