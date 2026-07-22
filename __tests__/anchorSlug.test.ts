import { extractText, slugifyHeading } from "../utils/anchorSlug";
import { createElement } from "react";

describe("slugifyHeading", () => {
  it("lowercases and dashes words", () => {
    expect(slugifyHeading("Getting Started")).toBe("getting-started");
  });

  it("strips punctuation", () => {
    expect(slugifyHeading("What's New, Today?")).toBe("whats-new-today");
  });

  it("strips curly brace formatter markers", () => {
    expect(slugifyHeading("Simple, {transparent} pricing")).toBe(
      "simple-transparent-pricing",
    );
  });

  it("keeps unicode letters", () => {
    expect(slugifyHeading("视频教程")).toBe("视频教程");
  });

  it("collapses whitespace and trims dashes", () => {
    expect(slugifyHeading("  Multi   Space -- Here ")).toBe("multi-space-here");
  });

  it("converts underscores to dashes", () => {
    expect(slugifyHeading("hello_world")).toBe("hello-world");
  });

  it("returns empty string when nothing sluggable remains", () => {
    expect(slugifyHeading("!!! ???")).toBe("");
  });
});

describe("extractText", () => {
  it("returns strings and numbers as-is", () => {
    expect(extractText("Hello")).toBe("Hello");
    expect(extractText(42)).toBe("42");
  });

  it("flattens arrays and nested elements", () => {
    const node = createElement(
      "span",
      null,
      "Hello ",
      createElement("strong", null, "World"),
    );
    expect(extractText([node, "!"])).toBe("Hello World!");
  });

  it("ignores null, undefined and booleans", () => {
    expect(extractText(null)).toBe("");
    expect(extractText(undefined)).toBe("");
    expect(extractText(true)).toBe("");
  });

  it("reads tina rich-text AST via a content prop", () => {
    const nested = createElement("div", {
      content: [
        { type: "text", text: "Connect " },
        { type: "text", text: "GitHub", bold: true },
      ],
    } as Record<string, unknown>);
    expect(extractText(nested)).toBe("Connect GitHub");
  });

  it("reads plain AST nodes with children", () => {
    expect(
      extractText({
        type: "h2",
        children: [{ type: "text", text: "Install" }],
      }),
    ).toBe("Install");
  });
});
