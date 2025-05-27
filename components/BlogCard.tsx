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

type BlogCardProps = Modify<
  Blog,
  { author?: AuthorType | null; slug?: string | null; groupHover?: boolean }
>;

export const BlogCard = ({
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
  return (
    <div className="h-full flex flex-col grow shrink-0 relative border bg-gradient-black border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
      {groupHover && (
        <Link href={`/blog/${slug}`} className="absolute inset-0 z-20" />
      )}
      <div className="relative aspect-video ">
        <div className="inset-0 absolute align-middle items-center justify-center flex">
          {bannerImage && (
            <div
              className={cn(
                groupHover && "group-hover:scale-105",
                "rounded-md transition-transform duration-700 mask-[linear-gradient(black,black,transparent)] z-10 h-5/6 relative overflow-hidden aspect-video"
              )}
            >
              <Image
                alt=""
                fill
                objectFit="cover"
                aria-hidden={true}
                src={bannerImage}
              />
            </div>
          )}
        </div>
        <div className="w-full h-full mask-[linear-gradient(black,black,transparent)]">
          <GridBackground />
        </div>
      </div>
      <div className="grow shrink-0 gap-3 flex flex-col p-6">
        {category && (
          <CategoryLabel className="text-sm">{category}</CategoryLabel>
        )}
        <Link className="w-fit" href={`/blog/${slug}`}>
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
          <TinaMarkdown content={body} />
        </section>
        <ReadMore groupHover={groupHover} fileName={slug || ""} />
      </div>
    </div>
  );
};
