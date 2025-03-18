import React from "react";
import Image from "next/image";
import Actions from "./ActionsButton";
import { tinaField } from "tinacms/dist/react";
import { ButtonSize, ButtonVariant } from "./buttonEnum";

interface BannerProps {
  data: {
    backgroundColour: string;
    textColour: string;
    headline: string;
    text: string;
    buttons: Array<{
      label: string;
      url: string;
      variant: ButtonVariant;
      size: ButtonSize;
    }>;
    image: string;
  };
}

const Banner = ({ data }: { data: BannerProps["data"] }) => {

  const gradientBackground = `linear-gradient(135deg, ${data.backgroundColour}33, ${data.backgroundColour})`;

  return (
    <div
      className="w-full pt-8"
      style={{
        background: gradientBackground,
      }}
    >
      <div
        className="container mx-auto px-8 flex flex-col md:flex-col lg:flex-row items-center text-left"
        style={{ color: data.textColour }}
      >
        {/* Left Column: Text and Buttons */}
        <div className="lg:w-2/5 w-full flex flex-col gap-2 pl-0 lg:pl-20">
          <h2
            className="text-4xl font-semibold mb-4"
            data-tina-field={tinaField(data, "headline")}
          >
            {data.headline}
          </h2>
          <p className="text-base mb-6" data-tina-field={tinaField(data, "text")}>
            {data.text}
          </p>

          {/* Buttons */}
          <div className="flex flex-col justify-start gap-4 mb-8">
            {data.buttons?.map((button, index) => (
              <Actions key={index} actions={[button]} />
            ))}
          </div>
        </div>

        {/* Right Column: Image */}
        {data.image && (
          <div
            className="lg:w-3/5 w-full flex items-center justify-center h-full"
            data-tina-field={tinaField(data, "image")}
          >
            <Image
              src={data.image}
              alt={data.headline}
              className="w-full h-auto object-cover"
              width={1000}
              height={1000}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
