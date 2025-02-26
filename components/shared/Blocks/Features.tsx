import React from "react";
import Actions from "./ActionsButton";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import {
  Components,
  TinaMarkdown,
  TinaMarkdownContent,
} from "tinacms/dist/rich-text";
import { YouTubeEmbed } from "../YouTubeEmbed";
import { ButtonSize, ButtonVariant } from "./buttonEnum";
import Link from "next/link";
import { WordRotate } from "@/components/magicui/word-rotate";

type ActionButton = {
  label: string;
  url: string;
  variant: ButtonVariant;
  size: ButtonSize;
};

export type FeatureItem = {
  headline: string;
  headlineAfter: string;
  words: string[];
  text: TinaMarkdownContent;
  buttons: ActionButton[];
  media: Array<{
    __typename: string;
    image?: string;
    src?: string;
  }>;
  isReversed: boolean;
  hasBackground: boolean;
};

export const featureComponents: Components<Record<string, unknown>> = {
  //@ts-expect-error investigate type err
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p
      className="mb-4 text-white  leading-relaxed text-base"
      //@ts-expect-error investigate type err
      data-tina-field={tinaField(props, "text")}
      {...props}
    />
  ),
  //@ts-expect-error investigate type err
  span: (props: React.HTMLProps<HTMLSpanElement>) => (
    <span
      className="mb-4 text-white  leading-relaxed text-base"
      //@ts-expect-error investigate type err
      data-tina-field={tinaField(props, "text")}
      {...props}
    />
  ),
};

const FeatureBlock = ({ feature }: { feature: FeatureItem }) => {
  const renderMedia = () => {
    if (feature.media && feature.media.length > 0) {
      const mediaItem = feature.media[0];

      if (
        mediaItem.__typename ===
          "PagesPageBlocksFeaturesFeatureItemMediaImage" &&
        mediaItem.image
      ) {
        return (
          <Image
            src={mediaItem.image}
            alt={feature.headline}
            className="w-full h-auto object-cover"
            data-tina-field={tinaField(mediaItem, "image")}
            width={1000}
            height={1000}
          />
        );
      }

      if (
        mediaItem.__typename ===
          "PagesPageBlocksFeaturesFeatureItemMediaExternalVideo" &&
        mediaItem.src
      ) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <YouTubeEmbed src={mediaItem.src} />
          </div>
        );
      }
      if (
        mediaItem.__typename ===
        "PagesPageBlocksFeaturesFeatureItemMediaThumbnailToExternalLink"
      ) {
        return (
          <div className="relative group cursor-pointer">
            <Link href={mediaItem.src || ""} target="_blank">
              <Image
                src={mediaItem.image || ""}
                alt="Home-page thumbnail image"
                width={1000}
                height={1000}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gray-800 opacity-5 group-hover:opacity-50 transition-opacity duration-300 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/svg/play-button.svg"
                  alt="Play Button"
                  width={100}
                  height={100}
                />
              </div>
            </Link>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div
      className={`flex flex-col-reverse lg:flex-row w-full items-center lg:gap-12 gap-8 px-8 ${
        feature.isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      }  pb-10 lg:pb-0 3xl:px-20`}
    >
      <div className="w-full flex flex-col gap-2 xl:pl-20">
        <div className="flex flex-wrap items-center text-3xl lg:text-4xl text-white font-semibold">
          <div className="view-mode-1 block md:hidden lg:block">
            {/* First line: Headline (always on the first line) */}
            <div className="w-full md:w-auto lg:w-full xl:w-auto flex items-center">
              <h1
                className="inline leading-1.5"
                data-tina-field={tinaField(feature, "headline")}
              >
                {feature.headline}
              </h1>
              {/* Words should be on first line for sm, md, xl but on second line for lg */}
              <span className="inline-block pl-2 pr-2  text-[#CC4141] lg:hidden xl:inline-block">
                <WordRotate words={feature.words} className="inline-flex" />
              </span>
            </div>

            {/* Second line: Words (only on lg) & HeadlineAfter (on second line for sm, lg, xl) */}
            <div className="w-full flex items-center lg:w-full">
              <span className="hidden lg:inline-block xl:hidden pl-2 pr-2 lg:pl-0 text-[#CC4141]">
                <WordRotate words={feature.words} className="inline-flex" />
              </span>
              <h1
                className="w-full md:w-auto lg:w-auto xl:w-full md:inline-flex"
                data-tina-field={tinaField(feature, "headlineAfter")}
              >
                {feature.headlineAfter}
              </h1>
            </div>
          </div>
          <div className="view-mode-2 hidden md:block lg:hidden">
            <div className="w-full flex flex-wrap items-center">
              {/* First line: Headline, Words, and HeadlineAfter (all on the same line) */}
              <h1
                className="inline"
                data-tina-field={tinaField(feature, "headline")}
              >
                {feature.headline}
              </h1>
              <span className="inline-block px-2 text-[#CC4141]">
                <WordRotate words={feature.words} className="inline-flex" />
              </span>
              <h1
                className="inline"
                data-tina-field={tinaField(feature, "headlineAfter")}
              >
                {feature.headlineAfter}
              </h1>
            </div>
          </div>
        </div>

        <div className="text-base ">
          <TinaMarkdown content={feature.text} components={featureComponents} />
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-start lg:items-center gap-4 xl:gap-0">
          {feature.buttons?.map((button, index) => (
            <Actions key={index} actions={[button]} />
          ))}
        </div>
      </div>
      <div
        className="lg:w-6/10 xl:w-7/10 w-full flex items-center justify-center h-full"
        data-tina-field={tinaField(feature, "media")}
      >
        {renderMedia()}
      </div>
    </div>
  );
};

type FeatureBlocksProps = {
  data: {
    featureItem: FeatureItem[];
  };
  index: number;
};

const FeatureBlocks = ({ data, index }: FeatureBlocksProps) => {
  const features =
    data && Array.isArray(data.featureItem) ? data.featureItem : [];

  const sizingClasses = "xl:px-32 3xl:px-60 lg:px-28 md:px-10 pt-32 pb-20";

  return (
    <section
      key={"features-" + index}
      className={`flex flex-col items-center lg:space-y-12 ${sizingClasses}`}
    >
      {features.length > 0 &&
        features.map((feature: FeatureItem, featureIndex: number) => (
          <FeatureBlock key={"feature-" + featureIndex} feature={feature} />
        ))}
    </section>
  );
};

export default FeatureBlocks;
