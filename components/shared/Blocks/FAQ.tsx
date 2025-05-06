import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { tinaField } from "tinacms/dist/react";
import Container from "../../Container";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQData = {
  headline: string;
  text: string;
  questions: FAQItem[];
};

const FAQ = ({ data }: { data: FAQData }) => {
  return (
    <Container className="text-white w-full mx-auto" size="medium">
      <h2
        className="text-3xl font-semibold mb-12 flex justify-center"
        data-tina-field={tinaField(data, "headline")}
      >
        {data.headline}
      </h2>
      <p className="mb-8 text-base" data-tina-field={tinaField(data, "text")}>
        {data.text}
      </p>
      <hr className="border-white" />
      {data.questions.map((item: FAQItem, index: number) => (
        <>
          <Question key={index} item={item} data-tina-field={tinaField(item)} />
          {index !== data.questions.length - 1 && (
            <hr className="border-white" />
          )}
        </>
      ))}
    </Container>
  );
};

const Question = ({
  item,
  ...props
}: {
  item: FAQItem;
  "data-tina-field": string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full" data-tina-field={props["data-tina-field"]}>
      <button
        className="w-full text-left py-4 px-4 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold">{item.question}</h3>

        {isOpen ? (
          <FaMinus className="ml-auto text-[#e34f4f]" />
        ) : (
          <FaPlus className="ml-auto text-[#e34f4f]" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out`}
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
          transform: `translateY(${isOpen ? "0" : "-10px"})`,
        }}
      >
        <div className="px-4 pb-4">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
