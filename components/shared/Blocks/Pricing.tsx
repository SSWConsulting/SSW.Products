import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { TiTick } from "react-icons/ti";
import Actions from "./ActionsButton";

interface PlanAction {
  label: string 
  url: string 
  variant?: string 
  size?: string 
}

interface Plan {
  planTier: string;
  planDescription: string;
  price: string;
  subPriceText: string 
  actions: PlanAction 
  isReccomended: boolean;
}

interface AllPlan {
  title: string | null;
}

interface PricingData {
  title?: string;
  description?: any;
  allPlans?: AllPlan[];
  plans?: Plan[];
}

interface PricingProps {
  data: PricingData;
}

const Pricing: React.FC<PricingProps> = ({ data }) => {
  const { title, description, allPlans, plans } = data;

  return (
    <div className="pricing-component container mx-auto p-4 lg:pb-40">
      {title && (
        <h1 className="text-5xl text-center font-helvetica text-white mb-4">
          {title}
        </h1>
      )}

      {description && (
        <div className="text-lg text-white text-center mb-8">
          <TinaMarkdown content={description} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {allPlans && allPlans.length > 0 && (
          <div className="all-plans p-4 rounded-lg text-white">
            <h3 className="text-xl font-semibold mb-4">All Plans Include:</h3>
            <ul>
              {allPlans.map(
                (plan, index) =>
                  plan?.title && (
                    <li key={index} className="flex items-center text-md pb-2">
                      <TiTick className="text-white mr-2" />
                      {plan.title}
                    </li>
                  )
              )}
            </ul>
          </div>
        )}

        
        {plans &&
          plans.length > 0 &&
          plans.map((plan, index) => (
            <div
              key={index}
              className={`plan-card text-white border border-opacity-10 font-helvetica border-white px-6 py-10 rounded-3xl shadow-xl bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-200 bg-stone-600 ${
                plan.isReccomended
                  ? "border-3 border-white border-opacity-100"
                  : ""
              }`}
            >
              {plan.planTier && (
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-3xl">{plan.planTier}</h3>
                  {plan.isReccomended && (
                    <p className="text-sm bg-gray-300 bg-opacity-40 rounded-full px-2 py-1">Most Popular</p>
                  )}
                </div>
              )}

              {plan.planDescription && (
                <p className="text-md mb-8">{plan.planDescription}</p>
              )}
              {plan.price && <p className="text-3xl mb-2">{plan.price}</p>}
              {plan.subPriceText && (
                <p className="text-sm text-white mb-4">{plan.subPriceText}</p>
              )}

              {plan.actions && (
                // @ts-expect-error investigate after
                <Actions actions={[plan.actions]} className="w-[100%]" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Pricing;
