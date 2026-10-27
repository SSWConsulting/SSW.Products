// Mocks for the ESM-only packages Jest cannot parse. They live here rather
// than in each test, because a test earns one by importing a component that
// happens to pull one in - not because it has anything to say about them.
// A test that needs the real module can jest.unmock it.

// Any icon renders as nothing; the Proxy covers every named export.
jest.mock("lucide-react", () => {
  const Icon = () => null;
  return new Proxy(
    { __esModule: true },
    { get: (t, prop) => (prop in t ? t[prop as keyof typeof t] : Icon) },
  );
});

jest.mock("tinacms/dist/rich-text", () => ({ TinaMarkdown: () => null }));
jest.mock("tinacms/dist/react", () => ({ tinaField: () => "" }));

// CodeBlock drags in shiki, which is ESM-only.
jest.mock("./components/shared/code-block/code-block", () => ({
  CodeBlock: () => null,
}));
