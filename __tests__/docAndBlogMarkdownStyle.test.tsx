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
    // Regression: tina passes heading text as a nested element (props.content),
    // not a string. tinacms is ESM-only so we replicate that child shape here.
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
    ["h5", 5],
    ["h6", 6],
  ] as const)("%s renders an anchor-linked heading", (key, level) => {
    const Heading = DocAndBlogMarkdownStyle[key]!;
    render(
      <Heading>
        {/* fragment satisfies tina's JSX.Element child typing */}
        <>{`Install Guide ${key}`}</>
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level });
    expect(heading).toHaveAttribute("id", `install-guide-${key}`);
    expect(heading).toHaveTextContent(`Install Guide ${key}`);
    expect(
      screen.getByRole("link", { name: "Link to this section" }),
    ).toHaveAttribute("href", `#install-guide-${key}`);
  });
});
