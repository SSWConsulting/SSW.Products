import { cn } from "@/lib/utils";
import { RemoveTinaMetadata } from "@/types/tina";
import Image from "next/image";
import Link from "next/link";
import { createContext, ReactNode, useContext } from "react";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PagesPageBlocksTryItNow } from "../../../tina/__generated__/types";
import Container from "../../Container";
import { TryItNowServer } from "./TryItNowServer";

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

  // set the aspect ratio of the bottom half of the cards to the aspect ratio of the tallest card
  // (to avoid inconsistent heights on mobile)
  const aspectRatio = props.aspectRatio;
  return (
    <Container className="first:pt-20">
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
                console.log("image", card?.image);
                return (
                  <div
                    key={`card-${index}`}
                    className="bg-gray-neutral flex gap-4 flex-col rounded-2xl pt-8 px-8"
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
                        <TinaMarkdown
                          components={components}
                          content={card.description}
                        />
                      </section>
                    )}
                    {card?.button && (
                      <div
                        className="w-full"
                        style={
                          aspectRatio
                            ? {
                                aspectRatio,
                              }
                            : {}
                        }
                      >
                        <div className="font-bold bg-ssw-red rounded-xl py-4 text-center">
                          <span data-tina-field={tinaField(card.button)}>
                            <TinaMarkdown
                              content={card.button.label}
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
                      </div>
                    )}
                    {card?.image &&
                      card.image.imgSrc &&
                      card.image.imgWidth &&
                      card.image.imgHeight && (
                        <div
                          style={
                            aspectRatio
                              ? {
                                  aspectRatio,
                                }
                              : {}
                          }
                          className="relative w-full"
                        >
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
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="absolute bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4"></div>
      </div>
      {props.bottomLinks && (
        <div className="flex w-fit text-sm font-bold mx-auto  text-white md:grid-cols-3 mt-20">
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
    <div
      className="absolute  inset-0 -z-10 bg-cover bg-no-repeat bg-center"
      style={{
        maskImage: "radial-gradient(#ffffffba, #00000000)",
        filter: "blur(200px)",
        backgroundImage:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(123.04deg, #FF9D3F -23.58%, #F46772 36.14%, #AF33E4 78.77%, #080808 124.29%)",
      }}
    ></div>
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
