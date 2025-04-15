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
    <Container className="text-white mx-auto" size="small">
      <h1
        className="text-2xl font-semibold mb-6 flex justify-center"
        data-tina-field={tinaField(data, "headline")}
      >
        {data.headline}
      </h1>
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
                <FaMinus className="ml-auto" />
              ) : (
                <FaPlus className="ml-auto" />
              )}
            </button>
            <div
              className={`overflow-hidden`}
              style={{
                maxHeight: activeIndex === index ? "500px" : "0",
                transition:
                  activeIndex === index
                    ? "max-height 500ms ease-in-out"
                    : "max-height 0ms ease-in-out",
              }}
            >
              <div className="px-4 pb-4">
                <p data-tina-field={tinaField(item, "answer")}>{item.answer}</p>
              </div>
            </div>
            <hr className="border-white" />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FAQ;
