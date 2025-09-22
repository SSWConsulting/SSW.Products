import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";

import { tinaField } from "tinacms/dist/react";
import Actions from "./ActionsButton";
import {
  curlyBracketFormatter,
  SSWRedCurlyBracketFormatter,
} from "./Hero/Hero";

import { ShineBorder } from "@/components/magicui/shine-border";
import { BsCheck } from "react-icons/bs";
import { BookingButton } from "./BookingButton";
import { ButtonVariant } from "./buttonEnum";
import { cn } from "@/lib/utils";

interface PlanAction {
  label: string;
  url: string;
  variant?: string;
  size?: string;
  __typename: string;
}

interface JotFormAction {
  Title: string;
  JotFormId: string;
  className?: string;
  __typename: string;
}

interface AddOn {
  title: string;
  description: string;
  price: string;
  subPriceText: string;
  actionButton: PlanAction | JotFormAction;
}

interface Plan {
  planTier: string;
  planDescription: string;
  price: string;
  subPriceText: string;
  buttons: (PlanAction | JotFormAction)[];
  priceDescription: string;
  isRecommended: boolean;
  timeSaved: string;
  listTitle: string;
  listItems: string[];
  recommendation?: string;
}

type PricingData = {
  title?: string;
  description?: TinaMarkdownContent;

  plans?: Plan[];
  addOns: AddOn;
};

interface PricingProps {
  data: PricingData;
}

const Pricing = ({ data }: PricingProps) => {
  const { title, description, plans, addOns } = data;

  const getGridClasses = (planCount: number) => {
    if (planCount === 1) {
      return "grid grid-cols-1 gap-4 lg:gap-8 xl:grid-cols-3 lg:justify-items-center px-4 lg:px-12";
    } else if (planCount === 2) {
      return "grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 px-4 lg:px-12";
    } else if (planCount === 3) {
      return "grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3 px-4 lg:px-12";
    } else {
      return "grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 xl:grid-cols-4 px-4 lg:px-12";
    }
  };

  return (
    <div className="pricing-component first:pt-20 container mx-auto px-4 mb-14 lg:mb-4 md:mt-0 lg:pb-20">
      {title && (
        <h1
          className="text-4xl text-center font-semibold text-white mb-4"
          data-tina-field={tinaField(data, "title")}
        >
          {curlyBracketFormatter(title)}
        </h1>
      )}

      {description && (
        <div
          className="text-white text-base text-center px-4 mb-8"
          data-tina-field={tinaField(data, "description")}
        >
          <TinaMarkdown content={description} />
        </div>
      )}

      <div className={getGridClasses(plans?.length || 0)}>
        {plans &&
          plans.length > 0 &&
          plans.map((plan, index) => (
            <div
              className={cn(
                "flex flex-col h-full",
                plans.length === 1 ? "first:xl:col-start-2" : ""
              )}
              key={index}
            >
              {plan.isRecommended ? (
                <div className="relative h-full flex flex-col">
                  <ShineBorder
                    borderWidth={2}
                    duration={20}
                    shineColor={["#CC4141", "#CC4141", "#CC4141"]}
                    className="rounded-3xl absolute inset-0 overflow-visible z-10"
                  />

                  <PlanCard
                    plan={plan}
                    index={index}
                    data={data}
                    isRecommended={true}
                  />
                </div>
              ) : (
                <div className="h-full">
                  <PlanCard
                    plan={plan}
                    index={index}
                    data={data}
                    isRecommended={false}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="px-4 lg:px-12">
        {addOns && <AddOns addOns={addOns} />}
      </div>
    </div>
  );
};

const AddOns = ({ addOns }: { addOns: AddOn }) => {
  return (
    <div className="flex max-w-3xl mx-auto p-10 my-4 lg:my-8 flex-col w-full bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border-white/20 border-2 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-20">
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-white mb-2">
            {curlyBracketFormatter(addOns?.title)}
          </h3>
          <span className="text-white/50 mb-2">{addOns?.description}</span>
          <div className="flex flex-row text-baseline items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white mb-2">
              {addOns?.price}
            </h3>
            <span className="text-white/50">{addOns?.subPriceText}</span>
          </div>
        </div>
        <div className="flex flex-col">
          {addOns?.actionButton && (
            <Actions
              //@ts-expect-error investigate after
              actions={[addOns?.actionButton]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface PlanCardProps {
  plan: Plan;
  index: number;
  data: PricingData;
  isRecommended: boolean;
}

const PlanCard = ({ plan, index, data, isRecommended }: PlanCardProps) => {
  // Type guard function to check if the button is a JotFormAction
  const isJotFormAction = (
    button: PlanAction | JotFormAction
  ): button is JotFormAction => {
    return (
      button.__typename === "PagesPageBlocksPricingPlansButtonsBookingButton"
    );
  };

  return (
    <div
      className={`plan-card text-white border ${
        isRecommended
          ? "border-transparent "
          : "border-opacity-10 border-white/10"
      } px-6 py-10 shadow-xl rounded-3xl hover:bg-opacity-30 transition-opacity duration-200 bg-linear-to-r to-[#141414] via-[#131313] from-[#0e0e0e] relative h-full flex flex-col grow`}
      data-tina-field={tinaField(data, "plans", index)}
    >
      <div className="flex gap-2 items-center ">
        {plan.planTier && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-3xl font-bold">{plan.planTier}</h3>
          </div>
        )}

        {isRecommended && (
          <div className="text-white text-center text-xs bg-linear-to-br from-red-400 to-red-700 rounded-full h-auto px-4 py-1 -mt-1">
            {plan.recommendation || "Most Popular"}
          </div>
        )}
      </div>
      {plan.planDescription && (
        <p className="text-base pb-3 text-white/50 h-14">
          {curlyBracketFormatter(plan.planDescription)}
        </p>
      )}

      <div className="flex text-center items-baseline gap-2 pb-3">
        {plan.price && <p className="text-3xl font-bold ">{plan.price}</p>}
        {plan.subPriceText && (
          <p className="text-base text-white/50">{plan.subPriceText}</p>
        )}
      </div>
      <div className="flex-col mt-auto py-6 ">
        {plan.buttons[0] &&
          (() => {
            switch (plan.buttons[0]?.__typename) {
              case "PagesPageBlocksPricingPlansButtonsActions":
                return (
                  <Actions
                    //@ts-expect-error investigate after
                    actions={[plan.buttons[0]]}
                  />
                );
              case "PagesPageBlocksPricingPlansButtonsBookingButton":
                if (isJotFormAction(plan.buttons[0])) {
                  return (
                    <BookingButton
                      title={plan.buttons[0].Title}
                      jotFormId={plan.buttons[0].JotFormId}
                      variant={
                        isRecommended
                          ? ButtonVariant.SolidRed
                          : ButtonVariant.OutlinedWhite
                      }
                      className={plan.buttons[0].className}
                    />
                  );
                }
                return null;
              default:
                return null;
            }
          })()}
      </div>

      <div className="flex-col pb-3 grow">
        <h3 className="text-base text-white pb-1">{plan.listTitle}</h3>
        {plan.listItems?.map((item: string, index: number) => (
          <div key={index} className="flex items-start gap-2 py-1">
            <BsCheck
              className={`mt-[2px] text-xl bg-transparent text-[#CC4141]`}
            />
            <span className="text-white/50">
              {SSWRedCurlyBracketFormatter(item)}
            </span>
          </div>
        ))}
      </div>
      {plan.priceDescription && (
        <div className="text-sm text-white/50 pb-3 ">
          {curlyBracketFormatter(plan.priceDescription)}
        </div>
      )}
    </div>
  );
};

export default Pricing;
