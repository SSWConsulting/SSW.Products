"use client";
import Link from "@tina/tinamarkdownStyles/Link";
import { useContextualLocale } from "@utils/contextualLink";
import { ChevronRight } from "lucide-react";

const LABELS = {
  en: {
    nav: "Breadcrumb",
    home: "Home",
    blog: "Blog",
    docs: "Docs",
    thisPost: "This post",
    thisPage: "This page",
  },
  zh: {
    nav: "面包屑导航",
    home: "首页",
    blog: "博客",
    docs: "文档",
    thisPost: "本文",
    thisPage: "本页",
  },
};

type BreadcrumbsProps =
  | { kind: "blog" }
  | { kind: "docs"; section?: string | null };

// "Home > Blog > This post" / "Home > Docs > Section > This page". The last
// crumb is a fixed label, not the title, because the title is the heading
// right below it (https://www.ssw.com.au/rules/simplify-breadcrumbs/).
// A docs section has no page of its own, so it's plain text, not a link
const Breadcrumbs = (props: BreadcrumbsProps) => {
  const labels = LABELS[useContextualLocale()];

  const links =
    props.kind === "blog"
      ? [
          { label: labels.home, href: "/" },
          { label: labels.blog, href: "/blog" },
        ]
      : [
          { label: labels.home, href: "/" },
          { label: labels.docs, href: "/docs" },
        ];
  const section = props.kind === "docs" ? props.section : null;

  return (
    <nav aria-label={labels.nav}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-300">
        {links.map((link) => (
          <li key={link.href} className="flex items-center gap-2">
            {/* the shared body-text link, so the link standard lives in one place */}
            <Link url={link.href}>{link.label}</Link>
            <ChevronRight aria-hidden className="size-3.5 text-gray-400" />
          </li>
        ))}
        {section && (
          <li className="flex items-center gap-2 text-white">
            {section}
            <ChevronRight aria-hidden className="size-3.5 text-gray-400" />
          </li>
        )}
        <li aria-current="page">
          {props.kind === "blog" ? labels.thisPost : labels.thisPage}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
