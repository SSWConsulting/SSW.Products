import { Components, TinaMarkdown } from 'tinacms/dist/rich-text';
import { curlyBracketFormatter } from '../Hero';
import { FaChevronDown } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const cardAndImageMarkdownRenderer: Components<Record<string, unknown>> = {
  ul: (props: unknown) => {
    const { children } = props as { children?: React.ReactNode };
    return <ul className="pl-6 md:pl-12 list-disc">{children}</ul>;
  },
};

export default function CardAndImageParent(data: any) {
  const [idOfOpen, setIdOfOpen] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-12 pb-12">
      <h2 className="text-4xl text-white font-bold py-12">
        {data.data.ParentContainerTitle}
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-6 w-full md:w-1/2">
          {data.data.CardAndImageItem.map((item: any, index: number) => (
            <CardItem
              key={item.id || index}
              data={item}
              uniqueId={item.id || index.toString()}
              idOfOpen={idOfOpen}
              setIdOfOpen={setIdOfOpen}
            />
          ))}
        </div>
        <div className="bg-slate-500 w-full md:w-1/2 flex items-center justify-center">
          Image PlaceHolder
        </div>
      </div>
    </div>
  );
}

function CardItem({
  data,
  uniqueId,
  idOfOpen,
  setIdOfOpen,
}: {
  data: any;
  uniqueId: string;
  idOfOpen: string | null;
  setIdOfOpen: (id: string | null) => void;
}) {
  const isOpen = idOfOpen === uniqueId;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, data]);

  return (
    <div className="w-full text-white">
      <div className={`group bg-gradient-to-r cursor-pointer to-[#141414] via-[#131313] from-[#0e0e0e] hover:from-[#141414] hover:via-[#1f1f1f] hover:to-[#2b2a2a] rounded-xl shadow-2xl border ${isOpen ? 'border-red-500' : 'border-white/20'} animate-in fade-in duration-300 transition-all p-6 w-full`} onClick={() => {
              setIdOfOpen(isOpen ? null : uniqueId);
            }}>
        <h4 className="text-gray-300">
          {curlyBracketFormatter(data.AboveHeaderText)}
        </h4>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            {curlyBracketFormatter(data.Header)}
          </h3>
          <FaChevronDown
            className={`text-white cursor-pointer relative -top-3 group-hover:text-red-500 transition-all duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            onClick={() => {
              setIdOfOpen(isOpen ? null : uniqueId);
            }}
          />
        </div>
        <div 
          className="overflow-hidden transition-all duration-500 ease-in-out" 
          style={{ maxHeight: `${contentHeight}px` }}
        >
          <div ref={contentRef}>
            <div className="text-gray-300 pt-3">
              <TinaMarkdown
                content={data.Description}
                components={cardAndImageMarkdownRenderer}
              />
            </div>
            <div className="flex flex-wrap gap-2 py-3">
              {data.Badge1Text && <Badge title={data.Badge1Text} />}
              {data.Badge2Text && <Badge title={data.Badge2Text} />}
              {data.Badge3Text && <Badge title={data.Badge3Text} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ title }: { title: string }) {
  return (
    <div className="relative bg-[#333333] flex items-center justify-center text-xs py-1 px-2 rounded-md  whitespace-nowrap">
      {title}
    </div>
  );
}
