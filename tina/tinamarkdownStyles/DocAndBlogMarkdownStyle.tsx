import { Components } from "tinacms/dist/rich-text";

export const DocAndBlogMarkdownStyle: Components<{
  Youtube: { embedSrc: string };
}> = {
  Youtube: ({ embedSrc }) => (
    <div className="youtube-container">
      <iframe
        width="560"
        height="315"
        src={embedSrc}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
      ></iframe>
    </div>
  ),
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
    <ol className="list-decimal font-lightlist-inside pl-6 mb-4">
      {props?.children}
    </ol>
  ),

  ul: (props) => (
    <ul className="list-disc font-light list-inside pl-6 mb-4">
      {props?.children}
    </ul>
  ),

  li: (props) => <li className="mb-2">{props?.children}</li>,

  lic: (props) => <span>{props?.children}</span>, // For inline list content

  //   strong: (props: { children: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => <strong className="font-bold">{props.children}</strong>,

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
