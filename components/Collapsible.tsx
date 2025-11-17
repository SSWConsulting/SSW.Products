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

  const h = Math.min(6, Math.max(2, level));
  
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
          className="mt-1 text-sm text-white underline-offset-2 underline"
        >
          Show &gt;
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
              className="mt-2 text-sm text-white underline-offset-2 underline"
            >
              &lt; Hide
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
