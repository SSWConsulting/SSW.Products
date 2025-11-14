"use client";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { useId, useState } from "react";
import {
  TinaMarkdown,
  type TinaMarkdownContent,
} from "tinacms/dist/rich-text";

export type CollapsibleProps = {
  title: string;
  defaultOpen?: boolean;
  level?: number;
  content?: TinaMarkdownContent | TinaMarkdownContent[];
  icon?: string | null;
};

export default function Collapsible({
  title,
  defaultOpen = false,
  level = 4,
  content,
  icon,
}: CollapsibleProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const panelId = useId();

  const h = Math.min(6, Math.max(2, level));
  type Heading = `h2` | `h3` | `h4` | `h5` | `h6`;
  const HeadingTag = `h${h}` as Heading;

  return (
    <section className="my-4">
      <div className="flex items-center gap-2">
        <HeadingTag className="m-0 text-lg font-semibold inline-flex items-center gap-2">
          {title}
          {icon ? (
            <img
              src={icon}
              className="inline-block align-middle"
              loading="lazy"
            />
          ) : null}
        </HeadingTag>

        <button
          type="button"
          aria-controls={panelId}
          aria-expanded={open}
          aria-label={open ? "Collapse section" : "Expand section"}
          onClick={() => setOpen((v) => !v)}
          className=" inline-flex items-center justify-center rounded  text-white/80 hover:text-white transition w-8 h-8"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 14l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div id={panelId} hidden={!open} className="mt-3 space-y-4">
        {content && <TinaMarkdown content={content} components={DocAndBlogMarkdownStyle} />}  
      </div>
    </section>
  );
}
