"use client";

import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import { useState } from "react";

/**
 * The QR images are pre-rendered PNGs rather than generated in the browser.
 *
 * They carry the YakShaver mark in a knockout at the centre, which is the same treatment the
 * portal's own QR component applies, and both have been checked to still decode with the mark
 * in place. Shipping them as assets keeps that treatment identical everywhere and costs the
 * page no client-side QR library.
 */
const QR_SOURCE = {
  en: "/YakShaver/QR/demo-qr-en.png",
  zh: "/YakShaver/QR/demo-qr-zh.png",
} as const;

/** Rendered at 2x the display size so the code stays crisp on retina screens. */
const QR_DISPLAY_PX = 176;

type DemoQrButtonProps = {
  label: string;
  caption: string;
  locale: "en" | "zh";
};

/**
 * Opens the demo QR code next to the hero's other calls to action.
 *
 * Opening on hover *and* on click, rather than linking somewhere: the code is only useful to
 * someone holding a phone, so there is nothing to navigate to on the device doing the hovering.
 * Hover alone would strand touch users, who never hover — Radix's Popover gives the click and
 * keyboard path for free, and the hover handlers layer pointer convenience on top of it.
 */
export function DemoQrButton({ label, caption, locale }: DemoQrButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          // Pointer events rather than CSS hover so the same open state serves hover, click and
          // focus; onFocus/onBlur would fight the click toggle, so keyboard users get the click path.
          onPointerEnter={() => setIsOpen(true)}
          onPointerLeave={() => setIsOpen(false)}
          className="bg-white hover:bg-white/80 text-[#222222] px-5 py-2 font-bold rounded-lg transition-all ease-in-out duration-300 border border-white uppercase flex items-center text-center justify-center gap-2 min-h-11"
        >
          {label}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          sideOffset={12}
          // The pointer has to cross the gap between trigger and card, so the card keeps itself
          // open while the pointer is over it. Without this it would close in that gap.
          onPointerEnter={() => setIsOpen(true)}
          onPointerLeave={() => setIsOpen(false)}
          // Hover-opened content must not steal focus, or the page jumps on mouse users.
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-50 rounded-2xl bg-white p-4 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          <Image
            src={QR_SOURCE[locale]}
            alt={caption}
            width={QR_DISPLAY_PX * 2}
            height={QR_DISPLAY_PX * 2}
            style={{ width: QR_DISPLAY_PX, height: QR_DISPLAY_PX }}
            className="rounded-lg"
            unoptimized
            // The popover renders into a portal, where lazy loading's viewport check never
            // resolves and leaves the code blank on first open. Nothing is deferred by loading
            // it eagerly: the image only mounts once the popover is already open.
            loading="eager"
          />
          <p className="mt-3 max-w-44 text-center text-sm leading-snug text-neutral-500">
            {caption}
          </p>
          <Popover.Arrow className="fill-white" width={18} height={9} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
