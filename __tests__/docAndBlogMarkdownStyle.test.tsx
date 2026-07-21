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
  it("anchors headings receiving tina's nested rich-text children", () => {
    // Regression: TinaMarkdown passes a heading's text as a nested
    // <TinaMarkdown content={ast}> element (text under props.content), not as
    // plain string children. tinacms itself is ESM-only so we replicate that
    // exact children shape instead of importing the real renderer.
    const NestedMarkdown = () => null;
    const Heading = DocAndBlogMarkdownStyle.h2!;
    render(
      <Heading>
        {
          <NestedMarkdown
            {...({
              content: [{ type: "text", text: "Connect Your GitHub Account" }],
            } as Record<string, unknown>)}
          />
        }
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "connect-your-github-account");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "#connect-your-github-account",
    );
  });

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
