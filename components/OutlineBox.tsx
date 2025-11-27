"use client";

import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";

export type OutlineBoxProps = {
  content?: TinaMarkdownContent | TinaMarkdownContent[];
};

export default function OutlineBox({ content }: OutlineBoxProps) {
  return (
    <section className="my-6 rounded-md border border-zinc-600 bg-zinc-900/40 p-4 md:p-6">
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
