import { cn } from "@/lib/utils";
import { RemoveTinaMetadata } from "@/types/tina";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Components, TinaMarkdown } from "tinacms/dist/rich-text";
import {
  type PagesPageBlocksCardAndImageCardAndImageItem as Card,
  PagesPageBlocksCardAndImage as CardAndImageProps,
} from "../../../../tina/__generated__/types";
import Container from "../../../Container";
import { curlyBracketFormatter } from "../Hero/Hero";
const cardAndImageMarkdownRenderer: Components<Record<string, unknown>> = {
  ul: (props: unknown) => {
    const { children } = props as { children?: React.ReactNode };
    return <ul className="pl-6 md:pl-12 list-disc">{children}</ul>;
  },
};

const NO_OPENED_ITEMS = -1;

export default function CardAndImageParent({
  ParentContainerDescription,
  ParentContainerTitle,
  CardAndImageItem,
}: RemoveTinaMetadata<CardAndImageProps>) {
  const [idOfOpen, setIdOfOpen] = useState(0);

  const [lastOpenedId, setLastOpenedId] = useState(0);

  const handleIdChange = (newId: number) => {
    setIdOfOpen(newId);
    if (newId !== NO_OPENED_ITEMS) {
      setLastOpenedId(newId);
    }
  };

  const mediaIndex = idOfOpen === NO_OPENED_ITEMS ? lastOpenedId : idOfOpen;

  const imgSrc = CardAndImageItem ? CardAndImageItem[mediaIndex]?.media : null;

  const altText = CardAndImageItem
    ? CardAndImageItem[mediaIndex]?.Header
    : null;

  return (
    <>
      <div className="flex flex-col">
        <Container size="small">
          {ParentContainerTitle && (
            <h2 className="text-3xl text-white flex justify-center font-bold pb-3">
              {curlyBracketFormatter(ParentContainerTitle)}
            </h2>
          )}
          <div className="flex justify-center mx-auto pb-9">
            {ParentContainerDescription && (
              <span className="text-white/75 text-center">
                {curlyBracketFormatter(ParentContainerDescription)}
              </span>
            )}
          </div>
        </Container>
        <Container className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4 justify-center flex-col w-full">
            {CardAndImageItem?.map((item, index) => (
              <>
                {item && (
                  <CardItem
                    key={index}
                    data={item}
                    uniqueId={index}
                    idOfOpen={idOfOpen}
                    setIdOfOpen={handleIdChange}
                  />
                )}
              </>
            ))}
          </div>
          {CardAndImageItem?.length && (
            <div className="w-full flex items-center justify-center">
              {imgSrc && altText && (
                <Image
                  src={imgSrc}
                  alt={altText}
                  width={500}
                  height={500}
                  className="object-cover w-full"
                />
              )}
            </div>
          )}
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
  data: Card;
  uniqueId: number;
  idOfOpen: number;
  setIdOfOpen: (id: number) => void;
}) {
  const isOpen = idOfOpen === uniqueId;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, data]);

  const delimeter =
    (data?.delimiters?.enabled && data?.delimiters?.delimeter) || "";
  return (
    <div
      className={`group relative w-full rounded-xl p-[1px] ${
        isOpen
          ? "bg-gradient-to-r from-[#e34f4f] to-[#FF778E]"
          : "bg-transparent"
      } transition-all duration-300 cursor-pointer`}
      onClick={() => {
        if (!isOpen) {
          setIdOfOpen(uniqueId);
          return;
        }
        setIdOfOpen(NO_OPENED_ITEMS);
      }}
    >
      <div className="w-full h-full rounded-xl bg-gradient-to-r from-[#0e0e0e] via-[#131313] to-[#141414] hover:from-[#141414] hover:via-[#1f1f1f] hover:to-[#2b2a2a] p-6 shadow-2xl text-white transition-all duration-300">
        {data.AboveHeaderText && (
          <h4 className="text-gray-300">
            {curlyBracketFormatter(data.AboveHeaderText)}
          </h4>
        )}

        <div className="flex items-center justify-between">
          {data.Header && (
            <h3 className="text-2xl font-bold">
              {curlyBracketFormatter(data.Header)}
            </h3>
          )}

          <FaChevronDown
            className={`text-white cursor-pointer relative -top-3 group-hover:text-red-500 transition-all duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: `${contentHeight}px` }}
        >
          <div ref={contentRef}>
            <div className="text-gray-300 text-lg pt-3">
              <TinaMarkdown
                content={data.Description}
                components={cardAndImageMarkdownRenderer}
              />
            </div>
            <div className="grid-cols-3 grid sm:flex items-center flex-wrap text-xs gap-2 py-3">
              {data.Badges?.map((badge, index) => {
                return (
                  <>
                    {badge?.Badge && (
                      <>
                        {index !== 0 && delimeter}
                        <Badge index={index} title={badge?.Badge} />
                      </>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ title, index }: { title: string; index: number }) {
  return (
    <div
      key={`badge ${index}`}
      className={cn(
        index % 2 === 0 ? "col-span-1" : "col-span-2",
        "relative bg-[#333333] w-fit flex items-center justify-center text-xs pb-1 pt-[6px] px-2 rounded-md  whitespace-nowrap"
      )}
    >
      {title}
    </div>
  );
}
