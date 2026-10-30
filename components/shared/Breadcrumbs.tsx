"use client";
import { useContextualLink, useContextualLocale } from "@utils/contextualLink";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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
  | { kind: "docs"; section?: { title: string; href: string } | null };

// "Home > Blog > This post" / "Home > Docs > Section > This page". The last
// crumb is a fixed label, not the title, because the title is the heading
// right below it (https://www.ssw.com.au/rules/simplify-breadcrumbs/)
const Breadcrumbs = (props: BreadcrumbsProps) => {
  const contextualHref = useContextualLink();
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
          ...(props.section ? [{ label: props.section.title, href: props.section.href }] : []),
        ];

  return (
    <nav aria-label={labels.nav}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-300">
        {links.map((link) => (
          <li key={link.href} className="flex items-center gap-2">
            <Link
              href={contextualHref(link.href)}
              className="text-white underline underline-offset-4 hover:text-ssw-red transition-colors"
            >
              {link.label}
            </Link>
            <ChevronRight aria-hidden className="size-3.5 text-gray-400" />
          </li>
        ))}
        <li aria-current="page">
          {props.kind === "blog" ? labels.thisPost : labels.thisPage}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
