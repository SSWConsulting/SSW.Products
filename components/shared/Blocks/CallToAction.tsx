import { ShinyButton } from "@/components/magicui/shiny-button";
import { RemoveTinaMetadata } from "@/types/tina";
import { tinaField } from "tinacms/dist/react";
import { PagesPageBlocksCallToAction } from "../../../tina/__generated__/types";

type CallToActionProps = RemoveTinaMetadata<PagesPageBlocksCallToAction>;

const CallToAction = (props: RemoveTinaMetadata<CallToActionProps>) => {
  return (
    <section className="container mx-auto text-white">
      <div className="rounded-2xl bg-[#131313] relative">
        <div className="max-w-3xl mx-auto text-center ">
          <section className="p-10 sm:p-12 z-10 relative">
            {props.title && (
              <h2
                data-tina-field={tinaField(props, "title")}
                className="sm:text-3xl text-xl font-bold mb-4"
              >
                {props.title}
              </h2>
            )}
            {props.ctaDescription && (
              <p
                data-tina-field={tinaField(props, "ctaDescription")}
                className="text-gray-300 text-sm sm:text-base mb-8"
              >
                {props.ctaDescription}
              </p>
            )}

            {props.button && (
              <ShinyButton
                data-tina-field={tinaField(props, "button")}
                className="bg-gradient-to-br from-red-500 to-red-800 text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0"
                href={props.button.buttonLink || ""}
              >
                {props?.button?.buttonText}
              </ShinyButton>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
