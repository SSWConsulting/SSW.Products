import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Components, TinaMarkdown } from "tinacms/dist/rich-text";
import Container from "../../../Container";
import { curlyBracketFormatter } from "../Hero/Hero";
const cardAndImageMarkdownRenderer: Components<Record<string, unknown>> = {
  ul: (props: unknown) => {
    const { children } = props as { children?: React.ReactNode };
    return <ul className="pl-6 md:pl-12 list-disc">{children}</ul>;
  },
};

export default function CardAndImageParent(data: any) {
  const [idOfOpen, setIdOfOpen] = useState<string | null>("0");
  const [lastOpenedId, setLastOpenedId] = useState<string>("0");

  const handleIdChange = (newId: string | null) => {
    setIdOfOpen(newId);
    if (newId !== null) {
      setLastOpenedId(newId);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <Container size="small">
          <h2 className="text-5xl text-white flex justify-center font-bold pb-3">
            {curlyBracketFormatter(data.data.ParentContainerTitle)}
          </h2>
          <div className="flex justify-center mx-auto pb-9">
            <span className="text-white/75 text-center">
              {curlyBracketFormatter(data.data.ParentContainerDescription)}
            </span>
          </div>
        </Container>
        <Container className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4 justify-center flex-col w-full">
            {data.data.CardAndImageItem.map((item: any, index: number) => (
              <CardItem
                key={item.id || index}
                data={item}
                uniqueId={item.id || index.toString()}
                idOfOpen={idOfOpen}
                setIdOfOpen={handleIdChange}
              />
            ))}
          </div>
          <div className="w-full flex items-center justify-center">
            <Image
              src={
                data.data.CardAndImageItem[lastOpenedId].media ||
                data.data.CardAndImageItem[0].media
              }
              alt={
                data.data.CardAndImageItem[lastOpenedId].header ||
                data.data.CardAndImageItem[0].header
              }
              width={500}
              height={500}
              className="object-cover w-full"
            />
          </div>
        </Container>
      </div>
    </>
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
    <div
      className={`group w-full text-white bg-clip-padding bg-gradient-to-r outline-2 outline-offset-2 outline-solid  outline-ins cursor-pointer to-[#141414] via-[#131313] from-[#0e0e0e] hover:from-[#141414] hover:via-[#1f1f1f] hover:to-[#2b2a2a] rounded-xl shadow-2xl border-1 ${
        isOpen ? "border-red-500 flex-grow" : "border-transparent"
      } animate-in fade-in duration-300 transition-all p-6 w-full`}
      onClick={() => {
        setIdOfOpen(isOpen ? null : uniqueId);
      }}
    >
      <h4 className="text-gray-300">
        {curlyBracketFormatter(data.AboveHeaderText)}
      </h4>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          {curlyBracketFormatter(data.Header)}
        </h3>
        <FaChevronDown
          className={`text-white cursor-pointer relative -top-3 group-hover:text-red-500 transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
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
  );
}

function Badge({ title }: { title: string }) {
  return (
    <div className="relative bg-[#333333] flex items-center justify-center text-xs pb-1 pt-[6px] px-2 rounded-md  whitespace-nowrap">
      ✅ {title}
    </div>
  );
}
