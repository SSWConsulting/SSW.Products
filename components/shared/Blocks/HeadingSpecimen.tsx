import { TinaMarkdown } from "tinacms/dist/rich-text";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import LinkableHeading from "../LinkableHeading";

interface HeadingSpecimenProps {
  title?: string | null;
  description?: any;
}

// The samples render as the real h1–h6 elements with no utility classes, so
// they inherit the single source of truth in globals.css (@layer base). If the
// base scale ever changes, this specimen changes with it — it can't drift.
// `spec` captions mirror those @apply tokens as plain text for designers.
const LEVELS = [
  { tag: "h1", spec: "Bold 700 · 36 → 48px · line-height 1.1" },
  { tag: "h2", spec: "Semibold 600 · 24 → 30px · line-height 1.2" },
  { tag: "h3", spec: "Semibold 600 · 18 → 20px · line-height 1.4" },
  { tag: "h4", spec: "Semibold 600 · 16 → 18px · line-height 1.5" },
  { tag: "h5", spec: "Semibold 600 · 16px · line-height 1.5" },
  { tag: "h6", spec: "Semibold 600 · 16px · line-height 1.5" },
] as const;

const HeadingSpecimen = ({ title, description }: HeadingSpecimenProps) => {
  return (
    <div className="py-8 px-4 mx-auto w-full max-w-300 md:px-12 sm:px-8 medium:px-0">
      {(title || description) && (
        <div className="text-center mb-12">
          {title && (
            <LinkableHeading as="h2" className="mb-1">
              {title}
            </LinkableHeading>
          )}
          {description && (
            <div className="text-[14px] text-white font-medium leading-relaxed max-w-3xl mx-auto">
              <TinaMarkdown
                components={DocAndBlogMarkdownStyle}
                content={description}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
        {LEVELS.map(({ tag: Tag, spec }) => (
          <div
            key={Tag}
            className="flex flex-col gap-2 p-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
          >
            {/* the live sample: a real heading element, no classes, so it shows
                exactly how this level renders across the site */}
            <Tag className="min-w-0">The quick brown fox</Tag>
            <p className="shrink-0 font-mono text-xs uppercase tracking-wide text-white/50 md:text-right">
              <span className="text-white/70">{Tag.toUpperCase()}</span>
              {" · "}
              {spec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeadingSpecimen;
