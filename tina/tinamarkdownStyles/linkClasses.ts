// The body-text link standard (#859). The text stays white on hover and the
// underline turns SSW red: red text on our dark backgrounds is only ~3.3:1,
// under the AA minimum, which is what the Design System's dark mode does too.
// Kept out of Link.tsx ("use client") so server components can import it as a
// plain string rather than a client reference.
export const LINK_CLASSES =
  "text-white underline transition-colors hover:decoration-ssw-red";
