"use client";

import NextLink from "next/link";
import { useContextualLink } from "@utils/contextualLink";

// The body-text link standard (#859). The text stays white on hover and the
// underline turns SSW red: red text on our dark backgrounds is only ~3.3:1,
// under the AA minimum, which is what the Design System's dark mode does too
const LINK_CLASSES =
  "text-white underline transition-colors hover:decoration-ssw-red";

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
