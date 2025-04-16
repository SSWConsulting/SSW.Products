import { RemoveTinaMetadata } from "@/types/tina";
import Image from "next/image";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PagesPageBlocksTryItNow } from "../../../tina/__generated__/types";
import Container from "../../Container";

type TryItNowProps = RemoveTinaMetadata<PagesPageBlocksTryItNow>;

const TryItNow = (props: TryItNowProps) => {
  const { tryItNowTitle, tryItNowCards } = props;

  return (
    <Container>
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
                          components={{
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
                          }}
                          content={card.description}
                        />
                      </section>
                    )}

                    {card?.image &&
                      card.image.imgSrc &&
                      card.image.imgWidth &&
                      card.image.imgHeight && (
                        <div
                          style={{
                            aspectRatio: `${card.image.imgWidth}/${card.image.imgHeight}`,
                          }}
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

            {/* Step 2 */}
            {/* <div className="bg-gray-neutral rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-3">2. Enable devices</h3>
            <p className="text-gray-light text-sm mb-4">
              Click the button below to set up your recording devices.
            </p>
            <div className="flex justify-center mt-12">
              <ActionButton
                className="w-fit text-sm"
                action={{
                  label: "🎙️Enable Mic & Webcam",
                  size: ButtonSize.Large,
                  variant: ButtonVariant.SolidRed,
                  url: "http://localhost:3000/admin/index.html#/~/try-it-now",
                }}
              />
            </div>
          </div> */}

            {/* Step 3 */}
            {/* <div className="bg-gray-neutral rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-3">3. Pin extension</h3>
            <p className="text-gray-light text-sm mb-4">
              Click the ⋮ at the top right of your browser, then the next to
              Screencastify.
            </p>
            <div className="rounded-2xl p-2">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Extension interface screenshot"
                width={300}
                height={200}
                className="w-full rounded"
              />
            </div>
          </div> */}
          </div>
        </div>
        <div className="absolute bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4"></div>
      </div>
    </Container>
  );
};

export default TryItNow;
