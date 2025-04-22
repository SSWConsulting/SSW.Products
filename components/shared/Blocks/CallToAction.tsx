import { cn } from "@/lib/utils";
import { RemoveTinaMetadata } from "@/types/tina";
import { tinaField } from "tinacms/dist/react";
import { PagesPageBlocksCallToAction } from "../../../tina/__generated__/types";
import { ActionButton } from "./ActionsButton";
import { ButtonSize, ButtonVariant } from "./buttonEnum";

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

            {props.ctaButton && (
              <ActionButton
                action={{
                  label: props.ctaButton.label,
                  size: props.ctaButton.size as ButtonSize,
                  variant: props.ctaButton.variant as ButtonVariant,
                  url: props.ctaButton.buttonLink || "",
                }}
              />
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
