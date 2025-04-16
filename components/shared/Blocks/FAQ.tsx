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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Container className="text-white mx-auto" size="medium">
      <h2
        className="text-3xl font-semibold pb-12 flex justify-center"
        data-tina-field={tinaField(data, "headline")}
      >
        {data.headline}
      </h2>
      <p className="mb-8 text-base" data-tina-field={tinaField(data, "text")}>
        {data.text}
      </p>
      <hr className="border-white" />
      <div className="" data-tina-field={tinaField(data, "questions")}>
        {data.questions.map((item: FAQItem, index: number) => (
          <div key={index} data-tina-field={tinaField(item)}>
            <button
              className="w-full text-left py-4 px-4 focus:outline-none flex justify-between items-center"
              onClick={() => toggleQuestion(index)}
            >
              <h3
                className="text-lg font-bold"
                data-tina-field={tinaField(item, "question")}
              >
                {item.question}
              </h3>

              {activeIndex === index ? (
                <FaMinus className="ml-auto text-[#e34f4f]" />
              ) : (
                <FaPlus className="ml-auto text-[#e34f4f]" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out`}
              style={{
                maxHeight: activeIndex === index ? "500px" : "0",
                opacity: activeIndex === index ? 1 : 0,
                transform: `translateY(${
                  activeIndex === index ? "0" : "-10px"
                })`,
              }}
            >
              <div className="px-4 pb-4">
                <p data-tina-field={tinaField(item, "answer")}>{item.answer}</p>
              </div>
            </div>
            {index !== data.questions.length - 1 && (
              <hr className="border-white" />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FAQ;
