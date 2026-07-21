/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LinkableHeading from "../components/shared/LinkableHeading";

describe("LinkableHeading", () => {
  it("renders an h2 by default with slug id and self-link", () => {
    render(<LinkableHeading>Getting Started</LinkableHeading>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "getting-started");
    const link = screen.getByRole("link", { name: "Getting Started" });
    expect(link).toHaveAttribute("href", "#getting-started");
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
      <LinkableHeading anchor="Simple, {transparent} pricing">
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
      <LinkableHeading className="text-4xl" data-tina-field="pricing.title">
        Plans
      </LinkableHeading>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-4xl");
    expect(heading).toHaveClass("scroll-mt-28");
    expect(heading).toHaveAttribute("data-tina-field", "pricing.title");
  });

  it("renders a plain heading when no slug can be made", () => {
    render(<LinkableHeading>{"!!!"}</LinkableHeading>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).not.toHaveAttribute("id");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
