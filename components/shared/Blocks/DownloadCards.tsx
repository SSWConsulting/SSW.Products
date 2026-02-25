import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  type PagesPageBlocksDownloadCards,
  type PagesPageBlocksDownloadCardsCards as DownloadCard,
  type PagesPageBlocksDownloadCardsCardsButtons as DownloadButton,
} from "../../../tina/__generated__/types";
import Container from "../../Container";
import PurpleSunBackground from "../Background/PurpleSunBackground";

export type DownloadCardsProps = PagesPageBlocksDownloadCards;

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

export const DownloadCards = (props: DownloadCardsProps) => {
  const { title, cards = [] } = props;
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
      {props.topImage?.imgSrc &&
        props.topImage.imgWidth &&
        props.topImage.imgHeight && (
          <Image
            className="w-72 mx-auto mb-16"
            data-tina-field={tinaField(props, "topImage")}
            src={props.topImage.imgSrc}
            width={props.topImage.imgWidth}
            height={props.topImage.imgHeight}
            alt=""
          />
        )}
      <div className="w-full z-0 h-fit relative">
        <div className="text-white z-20 border-2 border-gray-lighter/40 relative w-full py-12 bg-gray-dark mx-auto rounded-lg px-8">
          {title && (
            <h2
              data-tina-field={tinaField(props, "title")}
              className="text-[1.75rem] font-semibold text-center mb-7"
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
      {props.bottomLinks && (
        <div className="flex w-fit text-sm font-bold mx-auto text-white mt-32">
          {props.bottomLinks.map((link, index) => {
            if (!link) return null;
            const BottomComponent = ({
              children,
              className,
              ...rest
            }: {
              children: React.ReactNode;
              className?: string;
            }) => (
              <>
                {link?.url ? (
                  <Link
                    target="_blank"
                    {...rest}
                    className={cn(className, "hover:underline")}
                    href={link.url}
                  >
                    {children}
                  </Link>
                ) : (
                  <span {...rest} className={className}>
                    {children}
                  </span>
                )}
              </>
            );
            return (
              <BottomComponent
                key={`bottom-link-${index}`}
                data-tina-field={tinaField(link)}
                className="my-3.5 mx-[21px]"
              >
                <TinaMarkdown
                  content={link.label}
                  components={{
                    img: (props?: { url: string }) => (
                      <span className="size-5 mx-1.5 relative align-middle inline-block">
                        <Image
                          src={props?.url || ""}
                          aria-hidden="true"
                          alt=""
                          fill={true}
                        />
                      </span>
                    ),
                  }}
                />
              </BottomComponent>
            );
          })}
        </div>
      )}
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
            return (
              <DownloadButton
                key={`btn-${i}`}
                button={button}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DownloadButton = ({ button }: { button: DownloadButton }) => {
  // variant is defined in the template but pending tina regeneration
  const variant = (button as DownloadButton & { variant?: string | null }).variant;
  const isSecondary = variant === "secondary";
  const content = (
    <div
      className={cn(
        "font-bold rounded-xl py-4 text-center flex items-center justify-center gap-2 w-full h-full",
        isSecondary
          ? "bg-transparent border-2 border-white text-white"
          : "bg-ssw-red"
      )}
    >
      {button.icon && (
        <span className="size-5 relative inline-block shrink-0">
          <Image
            src={button.icon}
            aria-hidden="true"
            alt=""
            fill={true}
            className="object-contain"
          />
        </span>
      )}
      {button.label && (
        <span data-tina-field={tinaField(button, "label")}>{button.label}</span>
      )}
    </div>
  );

  if (button.link) {
    return (
      <Link className="flex-1" href={button.link} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }
  return <div className="flex-1">{content}</div>;
};
