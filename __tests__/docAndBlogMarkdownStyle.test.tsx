/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DocAndBlogMarkdownStyle } from "../tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";

// CodeBlock drags in shiki (ESM-only, jest can't parse it) and is irrelevant here
jest.mock("../components/shared/code-block/code-block", () => ({
  CodeBlock: () => null,
}));

describe("DocAndBlogMarkdownStyle headings", () => {
  it.each([
    ["h1", 1],
    ["h2", 2],
    ["h3", 3],
    ["h4", 4],
  ] as const)("%s renders an anchor-linked heading", (key, level) => {
    const Heading = DocAndBlogMarkdownStyle[key]!;
    render(<Heading>{`Install Guide ${key}`}</Heading>);
    const heading = screen.getByRole("heading", { level });
    expect(heading).toHaveAttribute("id", `install-guide-${key}`);
    expect(
      screen.getByRole("link", { name: `Install Guide ${key}` }),
    ).toHaveAttribute("href", `#install-guide-${key}`);
  });
});
