/**
 * @jest-environment jsdom
 */
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// tinacms is ESM-only; the field metadata doesn't affect the anchor markup
jest.mock("tinacms/dist/react", () => ({ tinaField: () => "" }));

import FAQ from "../components/shared/Blocks/FAQ";

const data = {
  headline: "Frequently asked questions",
  text: "",
  questions: [
    { question: "What file formats do you support?", answer: "Most of them." },
    { question: "Is it easy to use?", answer: "Yes." },
  ],
};

const panelOf = (question: HTMLElement) =>
  question.querySelector("div[style]") as HTMLElement;

describe("FAQ question anchors", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("gives each question an id and a self-link", () => {
    const { container } = render(<FAQ data={data} />);

    const question = container.querySelector(
      "#what-file-formats-do-you-support",
    );
    expect(question).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Link to this section" })[0],
    ).toHaveAttribute("href", "#what-file-formats-do-you-support");
  });

  it("opens the linked question so the answer isn't hidden", () => {
    window.location.hash = "#is-it-easy-to-use";
    const { container } = render(<FAQ data={data} />);

    const linked = container.querySelector("#is-it-easy-to-use") as HTMLElement;
    const other = container.querySelector(
      "#what-file-formats-do-you-support",
    ) as HTMLElement;

    expect(panelOf(linked)).toHaveStyle({ maxHeight: "500px", opacity: "1" });
    expect(panelOf(other)).toHaveStyle({ maxHeight: "0", opacity: "0" });
  });

  it("opens a question when the hash changes on the page", () => {
    const { container } = render(<FAQ data={data} />);
    const question = container.querySelector(
      "#is-it-easy-to-use",
    ) as HTMLElement;
    expect(panelOf(question)).toHaveStyle({ maxHeight: "0" });

    act(() => {
      window.location.hash = "#is-it-easy-to-use";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(panelOf(question)).toHaveStyle({ maxHeight: "500px" });
  });
});
