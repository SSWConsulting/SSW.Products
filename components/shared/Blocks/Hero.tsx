import { WordRotate } from "@/components/magicui/word-rotate";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import { FaExpandAlt, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const TranscriptBox = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <div className="flex w-full">
      {/* LHS */}
      <div className="bg-gray-800 w-1/2 flex flex-col rounded-tl-xl rounded-bl-xl py-6 px-6  border border-gray-600">
        <div className="flex gap-4">
          <div className="bg-red-600 rounded-full w-10 h-10 text-lg text-center flex items-center justify-center font-bold">
            Y
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              {data.leftHandSide?.issueReportTitle}
            </span>
            <span className="text-sm">
              {data.leftHandSide?.issueReportSubTitle}
            </span>
          </div>
        </div>

        <span className="text-red-600 font-mono pt-4">
          {data.leftHandSide?.issueReportByline}
        </span>
        {/* Transcript Box */}
        <div className="pt-4 font-mono text-sm">
          <div className="bg-gray-900 flex flex-col p-2 rounded-md border border-gray-600">
            {/* TODO - figure out how to get colour rendering */}
            <TinaMarkdown content={data.leftHandSide?.issueReportTranscript} />
            {/* <span>Issue Details</span>
                <span> 1. Status IDs not displaying in Active Projects</span>
                <span> 2. Fields hidden in project details</span>
                <span> 3. Affects all users in Dynamics CRM</span>
                <br />
                <span> Reported by: Ulysses</span>
                <span> Priority: Medium</span>
                <br />
                <span className="text-red-600">
                  {" "}
                  Video evidence attached below
                </span> */}
          </div>
        </div>
        {/* Empty Circle Buttons (for now) */}
        <div className="pt-4 flex gap-4">
          <div className="bg-gray-600 rounded-full w-10 h-10 animate-pulse">
            {""}
          </div>
          <div className="bg-gray-600 rounded-full w-10 h-10 animate-pulse">
            {""}
          </div>
        </div>
      </div>
      {/* RHS */}
      <div className="bg-gray-800 w-1/2 items-center flex justify-center rounded-tr-xl rounded-br-xl border border-gray-600">
        <div className="py-6 px-6 flex flex-col items-center justify-center w-full">
          {/* Top Line */}
          <div className="flex gap-1 items-center rounded-t-lg border border-gray-600 px-6 py-2 w-full">
            <div className="bg-red-500 w-3 h-3 rounded-full relative flex items-center justify-center group -ml-2">
              <FaXmark className="hidden group-hover:block absolute text-[8px] text-black" />
            </div>
            <div className="bg-yellow-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
              <FaMinus className="hidden group-hover:block absolute text-[8px] text-black" />
            </div>
            <div className="bg-green-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
              <FaExpandAlt className="hidden group-hover:block absolute text-[8px] text-black" />
            </div>
            <span className="ml-2">{data.rightHandSide?.issueReportSummaryTitle}</span>
            <span className="ml-auto text-gray-400"> v2.4.1</span>
          </div>
          {/* Content Box */}
          <div className="rounded-b-lg border-b w-full border-r border-l border-gray-600 bg-gray-900 px-4 py-2 flex flex-col gap-2">
            <span className="text-sm pt-4 font-semibold">
              {data.rightHandSide?.issueReportSummarySubtitle}
            </span>
            <div className="flex flex-col text-sm bg-gray-800 py-3 px-2 rounded-lg gap-2 relative">
              {/* Chat tab indicator */}
              <div className="absolute -bottom-2 left-4 w-4 h-2 bg-gray-800 transform -rotate-45 rounded-sm"></div>
              <TinaMarkdown content={data.rightHandSide.issueReportBody} />
              {/* <span>
                    Problem: "Missing Status IDs in Active Projects View"
                  </span>
                  <span>Assigned to "CRM Support Team"</span>
                  <span>Video Link: "Click to view recording"</span> */}
            </div>
            <div className="flex justify-end items-end py-4">
              <div className="bg-red-600 text-sm py-1 px-2 rounded-lg">
                View Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is a work-around for not using markdown. Its a custom 'MDX component' but cant use markdown so we are using a plain string
// "{ }" indicates text to be highlighted
const curlyBracketFormatter = (byLine: string) => {
  return byLine.split(/({.*?})/).map((part, index) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span
        key={index}
        className="bg-gradient-to-br from-rose-300 to-[#CC4141] bg-clip-text text-transparent"
      >
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    )
  );
};

export default function Hero({ data }: { data: any }) {
  console.log(data);

  return (
    <div className="flex flex-col items-center justify-center mx-auto pb-20 relative overflow-hidden">
      {/* Background Yak SVG */}
      <div className="absolute inset-0 z-0 flex justify-end items-center opacity-50 overflow-visible">
        <div className="w-[800px] h-[800px] translate-x-1/4">
          <Image
            src="/svg/yak-icon-fill-glow.svg"
            alt="Yak Icon Background"
            width={1000}
            height={1000}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Content (z-10 to appear above the background) */}
      <div className="z-10 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col font-bold items-center justify-center text-6xl text-white">
          <div className="pt-20 flex items-center justify-center gap-2">
            <h1>{data.titleBeforeRotate}</h1>
            <span className="text-[#CC4141] pl-1">
              <WordRotate words={data.rotatingWords} className="" />
            </span>
          </div>
          <div>
            <h1>{data.titleAfterRotate}</h1>
          </div>
        </div>
        <h2 className="text-white text-center text-xl pt-12 max-w-3xl">
          {curlyBracketFormatter(data.byLine)}
        </h2>

        <div className="flex items-center justify-center pt-12 gap-6">
          <ShinyButton className="bg-gradient-to-br from-rose-300 to-[#CC4141] text-white py-4 px-6 border border-white/30 hover:-top-1 transition-all ease-in-out duration-300 relative top-0">
            BOOK A DEMO
          </ShinyButton>

          <ShinyButton className="bg-[#131313] text-white py-4 px-6 border border-white/30 hover:-top-1 transition-all ease-in-out duration-300 relative top-0">
            WATCH VIDEO
          </ShinyButton>
        </div>
        <span className="flex justify-center text-white text-center text-sm pt-4">
          {data.buttonSubtext}
        </span>
        <div className="flex items-center justify-center pt-12 text-white max-w-6xl w-full">
          {/* Transcript Container */}
          <TranscriptBox data={data.reportUI} />
        </div>
      </div>
    </div>
  );
}
