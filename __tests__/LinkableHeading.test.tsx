/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LinkableHeading from "../components/shared/LinkableHeading";

describe("LinkableHeading", () => {
  it("renders the heading with a slug id and a sibling self-link", () => {
    render(<LinkableHeading as="h2">Getting Started</LinkableHeading>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "getting-started");
    expect(heading).toHaveTextContent("Getting Started");
    const link = screen.getByRole("link", { name: "Link to this section" });
    expect(link).toHaveAttribute("href", "#getting-started");
    expect(link).not.toHaveTextContent("Getting Started");
  });

  it("keeps a content link and the self-link as siblings, never nested", () => {
    render(
      <LinkableHeading as="h2">
        See the <a href="https://example.com/docs">docs</a>
      </LinkableHeading>,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].contains(links[1])).toBe(false);
    expect(links[1].contains(links[0])).toBe(false);
  });

  it("renders the requested tag", () => {
    render(<LinkableHeading as="h3">Deep Dive</LinkableHeading>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute(
      "id",
      "deep-dive",
    );
  });

  it("prefers the anchor prop over children text", () => {
    render(
      <LinkableHeading as="h2" anchor="Simple, {transparent} pricing">
        <span>styled title</span>
      </LinkableHeading>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "id",
      "simple-transparent-pricing",
    );
  });

  it("preserves className and passes through extra props", () => {
    render(
      <LinkableHeading
        as="h2"
        className="text-4xl"
        data-tina-field="pricing.title"
      >
        Plans
      </LinkableHeading>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-4xl");
    expect(heading).toHaveClass("scroll-mt-28");
    expect(heading).toHaveAttribute("data-tina-field", "pricing.title");
  });

  it("keeps the computed slug id even if a caller passes id", () => {
    render(
      <LinkableHeading as="h2" id="caller-supplied">
        Getting Started
      </LinkableHeading>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "id",
      "getting-started",
    );
  });

  it("makes the heading text itself the link when wrap is set", () => {
    render(
      <LinkableHeading as="h2" wrap>
        Simple, transparent pricing
      </LinkableHeading>,
    );
    // the rule's good example: click the heading, or its icon, to get the URL
    const link = screen.getByRole("link", {
      name: "Simple, transparent pricing",
    });
    expect(link).toHaveAttribute("href", "#simple-transparent-pricing");
    expect(screen.getByRole("heading", { level: 2 })).toContainElement(link);
    expect(
      screen.queryByRole("link", { name: "Link to this section" }),
    ).not.toBeInTheDocument();
  });

  it("renders a plain heading when no slug can be made", () => {
    render(<LinkableHeading as="h2">{"!!!"}</LinkableHeading>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).not.toHaveAttribute("id");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
