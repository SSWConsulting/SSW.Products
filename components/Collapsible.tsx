"use client";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { useId, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLDivElement | null>(null);

  const headingKey = `h${Math.min(4, Math.max(2, level))}` as "h2" | "h3" | "h4";
  const HeadingComponent = (DocAndBlogMarkdownStyle as any)[headingKey];

  const toggle = () => setOpen((v) => !v);

  return (
    <section className="my-4">
      <div className="flex items-center gap-2">
        <div className="-mt-6">
          <HeadingComponent className="m-0 text-lg font-semibold inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2">
              {title}
              {icon ? (
                <img
                  src={icon}
                  alt=""
                  className="inline-block align-middle"
                  loading="lazy"
                />
              ) : null}
            </span>
          </HeadingComponent>
        </div>
      </div>

      {!open && (
        <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="
          mt-1 inline-flex items-center gap-1
          rounded-full border border-white/30
          bg-white/5 px-3 py-1
          text-xs  hover:border-white
          cursor-pointer
        "
      >
        <span>Show</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      )}

      <div
        id={panelId}
        aria-hidden={!open}
        className={`
          mt-3 overflow-hidden transition-all duration-300
          ${open ? "max-h-full opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"}
        `}
      >
        <div ref={contentRef} className="space-y-4">
          {content && (
            <TinaMarkdown
              content={content}
              components={DocAndBlogMarkdownStyle}
            />
          )}

          {open && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={panelId}
              className="
                mt-1 inline-flex items-center gap-1
                rounded-full border border-white/30
                bg-white/5 px-3 py-1
                text-xs  hover:border-white
                cursor-pointer
              "
            >
              <span>Hide</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          
          )}
        </div>
      </div>
    </section>
  );
}
