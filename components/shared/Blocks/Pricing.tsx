import React from "react";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import { TiTick } from "react-icons/ti";
import Actions from "./ActionsButton";
import { tinaField } from "tinacms/dist/react";
import { curlyBracketFormatter } from "./Hero";
import { CiClock1 } from "react-icons/ci";
import { ShineBorder } from "@/components/magicui/shine-border";

interface PlanAction {
  label: string;
  url: string;
  variant?: string;
  size?: string;
}

interface AddOn {
  title: string;
  description: string;
  price: string;
  subPriceText: string;
  actionButton: PlanAction;
}

interface Plan {
  planTier: string;
  planDescription: string;
  price: string;
  subPriceText: string;
  actions: PlanAction;
  priceDescription: string;
  isRecommended: boolean;
  timeSaved: string;
  listTitle: string;
  listItems: string[];
}

interface PricingData {
  title?: string;
  description?: TinaMarkdownContent;

  plans?: Plan[];
  addOns: AddOn;
}

interface PricingProps {
  data: PricingData;
}

const Pricing = ({ data }: PricingProps) => {
  const { title, description, plans, addOns } = data;

  console.log("Addons", addOns);

  return (
    <div className="pricing-component container mx-auto p-4 mb-14 lg:mb-4 mt-20 lg:mt-32 md:mt-0 lg:pb-40">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4 px-12 lg:px-12">
        {plans &&
          plans.length > 0 &&
          plans.map((plan, index) => (
            <div className="flex flex-col h-full" key={index}>
              {plan.isRecommended ? (
                <div className="relative h-full flex flex-col">
                  <ShineBorder
                    borderWidth={2}
                    duration={20}
                    shineColor={[
                      "#CC4141",
                      "#ff6b6b",
                      "#FFFFFF",
                      "#ff6b6b",
                      "#CC4141",
                    ]}
                    className="rounded-3xl absolute inset-0 overflow-visible z-10"
                  />
                  <div className="text-white text-center bg-gradient-to-br from-red-400 to-red-700 font-bold rounded-t-3xl px-4 py-2">
                    Most Popular
                  </div>
                  <PlanCard
                    plan={plan}
                    index={index}
                    data={data}
                    isRecommended={true}
                  />
                </div>
              ) : (
                <div className="mt-9 h-full">
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
      { addOns  && <AddOns addOns={addOns} />}
    </div>
  );
};

const AddOns = ({ addOns }: { addOns: AddOn }) => {
  return (
    <div className="flex max-w-3xl mx-auto my-10 p-10 flex-col w-full bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] border-white/20 border-2 rounded-xl">
      <div className="flex gap-10">
        <div className="flex flex-col w-1/2">
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
        <div className="flex flex-col justify-center text-center w-1/2">
          {addOns?.actionButton && (<Actions
            //@ts-expect-error investigate after
            actions={[addOns?.actionButton]}
            className="w-3/4"
          />)}
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
  return (
    <div
      className={`plan-card text-white border ${
        isRecommended
          ? "border-transparent rounded-b-3xl"
          : "border-opacity-10 border-white rounded-3xl"
      } px-6 py-10 shadow-xl bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-200 bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] relative h-full flex flex-col flex-grow`}
      data-tina-field={tinaField(data, "plans", index)}
    >
      {plan.planTier && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-3xl font-bold">{plan.planTier}</h3>
        </div>
      )}

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
      {plan.priceDescription && (
        <div className="text-base text-white/50 pb-3">
          {curlyBracketFormatter(plan.priceDescription)}
        </div>
      )}
      <TimeSavedBoxed
        timeSaved={plan.timeSaved}
        isRecommended={plan.isRecommended}
      />
      <div className="flex-col pb-3 flex-grow">
        <h3 className="text-base text-white font-bold pb-1">
          {plan.listTitle}
        </h3>
        {plan.listItems?.map((item: string, index: number) => (
          <div key={index} className="flex items-start gap-2 py-1">
            <TiTick
              className={`rounded-full p-1 mt-1 text-xl ${
                plan.isRecommended
                  ? "bg-[#CC4141] text-white"
                  : "bg-[#222121] text-[#CC4141]"
              }`}
            />
            <span className="text-white/50">{curlyBracketFormatter(item)}</span>
          </div>
        ))}
      </div>
      <div className="flex-col mt-auto">
        {plan.actions && (
          <Actions
            //@ts-expect-error investigate after
            actions={[plan.actions]}
            className="w-[100%]"
          />
        )}
      </div>
    </div>
  );
};

const TimeSavedBoxed = ({
  timeSaved,
  isRecommended,
}: {
  timeSaved: string;
  isRecommended: boolean;
}) => {
  return (
    <div
      className={`flex flex-col p-2 border border-white/20 rounded-lg mb-3 ${
        isRecommended ? "bg-[#CC4141]/10" : "bg-[#222121]"
      }`}
    >
      <div className="flex items-center gap-2 text-[#797979]">
        <CiClock1 className={`text-[#CC4141]`} /> <span>Time Saved</span>
      </div>
      <div className="text-[#CC4141] text-2xl font-bold">{timeSaved}</div>
    </div>
  );
};

export default Pricing;
