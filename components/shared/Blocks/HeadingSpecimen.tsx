import { ReactNode } from "react";
import LinkableHeading from "../LinkableHeading";

interface HeadingSpecimenProps {
  title?: string;
  description?: ReactNode;
  /** h3 when nested under the Typography section; h2 if ever used standalone. */
  headingLevel?: "h2" | "h3";
}

// Each sample is a <p> that borrows a level's look via the `.h1`–`.h6` classes
// (not a real heading), so the /media page keeps a single <h1>. Those classes
// alias the same @apply rules in globals.css (@layer base), so if the base
// scale changes this specimen changes with it — it can't drift. The `spec`
// captions mirror those tokens as plain text for designers.
//
// Rendered from code (not a Tina block) on /media, so it needs no schema change.
const LEVELS = [
  { tag: "h1", spec: "Bold 700 · 36 → 48px · line-height 1.1" },
  { tag: "h2", spec: "Semibold 600 · 24 → 30px · line-height 1.2" },
  { tag: "h3", spec: "Semibold 600 · 18 → 20px · line-height 1.4" },
  { tag: "h4", spec: "Semibold 600 · 16 → 18px · line-height 1.5" },
  { tag: "h5", spec: "Semibold 600 · 16px · line-height 1.5" },
  { tag: "h6", spec: "Semibold 600 · 16px · line-height 1.5" },
] as const;

// The rule the scale is built on, linked from the words it applies to - a
// designer reading the brand kit can get to the why without leaving the page.
const RULES = {
  level: "https://www.ssw.com.au/rules/use-heading-tags-h1-h2-h3",
} as const;

const RuleLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white underline transition-colors hover:text-ssw-red"
  >
    {children}
  </a>
);

const DEFAULT_DESCRIPTION = (
  <>
    The six heading levels used across YakShaver. They render live from the
    site&rsquo;s base styles, so they always match what you see on the pages.{" "}
    Use <RuleLink href={RULES.level}>exactly one H1 per page</RuleLink>,
    don&rsquo;t skip levels, and don&rsquo;t use heading tags for text that
    isn&rsquo;t a heading.
  </>
);

export default function HeadingSpecimen({
  title = "Headings",
  description = DEFAULT_DESCRIPTION,
  headingLevel = "h2",
}: HeadingSpecimenProps) {
  return (
    <div className="py-8 px-4 mx-auto w-full max-w-300 md:px-12 sm:px-8 medium:px-0">
      {(title || description) && (
        <div className="text-center mb-12">
          {title && (
            <LinkableHeading as={headingLevel} className="mb-1">
              {title}
            </LinkableHeading>
          )}
          {description && (
            <p className="text-[14px] text-white font-medium leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
        {LEVELS.map(({ tag: Tag, spec }) => (
          <div
            key={Tag}
            className="flex flex-col gap-2 p-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
          >
            {/* the live sample: styled like each level, but a <p> so /media keeps one <h1> */}
            <p className={`${Tag} min-w-0`}>The quick brown fox</p>
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
}
