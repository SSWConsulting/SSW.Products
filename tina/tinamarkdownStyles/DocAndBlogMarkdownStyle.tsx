import { YouTubeEmbed } from "@comps/shared/YouTubeEmbed";
import Image from "next/image";
import { Components } from "tinacms/dist/rich-text";

import Link from "./Link";
export const DocAndBlogMarkdownStyle: Components<{
  Youtube: { thumbnail?: string; externalVideoLink?: string; size?: string };
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
    <h4 className="text-lg font-semibold mb-3 mt-6">{props?.children}</h4>
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

  img: (props) => (
    <>
      <Image
        src={props?.url || ""}
        alt={props?.caption || "Image"}
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
  ),
};
