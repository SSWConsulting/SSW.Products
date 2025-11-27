"use client";

import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";

export type OutlineBoxProps = {
  content?: TinaMarkdownContent | TinaMarkdownContent[];
};

export default function OutlineBox({ content }: OutlineBoxProps) {
  return (
    <section className="my-6 rounded-md border border-white/20 px-4 py-5">
      <div>
        {content && (
          <TinaMarkdown
            content={content}
            components={DocAndBlogMarkdownStyle}
          />
        )}
      </div>
    </section>
  );
}
