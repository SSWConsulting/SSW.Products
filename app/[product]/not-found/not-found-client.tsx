"use client";
import client from "@tina/__generated__/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
type NotFound = Awaited<ReturnType<typeof client.queries.notFound>>;

type NotFoundData = Record<string, NotFound>;

const NotFoundClient = ({
  notFoundDictionary,
}: {
  notFoundDictionary: NotFoundData;
}) => {
  const params = useParams<{ product: string }>();
  const tinaData = notFoundDictionary[params.product];
  const { data } = useTina({
    query: tinaData.query,
    variables: tinaData.variables,
    data: tinaData.data,
  });
  const { imgHeight, imgSrc, imgWidth, body, heading } = data.notFound;

  return (
    <div className="flex items-center">
      <div className="md:grid px-4 py-12 lg:px-0 grid-cols-1 flex flex-col gap-[39px] md:gap-[78px] h-fit md:grid-cols-2 w-248 mx-auto">
        <div className="flex-col flex justify-center pt text-white">
          <h1
            data-tina-field={tinaField(data.notFound, "heading")}
            className="text-6xl  w-fit text-transparent from-50% mb-2 font-bold via-100% to-180% bg-linear-100 from-ssw-red via-[#D699FB] to-[#FF778E] bg-clip-text"
          >
            {heading}
          </h1>
          <section
            className="[&_a]:underline text-xl [&_a]:underline-offset-2"
            data-tina-field={tinaField(data.notFound, "body")}
          >
            <TinaMarkdown content={body} />
          </section>
        </div>
        {imgSrc && imgHeight && imgWidth && (
          <Image
            data-tina-field={tinaField(data.notFound, "imgSrc")}
            aria-hidden={true}
            className="rounded-2xl"
            quality={90}
            width={imgWidth}
            height={imgHeight}
            alt=""
            src={imgSrc}
          />
        )}
      </div>
    </div>
  );
};

export default NotFoundClient;
