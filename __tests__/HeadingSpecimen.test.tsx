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

  it("anchors the section title, not the samples", () => {
    const { container } = render(<HeadingSpecimen />);

    // the default title "Headings" carries the slug id and the only self-link
    expect(container.querySelector("#headings")?.tagName.toLowerCase()).toBe(
      "h2",
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "#headings");
  });
});
