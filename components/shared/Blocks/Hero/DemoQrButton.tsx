"use client";

import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import { useState } from "react";

/** Pre-rendered, not generated in the browser: the portal's knockout treatment stays
 * identical everywhere and the page ships no QR library. */
const QR_SOURCE = {
  en: "/YakShaver/QR/demo-qr-en.png",
  zh: "/YakShaver/QR/demo-qr-zh.png",
} as const;

/** Where each code above points; a touch device opens it directly. */
const DEMO_URL = {
  en: "https://demo.yakshaver.ai",
  zh: "https://portal.yakshaver.ai/yaksmasher/r/yak_pub_60945f82f4bf3d3f7032aba68f90aef2?demo=1&lang=zh",
} as const;

/** Rendered at 2x the display size so the code stays crisp on retina screens. */
const QR_DISPLAY_PX = 176;

const BUTTON_CLASSES =
  "bg-white hover:bg-white/80 text-[#222222] px-5 py-2 font-bold rounded-lg transition-all ease-in-out duration-300 border border-white uppercase flex items-center text-center justify-center gap-2 min-h-11";

type DemoQrButtonProps = {
  label: string;
  caption: string;
  locale: "en" | "zh";
};

/**
 * Opens the demo QR code beside the hero's other calls to action.
 *
 * A code is only useful on a second device, so on touch (pointer-coarse) the button is a plain
 * link to the demo instead: a phone can't scan its own screen. CSS picks which of the two shows,
 * so the right one is there before hydration. Radix's Popover gives the QR button a click and
 * keyboard path beside hover.
 */
export function DemoQrButton({ label, caption, locale }: DemoQrButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <a href={DEMO_URL[locale]} className={`${BUTTON_CLASSES} not-pointer-coarse:hidden`}>
        {label}
      </a>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            // Pointer events, not CSS hover, so one open state serves hover and click.
            onPointerEnter={() => setIsOpen(true)}
            onPointerLeave={() => setIsOpen(false)}
            className={`${BUTTON_CLASSES} pointer-coarse:hidden`}
          >
            {label}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="bottom"
            sideOffset={12}
            // Keeps itself open while the pointer crosses the gap from the trigger.
            onPointerEnter={() => setIsOpen(true)}
            onPointerLeave={() => setIsOpen(false)}
            // Hover-opened content must not steal focus, or the page jumps.
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
              // Lazy loading never resolves inside the portal and leaves the code blank on first
              // open; nothing is deferred anyway, as this mounts only once opened.
              loading="eager"
            />
            <p className="mt-3 max-w-44 text-center text-sm leading-snug text-neutral-500">
              {caption}
            </p>
            <Popover.Arrow className="fill-white" width={18} height={9} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
