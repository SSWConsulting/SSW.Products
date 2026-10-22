/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// lucide-react, tinacms and the markdown styles (shiki) are ESM-only; none of
// the download icon, rich-text renderer or code highlighting affects the
// heading structure under test
jest.mock("lucide-react", () => ({ Download: () => null }));
jest.mock("tinacms/dist/rich-text", () => ({ TinaMarkdown: () => null }));
jest.mock("../tina/tinamarkdownStyles/DocAndBlogMarkdownStyle", () => ({
  DocAndBlogMarkdownStyle: {},
}));

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
