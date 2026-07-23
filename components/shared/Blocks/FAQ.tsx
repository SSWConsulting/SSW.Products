import { Fragment, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { tinaField } from "tinacms/dist/react";
import { slugifyHeading } from "@utils/anchorSlug";
import Container from "../../Container";
import LinkableHeading, { HeadingAnchorLink } from "../LinkableHeading";

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
      <LinkableHeading
        as="h2"
        wrap
        className="text-3xl font-semibold mb-12 flex justify-center"
        data-tina-field={tinaField(data, "headline")}
      >
        {data.headline}
      </LinkableHeading>
      <p className="mb-8 text-base" data-tina-field={tinaField(data, "text")}>
        {data.text}
      </p>
      <hr className="border-white" />
      {data.questions.map((item: FAQItem, index: number) => (
        <Fragment key={index}>
          <Question item={item} data-tina-field={tinaField(item)} />
          {index !== data.questions.length - 1 && (
            <hr className="border-white" />
          )}
        </Fragment>
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
  const slug = slugifyHeading(item.question);

  // A link to a collapsed question would land on a hidden answer, so open it
  useEffect(() => {
    if (!slug) return;
    const openIfLinked = () => {
      if (window.location.hash === `#${slug}`) setIsOpen(true);
    };
    openIfLinked();
    window.addEventListener("hashchange", openIfLinked);
    return () => window.removeEventListener("hashchange", openIfLinked);
  }, [slug]);

  return (
    <div
      id={slug || undefined}
      className="w-full group scroll-mt-28"
      data-tina-field={props["data-tina-field"]}
    >
      {/* the self-link is a sibling of the button: an <a> inside a <button> is
          invalid HTML, so the question text can't be the link here */}
      <div className="flex items-center pr-4">
        <button
          className="grow text-left py-4 px-4 focus:outline-hidden flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* eslint-disable-next-line no-restricted-syntax -- anchored via
              the wrapper id above; an <a> inside this <button> is invalid */}
          <h3 className="text-lg font-bold">{item.question}</h3>

          {isOpen ? (
            <FaMinus className="ml-auto text-[#e34f4f]" />
          ) : (
            <FaPlus className="ml-auto text-[#e34f4f]" />
          )}
        </button>
        {slug && <HeadingAnchorLink slug={slug} />}
      </div>
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
