// The body-text link standard (#859): white and underlined, and on hover the
// text turns ssw-red-light (the underline follows the text colour). Not ssw-red: red text on our dark
// backgrounds is only ~3.3:1, under the AA minimum; ssw-red-light is ~5:1.
// Kept out of Link.tsx ("use client") so server components can import it as a
// plain string rather than a client reference.
export const LINK_CLASSES =
  "text-white underline transition-colors hover:text-ssw-red-light";

// A standalone link: a short label on its own line (Try It Now's "Learn more",
// blog authors, previous/next article). Its position already says it's a link,
// so it has no underline until hover, then turns red like a body link.
export const STANDALONE_LINK_CLASSES =
  "font-semibold transition-colors hover:text-ssw-red-light hover:underline";
