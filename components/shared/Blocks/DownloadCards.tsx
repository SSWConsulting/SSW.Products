import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { type PagesPageBlocksDownloadCardsCards as DownloadCard } from "../../../tina/__generated__/types";
import Container from "../../Container";
import PurpleSunBackground from "../Background/PurpleSunBackground";
import { ActionButton } from "./ActionsButton";
import { ButtonSize, ButtonVariant } from "./buttonEnum";

const descriptionComponents = {
  img: (props?: { url: string }) => (
    <span className="size-4 relative align-text-top inline-block">
      <Image
        src={props?.url || ""}
        aria-hidden="true"
        alt=""
        fill={true}
      />
    </span>
  ),
  a: (props: any) => <Link {...props} />,
};


export const DownloadCards = ({ data }: { data: any }) => {
  const { title, cards = [] } = data;
  const cardList = cards?.filter(Boolean) as DownloadCard[];

  const hasCustomSpan = cardList.some((c) => Number(c.colSpan) > 1);
  const gridColsClass =
    cardList.length === 0
      ? ""
      : cardList.length === 1
        ? "md:grid-cols-1"
        : cardList.length === 2 && !hasCustomSpan
          ? "md:grid-cols-2"
          : "md:grid-cols-3";

  return (
    <Container className="first:pt-20 relative container">
      {data.topImage?.imgSrc &&
        data.topImage.imgWidth &&
        data.topImage.imgHeight && (
          <Image
            className="w-72 mx-auto mb-16"
            data-tina-field={tinaField(data, "topImage")}
            src={data.topImage.imgSrc}
            width={data.topImage.imgWidth}
            height={data.topImage.imgHeight}
            alt={data.topImage.imgAlt ?? ""}
          />
        )}
      <div className="w-full z-0 h-fit relative">
        <div className="text-white z-20 border-2 border-gray-lighter/40 relative w-full py-12 bg-gray-dark mx-auto rounded-lg px-8">
          {title && (
            <h2
              data-tina-field={tinaField(data, "title")}
              className="text-2xl font-semibold text-center mb-7"
            >
              {title}
            </h2>
          )}
          <div className={cn("grid relative z-10 grid-cols-1 gap-4", gridColsClass)}>
            {cardList.map((card, index) => (
              <DownloadCardItem
                card={card}
                key={`download-card-${index}`}
                useGridCols3={hasCustomSpan || cardList.length > 2}
              />
            ))}
          </div>
        </div>
        <div className="absolute bg-gray-dark/75 inset-y-4 rounded-lg inset-x-8 z-10 -bottom-4" />
      </div>
      <PurpleSunBackground />
    </Container>
  );
};

const DownloadCardItem = ({
  card,
  useGridCols3,
}: {
  card: DownloadCard;
  useGridCols3: boolean;
}) => {
  const colSpan = Number(card.colSpan);
  let colSpanClass: string | undefined;

  if (useGridCols3 && colSpan > 1) {
    if (colSpan === 2) {
      colSpanClass = "md:col-span-2";
    } else if (colSpan === 3) {
      colSpanClass = "md:col-span-3";
    }
  }
  return (
    <div
      className={cn(
        "bg-ssw-charcoal flex gap-4 flex-col items-center justify-between rounded-lg pt-8 px-8 pb-8",
        colSpanClass
      )}
    >
      {card.title && (
        <h3
          data-tina-field={tinaField(card, "title")}
          className="text-2xl font-semibold text-center w-full"
        >
          {card.title}
        </h3>
      )}
      {card.description && (
        <section
          data-tina-field={tinaField(card, "description")}
          className={cn(
            "text-gray-300 text-sm w-fit mx-auto text-left",
            card.colSpan && Number(card.colSpan) >= 2 && "md:columns-2 md:gap-x-8"
          )}
        >
          <TinaMarkdown components={descriptionComponents} content={card.description} />
        </section>
      )}
      {card.buttons && card.buttons.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3 w-full">
          {card.buttons.map((button, i) => {
            if (!button) return null;
            const action = {
              label: button.label,
              url: button.url ?? "",
              variant: button.variant ?? ButtonVariant.SolidRed,
              size: button.size ?? ButtonSize.Medium,
            };
            return (
              <ActionButton
                key={`btn-${i}`}
                action={action}
                className="flex-1 justify-center"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

