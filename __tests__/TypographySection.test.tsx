/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import TypographySection from "../components/shared/Blocks/TypographySection";

const fonts = { title: "Fonts", images: [] };

describe("TypographySection", () => {
  it("nests Fonts and Headings as h3s under one Typography h2", () => {
    const { container } = render(<TypographySection fonts={fonts} />);

    const section = ["#typography", "#fonts", "#headings"].map((id) => {
      const el = container.querySelector(id);
      return [el?.tagName.toLowerCase(), el?.textContent?.trim()];
    });

    expect(section).toEqual([
      ["h2", "Typography"],
      ["h3", "Fonts"],
      ["h3", "Headings"],
    ]);
  });
});
