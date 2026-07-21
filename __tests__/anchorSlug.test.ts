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
});
