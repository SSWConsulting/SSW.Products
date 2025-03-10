import { Components } from "tinacms/dist/rich-text";

export const MdxGradient = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
    {children}
  </span>
);

export const TestMarkdownStyle: Components<{ MdxGradient: {} }> = {
  MdxGradient: ({ children }) => <MdxGradient>{children}</MdxGradient>,

  p: (props) => <p className="text-base font-light mb-4">{props?.children}</p>,

  h1: (props) => (
    <h1 className="text-3xl font-bold mb-6 mt-4">{props?.children}</h1>
  ),

  h2: (props) => (
    <h2 className="text-2xl font-semibold mb-5 mt-4">{props?.children}</h2>
  ),

  h3: (props) => (
    <h3 className="text-xl font-semibold mb-4 mt-3">{props?.children}</h3>
  ),

  ol: (props) => (
    <ol className="list-decimal font-light list-inside pl-6 mb-4">
      {props?.children}
    </ol>
  ),

  ul: (props) => (
    <ul className="list-disc font-light list-inside pl-6 mb-4">
      {props?.children}
    </ul>
  ),

  li: (props) => <li className="mb-2">{props?.children}</li>,

  img: (props) => (
    <div className="my-6">
      <img
        src={props?.url}
        alt={props?.caption || "Image"}
        className="max-w-full h-auto rounded shadow-lg"
      />
      {props?.caption && (
        <p className="text-sm text-gray-600 text-center mt-2">
          {props?.caption}
        </p>
      )}
    </div>
  ),
};
