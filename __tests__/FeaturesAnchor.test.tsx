/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// tinacms and motion are ESM-only, so jest can't parse them; none of them
// affect the anchor markup under test
jest.mock("tinacms/dist/react", () => ({ tinaField: () => "" }));
jest.mock("tinacms/dist/rich-text", () => ({ TinaMarkdown: () => null }));
jest.mock("../src/components/magicui/word-rotate", () => ({
  WordRotate: () => null,
}));

import FeatureBlocks from "../components/shared/Blocks/Features";

// The headline is rendered once per responsive view mode, so the anchor id sits
// on the block wrapper rather than on a heading that is hidden at some widths.
const feature = {
  headline: "Transform Company Emails Into Data Insights",
  headlineAfter: "",
  words: [],
  buttons: [],
  media: [],
  text: undefined,
  isReversed: false,
  hasBackground: false,
};

describe("Features block anchors", () => {
  it("puts the slug on the block wrapper and renders a single self-link", () => {
    const { container } = render(
      // @ts-expect-error partial fixture: only the fields the anchor needs
      <FeatureBlocks data={{ featureItem: [feature] }} index={0} />,
    );

    const slug = "transform-company-emails-into-data-insights";
    const wrapper = container.querySelector(`#${slug}`);
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("group");

    const links = screen.getAllByRole("link", { name: "Link to this section" });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", `#${slug}`);
  });

  it("renders no anchor when the feature has no headline text", () => {
    const { container } = render(
      // @ts-expect-error partial fixture: only the fields the anchor needs
      <FeatureBlocks data={{ featureItem: [{ ...feature, headline: "" }] }} index={0} />,
    );

    expect(container.querySelector("[id]")).toBeNull();
    expect(
      screen.queryByRole("link", { name: "Link to this section" }),
    ).not.toBeInTheDocument();
  });
});
