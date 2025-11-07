import { YouTubeEmbed } from "@comps/shared/YouTubeEmbed";
import Image from "next/image";
import { Components } from "tinacms/dist/rich-text";

import Link from "./Link";
import { ImageEmbed } from "@comps/shared/Blocks/ImageEmbed";
export const DocAndBlogMarkdownStyle: Components<{
  Youtube: { thumbnail?: string; externalVideoLink?: string; size?: string };
  imageEmbed: { src?: string; alt?: string; size?: string; showBorder?: boolean
  };

}> = {
  Youtube: (props) => {
    let sizeClass = "w-full h-auto max-w-[560px]";
    if (props.size === "large") {
      sizeClass = "w-full h-auto max-w-[800px]";
    }
    return (
      <div className="youtube-container mb-2">
        <YouTubeEmbed
          className={sizeClass}
          src={props.externalVideoLink}
          placeholder={props.thumbnail}
        />
      </div>
    );
  },
  imageEmbed: (props) => <ImageEmbed data={props} />,
  p: (props) => <p className="text-base font-light mb-4">{props?.children}</p>,

  h1: (props) => (
    <h1 className="text-3xl font-bold mb-4 mt-4">{props?.children}</h1>
  ),

  h2: (props) => (
    <h2 className="text-2xl font-semibold mb-4 mt-8">{props?.children}</h2>
  ),

  h3: (props) => (
    <h3 className="text-xl font-semibold mb-4 mt-8">{props?.children}</h3>
  ),

  h4: (props) => (
    <h4 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2">{props?.children}</h4>
  ),
  // @ts-ignore - TODO: remove tsignore after typescript definitions for blockquotes are fixed 
  // https://github.com/tinacms/tinacms/pull/6083
  blockquote: (props) => (
    <blockquote className="p-4 my-4 border-s-4 border-white/20">{props?.children}</blockquote>
  ),

  ol: (props) => (
    <ol className="list-decimal ps-7 font-light mb-4">{props?.children}</ol>
  ),

  ul: (props) => (
    <ul className="list-disc ps-7 font-light mb-4">{props?.children}</ul>
  ),

  li: (props) => <li className="mb-4">{props?.children}</li>,

  lic: (props) => <span>{props?.children}</span>, // For inline list content

  a: (props) => Link(props),

  img: (props) => {
    const isSmallIcon = props?.alt?.toLowerCase().includes("icon");
  
    if (isSmallIcon) {
      return (
        <span className="inline-flex items-center align-middle">
          <img
            src={props?.url || ""}
            alt={props?.caption || props?.alt}
            loading="lazy"
            className="inline-block align-middle opacity-80"
          />
        </span>
      );
    }
  
    return (
      <>
        <Image
          src={props?.url || ""}
          alt={props?.caption || props?.alt || "Image"}
          width={800}
          height={600}
          className="max-w-full h-auto rounded mt-4 mb-2 shadow-lg p-1 bg-gray-300"
        />
        {props?.caption && (
          <p className="text-sm text-gray-600 mb-2 text-center">
            {props?.caption}
          </p>
        )}
      </>
    );
  },
};
