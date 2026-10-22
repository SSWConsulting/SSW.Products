/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DemoQrButton } from "../components/shared/Blocks/Hero/DemoQrButton";

// What public/YakShaver/QR/demo-qr-{en,zh}.png decode to: the touch link must land where a scan would.
const SCANNED_URL = {
  en: "https://demo.yakshaver.ai",
  zh: "https://portal.yakshaver.ai/yaksmasher/r/yak_pub_60945f82f4bf3d3f7032aba68f90aef2?demo=1&lang=zh",
} as const;

// Radix's popover measures its arrow with ResizeObserver, which jsdom lacks.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("DemoQrButton", () => {
  it.each(["en", "zh"] as const)("links touch devices straight to the %s demo", (locale) => {
    render(<DemoQrButton label="Try it now" caption="Scan me" locale={locale} />);
    expect(screen.getByRole("link", { name: "Try it now" })).toHaveAttribute(
      "href",
      SCANNED_URL[locale],
    );
  });

  it.each(["en", "zh"] as const)("shows the %s QR code, the one that link pairs with", async (locale) => {
    render(<DemoQrButton label="Try it now" caption="Scan me" locale={locale} />);
    fireEvent.click(screen.getByRole("button", { name: "Try it now" }));
    expect(await screen.findByAltText("Scan me")).toHaveAttribute(
      "src",
      `/YakShaver/QR/demo-qr-${locale}.png`,
    );
  });

  // jsdom can't evaluate media queries, so pin the complementary variants that swap the two.
  it("shows the link only on coarse pointers and the QR button everywhere else", () => {
    render(<DemoQrButton label="Try it now" caption="Scan me" locale="zh" />);
    expect(screen.getByRole("link", { name: "Try it now" })).toHaveClass(
      "not-pointer-coarse:hidden",
    );
    expect(screen.getByRole("button", { name: "Try it now" })).toHaveClass(
      "pointer-coarse:hidden",
    );
  });
});
