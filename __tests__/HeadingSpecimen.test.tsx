/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import HeadingSpecimen from "../components/shared/Blocks/HeadingSpecimen";

describe("HeadingSpecimen", () => {
  it("renders a live sample of every heading level, h1 through h6", () => {
    render(<HeadingSpecimen />);

    // one sample per level; each is a real heading element so it inherits the
    // base scale from globals.css rather than hard-coded classes
    const samples = screen.getAllByText("The quick brown fox");
    const tags = samples.map((el) => el.tagName.toLowerCase()).sort();
    expect(tags).toEqual(["h1", "h2", "h3", "h4", "h5", "h6"]);
  });

  it("renders its own title at the level it is given", () => {
    const { container } = render(<HeadingSpecimen headingLevel="h3" />);

    expect(container.querySelector("#headings")?.tagName.toLowerCase()).toBe(
      "h3",
    );
  });

  it("anchors the section title and cites the SSW Rules in its intro", () => {
    render(<HeadingSpecimen />);

    const hrefs = screen
      .getAllByRole("link")
      .map((el) => el.getAttribute("href"));

    // the title's own self-link, then the rule behind each piece of advice
    expect(hrefs).toEqual([
      "#headings",
      "https://www.ssw.com.au/rules/use-heading-tags-h1-h2-h3",
      "https://www.ssw.com.au/rules/make-title-h1-and-h2-tags-descriptive",
      "https://www.ssw.com.au/rules/heading-to-anchor-targets",
    ]);
  });
});
