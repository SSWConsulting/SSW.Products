/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// lucide-react, tinacms rich-text and the markdown styles (shiki) are ESM-only
// and irrelevant to the null-images crash under test.
jest.mock("lucide-react", () => ({ Download: () => null }));
jest.mock("tinacms/dist/rich-text", () => ({ TinaMarkdown: () => null }));
jest.mock("../tina/tinamarkdownStyles/DocAndBlogMarkdownStyle", () => ({
  DocAndBlogMarkdownStyle: {},
}));

import ImageGrid from "../components/shared/Blocks/ImageGrid";

describe("ImageGrid", () => {
  // Regression for #649: a freshly-added Tina block sends `images: null`, which
  // a default param doesn't cover — reading `.length` on it crashed the editor.
  it("does not crash when images is null", () => {
    expect(() =>
      render(<ImageGrid images={null as never} title="Fonts" />)
    ).not.toThrow();
  });

  it("renders nothing for a brand-new empty block (null images, no title/description)", () => {
    const { container } = render(<ImageGrid images={null as never} />);
    expect(container).toBeEmptyDOMElement();
  });
});
