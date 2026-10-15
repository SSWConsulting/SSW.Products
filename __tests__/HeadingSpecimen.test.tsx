/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// tinacms's rich-text and the CodeBlock (via shiki) are ESM-only, jest can't
// parse them, and neither is exercised here (the cases omit the description)
jest.mock("tinacms/dist/rich-text", () => ({ TinaMarkdown: () => null }));
jest.mock("../components/shared/code-block/code-block", () => ({
  CodeBlock: () => null,
}));

import HeadingSpecimen from "../components/shared/Blocks/HeadingSpecimen";

describe("HeadingSpecimen", () => {
  it("renders a live sample of every heading level, h1 through h6", () => {
    render(<HeadingSpecimen title="Headings" />);

    // one sample per level; each is a real heading element so it inherits the
    // base scale from globals.css rather than hard-coded classes
    const samples = screen.getAllByText("The quick brown fox");
    const tags = samples.map((el) => el.tagName.toLowerCase()).sort();
    expect(tags).toEqual(["h1", "h2", "h3", "h4", "h5", "h6"]);
  });

  it("anchors the section title, not the samples", () => {
    const { container } = render(<HeadingSpecimen title="Headings" />);

    // the section title carries the slug id and the only self-link on the block
    expect(container.querySelector("#headings")?.tagName.toLowerCase()).toBe(
      "h2",
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "#headings");
  });

  it("renders the samples even with no title or description", () => {
    render(<HeadingSpecimen />);
    expect(screen.getAllByText("The quick brown fox")).toHaveLength(6);
    // no section title means no anchor link
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
