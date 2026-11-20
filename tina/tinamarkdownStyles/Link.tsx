"use client";

import NextLink from "next/link";
import { useContextualLink } from "@utils/contextualLink";
import { LINK_CLASSES } from "./linkClasses";

const Link = (props: { url: string; children: React.ReactNode } | undefined) => {
  const contextualHref = useContextualLink();
  
  if (!props?.url) return <span>{props?.children}</span>;

  const isExternal = props.url.startsWith('http') || props.url.startsWith('#');
  
  if (isExternal) {
    return (
      <a
        href={props.url}
        className={LINK_CLASSES}
        {...(props.url.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {props.children}
      </a>
    );
  }

  return (
    <NextLink
      href={contextualHref(props.url)}
      className={LINK_CLASSES}
    >
      {props.children}
    </NextLink>
  );
};

export default Link;
