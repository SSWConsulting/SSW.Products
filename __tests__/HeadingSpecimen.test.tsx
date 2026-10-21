/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import HeadingSpecimen from "../components/shared/Blocks/HeadingSpecimen";

describe("HeadingSpecimen", () => {
  it("renders a sample for every heading level, as <p>s styled by the .h1-.h6 classes", () => {
    render(<HeadingSpecimen />);

    const samples = screen.getAllByText("The quick brown fox");
    // samples are <p> (not real headings) so /media keeps a single <h1>
    expect(samples.every((el) => el.tagName.toLowerCase() === "p")).toBe(true);
    // each borrows a level's look via its .hN class
    const levels = samples
      .map((el) =>
        ["h1", "h2", "h3", "h4", "h5", "h6"].find((h) => el.classList.contains(h))
      )
      .sort();
    expect(levels).toEqual(["h1", "h2", "h3", "h4", "h5", "h6"]);
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

    // the title's own self-link, then the one rule the intro cites
    expect(hrefs).toEqual([
      "#headings",
      "https://www.ssw.com.au/rules/use-heading-tags-h1-h2-h3",
    ]);
  });
});
