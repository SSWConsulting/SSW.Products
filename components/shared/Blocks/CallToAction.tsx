import { cn } from "@/lib/utils";
import { RemoveTinaMetadata } from "@/types/tina";
import { tinaField } from "tinacms/dist/react";
import { PagesPageBlocksCallToAction } from "../../../tina/__generated__/types";
import Link from "next/link";

type CallToActionProps = RemoveTinaMetadata<PagesPageBlocksCallToAction> & {
  className?: string;
};

const CallToAction = ({ className, ...props }: CallToActionProps) => {
  return (
    <section className={cn("mx-auto text-white", className)}>
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
              <Link
                data-tina-field={tinaField(props, "button")}
                className="bg-[#CC4141] text-white py-4 px-6 rounded-lg hover:bg-[#CC4141]/80 transition-all ease-in-out duration-300"
                href={props.button.buttonLink || ""}
                target="_blank"
              >
                {props?.button?.buttonText}
              </Link>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
