import { Components, TinaMarkdown } from "tinacms/dist/rich-text";
import { curlyBracketFormatter } from "../Hero";

const cardAndImageMarkdownRenderer: Components<Record<string, unknown>> = {
  ul: (props: unknown) => {
    const { children } = props as { children?: React.ReactNode };
    return <ul className="pl-6 md:pl-12 list-disc">{children}</ul>;
  },
};

export default function CardAndImageParent(data: any) {
  return (
    <div className="max-w-7xl mx-auto px-12 pb-12">
      <h2 className="text-4xl text-white font-bold py-12">
        {data.data.ParentContainerTitle}
      </h2>
      <div className="flex flex-col gap-6">
        {data.data.CardAndImageItem.map((item: any) => {
          return <CardAndImage key={item.id} data={item} />;
        })}
      </div>
    </div>
  );
}

function CardAndImage(data: any) {
  console.log("data inside item", data);
  return (
    <div
      className={`flex ${
        data.data.textOnLeft ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
      } w-full text-white gap-10`}
    >
      <div
        className="bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] rounded-xl shadow-2xl  border border-white/20 p-6 w-full md:w-1/2"
        rounded-xl
      >
        <h4 className="text-gray-300">
          {curlyBracketFormatter(data.data.AboveHeaderText)}
        </h4>
        <h3 className="text-2xl font-bold pb-3">
          {curlyBracketFormatter(data.data.Header)}
        </h3>
        <div className="text-gray-300">
          <TinaMarkdown
            content={data.data.Description}
            components={cardAndImageMarkdownRenderer}
          />
        </div>
        <div className="flex flex-wrap gap-2 py-3">
            {data.data.Badge1Text && <Badge title={data.data.Badge1Text} />}
            {data.data.Badge2Text && <Badge title={data.data.Badge2Text} />}
            {data.data.Badge3Text && <Badge title={data.data.Badge3Text} />}
        </div>
      </div>
      <div className="bg-slate-500 w-full md:w-1/2 flex items-center justify-center">
        Image PlaceHolder
      </div>
    </div>
  );
}

function Badge({title}: {title: string})
{
    return <div className="relative bg-gradient-to-br from-red-400 to-red-700 text-xs py-1 px-2 rounded-md top-0 hover:-top-1 transition-all duration-300 whitespace-nowrap">
        {title}
    </div>
}