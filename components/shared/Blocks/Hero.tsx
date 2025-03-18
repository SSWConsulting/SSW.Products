import { WordRotate } from "@/components/magicui/word-rotate";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import { FaExpandAlt, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const TranscriptBox = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <div className="flex flex-col md:flex-row  w-full px-10 lg:px-6">
      {/* LHS */}
      <div className="bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] w-full md:w-1/2 flex flex-col rounded-tl-xl md:rounded-bl-xl rounded-tr-xl md:rounded-tr-none py-6 px-6 border border-white/20 ">
        <div className="flex gap-4">
          <div className="bg-red-700 rounded-full w-10 h-10 text-lg text-center flex items-center justify-center font-bold">
            Y
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold lg:text-lg text-sm">
              {data?.leftHandSide?.issueReportTitle}
            </span>

            <span className="lg:text-sm text-xs text-gray-400">
              {data?.leftHandSide?.issueReportSubTitle}

            
            </span>
          </div>
        </div>


        <span className="text-gray-400 font-mono lg:pt-4 pt-2 lg:text-sm text-xs">
          {data?.leftHandSide?.issueReportByline}

        </span>
        {/* Transcript Box */}
        <div className="pt-2 font-mono lg:text-sm text-xs">
          <div className="bg-gradient-to-r to-[#1f1f1f] via-[#1e1e1e] from-[#292929] flex flex-col p-2 rounded-md border border-white/20">
            {/* TODO - figure out how to get colour rendering */}
            <TinaMarkdown content={data?.leftHandSide?.issueReportTranscript} />
          </div>
        </div>
        {/* Empty Circle Buttons (for now) */}
        <div className="pt-4 flex gap-4">
          <div className="bg-[#292929] rounded-full w-10 h-10 animate-pulse">
            {""}
          </div>
          {/* <div className="bg-gray-600 rounded-full w-10 h-10 animate-pulse">
            {""}
          </div> */}
        </div>
      </div>
      {/* RHS */}
      <div className="bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] w-full md:w-1/2 items-center flex justify-center md:rounded-tr-xl rounded-bl-xl md:rounded-bl-none  rounded-br-xl border border-white/20">
        <div className="py-6 px-6 flex flex-col items-center justify-center w-full">
          {/* Top Line */}
          <div className="flex gap-1 items-center rounded-t-lg border border-white/20 px-6 py-2 w-full">
            <div className="bg-red-500 w-3 h-3 rounded-full relative flex items-center justify-center group -ml-2">
              <FaXmark className="hidden group-hover:block absolute text-[8px] text-black" />
            </div>
            <div className="bg-yellow-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
              <FaMinus className="hidden group-hover:block absolute text-[8px] text-black" />
            </div>
            <div className="bg-green-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
              <FaExpandAlt className="hidden group-hover:block absolute text-[8px] text-black" />
            </div>
            <span className="ml-2 lg:text-sm text-xs">
              {data?.rightHandSide?.issueReportSummaryTitle}
            </span>
            <span className="ml-auto text-gray-400 lg:text-sm text-xs">
              v2.4.1
            </span>
          </div>
          {/* Content Box */}

          <div className="rounded-b-lg border-b w-full border-r border-l border-white/20 bg-gradient-to-r to-[#1f1f1f] via-[#1e1e1e] px-4 py-2 flex flex-col gap-2">
            <span className="pt-4 lg:text-sm text-xs">
              {data?.rightHandSide?.issueReportSummarySubtitle}
            </span>
            <div className="flex flex-col  bg-gray-800 py-3 px-2 rounded-lg gap-2 relative lg:text-sm text-xs">
              {/* Chat tab indicator */}
              
              <TinaMarkdown content={data?.rightHandSide?.issueReportBody} />

            </div>
            <div className="flex justify-end items-end py-4">
              <div className="bg-red-700 text-xs py-1 px-2 rounded-md">
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
  return byLine?.split(/({.*?})/).map((part, index) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span
        key={index}
        className="bg-gradient-to-br from-red-400 to-red-700 bg-clip-text text-transparent font-bold"
      >
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    )
  );
};

export default function Hero({ data }: { data: any }) {
  return (
    <div className="flex items-center justify-center mx-auto pb-20 relative overflow-hidden pt-20 md:pt-20">
      {/* Background Yak SVG */}
      <div className="absolute inset-0 z-0 flex justify-end items-center opacity-50 overflow-visible">
        {data?.backgroundImageEnabled && (
          <div className="w-[800px] h-[800px] translate-x-1/4">
            <Image
              src="/svg/yak-icon-fill-glow.svg"
              alt="Yak Icon Background"
              width={1000}
              height={1000}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Content (z-10 to appear above the background) */}
      <div className="z-10 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col font-bold items-center justify-center text-2xl md:text-5xl  text-white">
          <div className="pt-20 flex items-center justify-center gap-2">
            <h1>{data?.titleBeforeRotate}</h1>
            <span className="text-[#CC4141] pl-1">

              <WordRotate words={data?.rotatingWords} className="" />

            </span>
          </div>
          <div>
            <h1>{data?.titleAfterRotate}</h1>
          </div>
        </div>
        <h2 className="text-white text-center text-base md:text-lg pt-6 lg:pt-12 max-w-3xl px-10 lg:px-0">
          {curlyBracketFormatter(data?.byLine)}
        </h2>

        {/* Buttons */}
        <div className="flex items-center justify-center pt-12 gap-6">
          {data?.ctaLeft?.title && data?.ctaLeft?.link && (
            <div>


              <ShinyButton href={data.ctaLeft?.link} className="bg-gradient-to-br from-red-500 to-red-800 text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0">
                {data.ctaLeft?.title}

              </ShinyButton>
            </div>
          )}
          {data?.ctaRight?.title && data?.ctaRight?.link && (
            <div>


              <ShinyButton href={data.ctaRight?.link} className="bg-[#131313] text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0">
                {data.ctaRight?.title}

              </ShinyButton>
            </div>
          )}
        </div>
        <span className="flex justify-center text-white text-center lg:text-sm text-xs pt-4">
          {data?.buttonSubtext}
        </span>
        <div className="flex items-center justify-center pt-12 text-white max-w-6xl w-full">
          {/* Transcript Container */}
          {data?.reportUIEnabled && <TranscriptBox data={data?.reportUI} />}
        </div>
      </div>
    </div>
  );
}

