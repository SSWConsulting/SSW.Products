import { cn } from "@/lib/utils";
import { RemoveTinaMetadata } from "@/types/tina";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  type PagesPageBlocksTryItNowTryItNowCards as Card,
  type PagesPageBlocksTryItNowTryItNowCardsButton as CardButtonProps,
  PagesPageBlocksTryItNow,
} from "../../../tina/__generated__/types";
import Container from "../../Container";
import { getTallestAspectRatio, TryItNowServer } from "./TryItNowServer";

export type TryItNowProps = RemoveTinaMetadata<PagesPageBlocksTryItNow>;

const components = {
  img: (props?: { url: string }) => (
    <span className="size-4 relative align-text-top inline-block">
      <Image
        className=""
        src={props?.url || ""}
        aria-hidden="true"
        alt=""
        fill={true}
      />
    </span>
  ),
};

export const TryItNow = (props: TryItNowProps) => {
  return (
    <TryItNowProvider {...props}>
      <TryItNowServer />
    </TryItNowProvider>
  );
};

const TryItNowClient = (props: TryItNowProps & { aspectRatio?: string }) => {
  const { tryItNowTitle, tryItNowCards } = props;

  const [aspectRatio, setAspectRatio] = useState(props.aspectRatio);

  useEffect(() => {
    const newTallestAspectRatio = getTallestAspectRatio(props.tryItNowCards);
    setAspectRatio(newTallestAspectRatio);
  }, [props.tryItNowCards]);

  const hasCardImage = Boolean(aspectRatio);
  // set the aspect ratio of the bottom half of the cards to the aspect ratio of the tallest card
  // (to avoid inconsistent heights on mobile)
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
            alt={""}
          />
        )}
      <div className="w-full z-0 h-fit relative">
        <div className=" text-white z-20 border-2 border-gray-lighter/40 relative w-full py-12 bg-gray-dark mx-auto rounded-3xl px-8">
          {tryItNowTitle && (
            <h2
              data-tina-field={tinaField(props, "tryItNowTitle")}
              className="text-[1.75rem] font-semibold text-center mb-7"
            >
              {tryItNowTitle}
            </h2>
          )}
          {/* main box */}
          <div className="grid relative z-10 grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}

            {tryItNowCards &&
              tryItNowCards.map((card, index) => {
                if (!card) return <></>;
                return (
                  <Card
                    card={card}
                    hasCardImage={hasCardImage}
                    aspectRatio={aspectRatio}
                    key={`card-${index}`}
                  />
                );
              })}
          </div>
        </div>
        <div className="absolute bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4"></div>
      </div>
      {props.bottomLinks && (
        <div className="flex w-fit text-sm font-bold mx-auto  text-white md:grid-cols-3 mt-32">
          {props.bottomLinks.map((link, index) => {
            if (!link) return <></>;
            const BottomComponent = ({
              children,
              className,
              ...props
            }: {
              children: React.ReactNode;
              className?: string;
            }) => {
              return (
                <>
                  {link?.url ? (
                    <Link
                      target="_blank"
                      {...props}
                      className={cn(className, "hover:underline")}
                      href={link.url}
                    >
                      {children}
                    </Link>
                  ) : (
                    <span {...props} className={className}>
                      {children}
                    </span>
                  )}
                </>
              );
            };

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
                          className=""
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
      <PrettyBg />
    </Container>
  );
};

export default TryItNowClient;

const PrettyBg = () => {
  return (
    <div className="absolute -top-52 sm:-top-32 -bottom-80 -inset-x-96 -z-10  opacity-75 overflow-hidden">
      <svg
        preserveAspectRatio="none"
        className="w-full h-full relative"
        width="1575"
        height="1233"
        viewBox="0 0 1575 1233"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.64">
          <g filter="url(#filter0_f_1933_2463)">
            <path
              d="M1215 607.107C1215 785.709 1069.17 920.773 787.312 920.773C543.286 927.865 367.991 767.117 360 630.683C360 452.081 467.374 281.092 787.312 274C1207.87 274 1215 483.918 1215 607.107Z"
              fill="url(#paint0_linear_1933_2463)"
            />
            <path
              d="M1215 607.107C1215 785.709 1069.17 920.773 787.312 920.773C543.286 927.865 367.991 767.117 360 630.683C360 452.081 467.374 281.092 787.312 274C1207.87 274 1215 483.918 1215 607.107Z"
              fill="black"
              fill-opacity="0.1"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_1933_2463"
            x="0"
            y="-86"
            width="1575"
            height="1367"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="180"
              result="effect1_foregroundBlur_1933_2463"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1933_2463"
            x1="25.8334"
            y1="275.681"
            x2="1225.91"
            y2="1307.11"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF9D3F" />
            <stop offset="0.403862" stop-color="#F46772" />
            <stop offset="0.692179" stop-color="#AF33E4" />
            <stop offset="1" stop-color="#080808" />
          </linearGradient>
        </defs>
      </svg>

      {/* <div
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          mask: "radial-gradient(circle at center, transparent 60%, black 80%)",
          WebkitMask:
            "radial-gradient(circle at center, transparent 60%, black 80%)",
        }}
      ></div> */}
    </div>
  );
};

type CardProps = {
  card: Card;
  hasCardImage: boolean;
  key: string;
  aspectRatio?: string;
};

const Card = ({ card, hasCardImage, key, aspectRatio }: CardProps) => {
  return (
    <div
      key={key}
      className={cn(
        "bg-gray-neutral flex gap-4 flex-col rounded-2xl pt-8 px-8",
        !hasCardImage && "pb-8"
      )}
    >
      {card?.title && (
        <h3
          data-tina-field={tinaField(card, "title")}
          className="text-2xl font-semibold"
        >
          {card.title}
        </h3>
      )}

      {card?.description && (
        <section
          data-tina-field={tinaField(card, "description")}
          className="text-gray-light text-sm"
        >
          <TinaMarkdown components={components} content={card.description} />
        </section>
      )}

      {card?.button?.label && card?.image?.imgSrc && (
        <CardButton {...card.button} />
      )}

      {(card?.button?.label || card.image?.imgSrc) && (
        <div
          className="w-full relative"
          style={
            aspectRatio
              ? {
                  aspectRatio,
                }
              : {}
          }
        >
          {card?.button && !card.image && <CardButton {...card.button} />}
          {card?.image &&
            card.image.imgSrc &&
            card.image.imgWidth &&
            card.image.imgHeight && (
              <Image
                data-tina-field={tinaField(card, "image")}
                className="bottom-0 absolute"
                src={card.image.imgSrc}
                aria-hidden="true"
                objectFit="contain"
                width={card.image.imgWidth}
                height={card.image.imgHeight}
                alt={""}
              />
            )}
        </div>
      )}
    </div>
  );
};

const CardButton = (button: CardButtonProps) => {
  return (
    <div className="font-bold bg-ssw-red rounded-xl py-4 text-center">
      <span data-tina-field={tinaField(button)}>
        <TinaMarkdown
          content={button.label}
          components={{
            img: (props?: { url: string }) => (
              <span className="size-5 mx-1 relative align-text-top inline-block">
                <Image
                  className=""
                  src={props?.url || ""}
                  aria-hidden="true"
                  alt=""
                  fill={true}
                />
              </span>
            ),
          }}
        />
      </span>
    </div>
  );
};

export const TryItNowContext = createContext<TryItNowProps | null>(null);

export const useTryItNow = () => useContext(TryItNowContext);

export const TryItNowProvider = ({
  children,
  ...props
}: TryItNowProps & { children: ReactNode }) => {
  return (
    <TryItNowContext.Provider value={props}>
      {children}
    </TryItNowContext.Provider>
  );
};
