import { cn } from "@/lib/utils";
import Image from "next/image";
import NextLink from "next/link";
import { ReactNode } from "react";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Container from "../../Container";
import PurpleSunBackground from "../Background/PurpleSunBackground";
import Link from "@tina/tinamarkdownStyles/Link";

export interface DownloadButton {
  icon?: string | null;
  label?: string | null;
  link?: string | null;
}

export interface DownloadCard {
  title?: string | null;
  description?: any;
  colSpan?: number | null;
  buttons?: (DownloadButton | null)[] | null;
}

export interface DownloadCardsProps {
  title?: string | null;
  topImage?: {
    imgSrc?: string | null;
    imgWidth?: number | null;
    imgHeight?: number | null;
  } | null;
  cards?: (DownloadCard | null)[] | null;
  bottomLinks?: ({ label?: any; url?: string | null } | null)[] | null;
  [key: string]: any;
}

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
  a: (props: any) => Link(props),
};

export const DownloadCards = (props: DownloadCardsProps) => {
  const { title, cards = [] } = props;
  const cardList = (cards ?? []).filter(Boolean) as DownloadCard[];

  const hasCustomSpan = cardList.some((c) => c.colSpan && c.colSpan > 1);
  const gridColsClass =
    cardList.length === 0
      ? ""
      : cardList.length === 1
        ? "md:grid-cols-1"
        : cardList.length === 2 && !hasCustomSpan
          ? "md:grid-cols-2"
          : "md:grid-cols-3";

  return (
    <Container className="first:pt-20 relative">
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
        <div className="text-white z-20 border-2 border-gray-lighter/40 relative w-full py-12 bg-gray-dark mx-auto rounded-3xl px-8">
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
        <div className="absolute bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4" />
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
                  <NextLink
                    target="_blank"
                    {...rest}
                    className={cn(className, "hover:underline")}
                    href={link.url}
                  >
                    {children}
                  </NextLink>
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
                className="my-[14px] mx-[21px]"
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
  const colSpanClass =
    useGridCols3 && card.colSpan && card.colSpan > 1
      ? `md:col-span-${card.colSpan}`
      : undefined;

  return (
    <div
      className={cn(
        "bg-ssw-charcoal flex gap-4 flex-col items-center justify-between rounded-2xl pt-8 px-8 pb-8",
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
          className="text-gray-300 text-sm w-fit mx-auto text-left"
        >
          <TinaMarkdown components={descriptionComponents} content={card.description} />
        </section>
      )}
      {card.buttons && card.buttons.length > 0 && (
        <div className="flex flex-row gap-3 w-full">
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
  const content = (
    <div className="font-bold bg-ssw-red rounded-xl py-4 text-center flex items-center justify-center gap-2 w-full h-full">
      {button.icon && (
        <span className="size-5 relative inline-block flex-shrink-0">
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
      <NextLink className="flex-1" href={button.link} target="_blank" rel="noopener noreferrer">
        {content}
      </NextLink>
    );
  }
  return <div className="flex-1">{content}</div>;
};
