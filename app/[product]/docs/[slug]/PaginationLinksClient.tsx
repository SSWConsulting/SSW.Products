"use client";

import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useContextualLink } from "@utils/contextualLink";

interface PaginationLink {
  title: string;
  slug: string;
}

export default function PaginationLinksClient({
  prev,
  next,
}: {
  prev: PaginationLink | null;
  next: PaginationLink | null;
}) {
  const contextualHref = useContextualLink();

  return (
    <div className="flex justify-between py-12 rounded-lg overflow-hidden">
      {prev ? (
        <Link
          href={contextualHref(`/docs/${prev.slug}`)}
          className="flex gap-2 items-center text-white/60 hover:text-white transition-all duration-300"
        >
          <FaArrowLeft />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div></div>
      )}

      {next ? (
        <Link
          href={contextualHref(`/docs/${next.slug}`)}
          className="flex gap-2 text-end items-center text-white/60 hover:text-white transition-all duration-300 "
        >
          <span>{next.title}</span>
          <FaArrowRight />
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}