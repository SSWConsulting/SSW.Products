import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import Container from "../../Container";
import Actions from "./ActionsButton";
import { curlyBracketFormatter } from "./Hero/Hero";

interface CalculatorTier {
  tier: string;
  description: string[];
  price: number;
  tierDescription: TinaMarkdownContent;
  actions: any;
}

interface CustomSliderProps {
  initialValue: number;
  finalValue: number;
  step: number;
  defaultValue: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

const CustomSlider = ({
  initialValue,
  finalValue,
  step,
  defaultValue,
  onChange,

  formatValue = (value) => `$${value}`,
}: CustomSliderProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  const percentage =
    ((value - initialValue) / (finalValue - initialValue)) * 100 + 0.5;

  const halfWayValue = (initialValue + finalValue) / 2;

  return (
    <div className="w-full">
      <div className="relative w-full h-2 bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-[#e34f4f] to-[#D699FB] via-[#FF778E] rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
        <input
          type="range"
          min={initialValue}
          max={finalValue}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-white/50">
        <span>{formatValue(initialValue)}</span>
        <span>{formatValue(halfWayValue)}</span>
        <span>{formatValue(finalValue)}</span>
      </div>
    </div>
  );
};

const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 w-64 p-2 text-sm bg-[#242323] text-white rounded-md shadow-lg left-full ml-2 top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute w-2 h-2 bg-[#242323] rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CalculatorComponent({ data }: { data: any }) {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [hourlyRate, setHourlyRate] = useState(100);
  const [hoursSaved, setHoursSaved] = useState(
    data.tiers[selectedTier].estimatedHoursSaved
  );
  const [itemsAbleToCreate, setItemsAbleToCreate] = useState(
    data.tiers[selectedTier].itemsAbleToCreate
  );

  const RECCOMENDED_TIER_INDEX = 1;

  useEffect(() => {
    setHoursSaved(data.tiers[selectedTier].estimatedHoursSaved);
    setItemsAbleToCreate(data.tiers[selectedTier].itemsAbleToCreate);
  }, [selectedTier, data.tiers]);

  return (
    <Container>
      <h2 className="text-3xl text-center font-semibold text-white mb-4">
        {" "}
        {curlyBracketFormatter(data?.title)}
      </h2>
      <p className="text-white text-base text-center px-4 mb-8">{data?.desc}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {data?.tiers?.map((tier: CalculatorTier, index: number) => (
          <CalculatorTierCard
            key={tier.tier}
            calculatorTier={tier}
            index={index}
            setSelectedTier={setSelectedTier}
            isSelected={selectedTier === index}
            isRecommended={index === RECCOMENDED_TIER_INDEX}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 w-full py-4">
        <div className="col-span-5 md:col-span-3 bg-[#131313]  text-white rounded-xl p-6 w-full">
          <div className="flex flex-col gap-4">
            <SliderBoxContent
              hourlyRate={hourlyRate}
              setHourlyRate={setHourlyRate}
            />
            <div className="mt-16 text-white/30 rounded-xl w-full text-sm overflow-hidden">
              <TinaMarkdown content={data?.bottomBox} />
            </div>
          </div>
        </div>
        <div className="col-span-5 md:col-span-2 bg-[#131313]  text-white rounded-xl p-6 w-full">
          <EstimatedSavingsContent
            hourlyRate={hourlyRate}
            estimatedHoursSaved={hoursSaved}
            priceOfTier={data?.tiers[selectedTier]?.price}
            itemsAbleToCreate={itemsAbleToCreate}
          />
        </div>
      </div>
      <div className="flex justify-center pt-6">
        <Actions actions={[data?.bottomAction]} />
      </div>
    </Container>
  );
}

const EstimatedSavingsContent = ({
  hourlyRate,
  estimatedHoursSaved,
  priceOfTier,
  itemsAbleToCreate,
}: {
  hourlyRate: number;
  estimatedHoursSaved: number;
  priceOfTier: number;
  itemsAbleToCreate: number;
}) => {
  const monthlyValueReclaimed = estimatedHoursSaved * hourlyRate - priceOfTier;
  const annualValueReclaimed = monthlyValueReclaimed * 12;

  const isCustomTier = estimatedHoursSaved === 99999 || priceOfTier === 99999;

  return (
    <div className="w-full flex flex-col space-y-3">
      <h3 className="text-2xl text-white font-bold">Your ROI with YakShaver</h3>
      <div className="flex flex-col">
        <p className="text-white/50">Monthly Detailed Work Items</p>
        <p
          className={`text-white font-bold ${
            isCustomTier ? "text-xl" : "text-2xl"
          }`}
        >
          <span className="flex gap-2 align-baseline items-baseline">
            {isCustomTier
              ? "Enough to fill a warehouse"
              : `Up to ${itemsAbleToCreate}`}
          </span>
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex align-baseline items-center gap-1">
          <p className="text-white/50">Monthly Time Saved</p>
          <Tooltip text="Based on average time saved of 30 minutes per work item">
            <IoIosInformationCircleOutline className="text-white/50 cursor-help" />
          </Tooltip>
        </div>
        <p
          className={`bg-gradient-to-r from-[#e34f4f] via-[#D699FB] to-[#FF778E] bg-clip-text text-transparent font-bold ${
            isCustomTier ? "text-xl" : "text-2xl"
          }`}
        >
          {isCustomTier
            ? "Let's just say... your devs will notice"
            : `${estimatedHoursSaved} hours`}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex align-baseline items-center gap-1">
          <p className="text-white/50">Monthly Value Reclaimed</p>
          <Tooltip text="Calculated as: (Monthly Time Saved × Hourly Rate) - Monthly Price">
            <IoIosInformationCircleOutline className="text-white/50 cursor-help" />
          </Tooltip>
        </div>
        <p
          className={`bg-gradient-to-r from-[#e34f4f] via-[#D699FB] to-[#FF778E] bg-clip-text text-transparent font-bold ${
            isCustomTier ? "text-xl" : "text-2xl"
          }`}
        >
          {isCustomTier
            ? "Ask your CFO (after they stop smiling)"
            : `$${monthlyValueReclaimed.toLocaleString()}`}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex align-baseline items-center gap-1">
          <p className="text-white/50">Annual Value Reclaimed</p>
          <Tooltip text="Monthly Value Reclaimed × 12 months">
            <IoIosInformationCircleOutline className="text-white/50 cursor-help" />
          </Tooltip>
        </div>
        <p
          className={`bg-gradient-to-r from-[#e34f4f] via-[#D699FB] to-[#FF778E] bg-clip-text text-transparent font-bold ${
            isCustomTier ? "text-xl" : "text-2xl"
          }`}
        >
          {isCustomTier
            ? "You'll want a meeting for this one"
            : `$${annualValueReclaimed.toLocaleString()}`}
        </p>
      </div>
    </div>
  );
};

const SliderBoxContent = ({
  hourlyRate,
  setHourlyRate,
}: {
  hourlyRate: number;
  setHourlyRate: (rate: number) => void;
}) => {
  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex justify-between">
        <h3 className="text-2xl text-white font-bold">
          Average Hourly Rate of Employee
        </h3>
      </div>

      <p className="text-white/50 pb-3">
        Adjust the slider to match the average hourly rate of your employees.
      </p>
      <div className="bg-gradient-to-r from-[#e34f4f] via-[#D699FB] to-[#FF778E] bg-clip-text text-transparent font-bold text-2xl">
        ${hourlyRate} / hour
      </div>
      <CustomSlider
        initialValue={60}
        finalValue={600}
        step={10}
        defaultValue={hourlyRate}
        onChange={setHourlyRate}
        formatValue={(value) => `$${value}`}
      />
    </div>
  );
};

const CalculatorTierCard = ({
  calculatorTier,
  index,
  setSelectedTier,
  isSelected,
  isRecommended,
}: {
  calculatorTier: CalculatorTier;
  index: number;
  setSelectedTier: (index: number) => void;
  isSelected: boolean;
  isRecommended?: boolean;
}) => {
  return (
    <button
      className={cn(
        isSelected
          ? "[background-image:theme(backgroundImage.black-gradient),theme('backgroundImage.pink-gradient')] hover:[background-image:theme(backgroundImage.gray-gradient),theme(backgroundImage.pink-gradient)]"
          : "bg-black-gradient hover:bg-gray-gradient",
        "w-full box-border border-transparent border bg-origin-border [background-clip:padding-box,border-box] text-white rounded-xl p-6 flex flex-col gap-2 items-start text-start"
      )}
      onClick={() => setSelectedTier(index)}
    >
      <div className="flex-col w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-base">{calculatorTier.tier}</h3>
          {isRecommended && (
            <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Recommended
            </div>
          )}
        </div>
        <div className="flex">
          {calculatorTier?.price > 0 && calculatorTier.price < 9999 && (
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">$ {calculatorTier.price}</p>
              <span className="text-white/50 text-sm">per month</span>
            </div>
          )}
          {calculatorTier?.price === 99999 && (
            <p className="text-2xl font-bold">Custom</p>
          )}
          {calculatorTier?.price === 0 && (
            <p className="text-2xl font-bold">Free</p>
          )}
        </div>
      </div>

      <div className="flex flex-col pt-2 gap-1">
        {calculatorTier.description?.map((description, i) => (
          <div key={i} className="flex gap-2">
            <p
              className={`text-base text-white/50 leading-5 ${
                i === 0 ? "font-bold" : ""
              }`}
            >
              {description}
            </p>
          </div>
        ))}
      </div>
    </button>
  );
};
