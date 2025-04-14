import { WordRotate } from "@/components/magicui/word-rotate";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import { FaExpandAlt, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { CircleLogo } from "./AnimatedBeam";
import { HeroYakShaverCard } from "../../ui/MockYakShaverCards";

const TranscriptBox = ({ data }: { data: any }) => {
  const testString =
    "I just encountered a problem in {TinaCloud}. When i was attempting to upload files larger than 5MB, the {application} {crashes} entirely.";
  const testString2 =
    "I am on the latest version of {Chrome}. This impacts user function significantly, I would classify it as {Priority 1}.";
  const testString3 =
    "I recalled {Matt and Adam} had a similar issue before. I'll need to inform the {operations team} this bug could affect their experience negatively";
  return (
    <div className="flex flex-col md:flex-row  w-full px-10 lg:px-6">
      {/* LHS */}
      <div className="bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] w-full md:w-1/2 flex flex-col rounded-xl py-6 px-6 border border-white/20 ">
        <div className="bg-gradient-to-r to-[#1f1f1f] via-[#1e1e1e] from-[#292929] rounded-lg p-3">
          <div className="flex gap-4 pb-2">
            <div className="rounded-full w-10 h-10 text-lg text-center flex items-center justify-center font-bold">
              <Image
                src="/YakShaver/People/uly-avatar.png"
                alt="Uly Avatar"
                width={40}
                height={40}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="lg:text-sm text-xs text-white">Uly</span>
              <span className="text-gray-400 text-xs">Monday 9:13am</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            <span> {highlightCurlyBracketFormatter(testString)}</span>
            <span> {highlightCurlyBracketFormatter(testString2)}</span>
            <span> {highlightCurlyBracketFormatter(testString3)}</span>
          </div>
        </div>

        <div className="flex  justify-center items-center gap-6 w-full pt-4 ">
          <div className="w-3/4">
            <h2 className="text-white text-2xl pb-2 "> ISSUE REPORT </h2>
            <span className="font-light text-sm">
              {" "}
              YakShaver Records and transcibes video in real-time - processing
              information for immediate analysis
            </span>
          </div>
          <div className="w-1/4">
            <Image
              src="/YakShaver/People/uly-office.png"
              alt="Uly Office"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center p-5">
        <CircleLogo ref={null} media={data?.middleLogo} />
      </div>
      {/* RHS */}
      <div className="bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] w-full md:w-1/2 flex flex-col rounded-lg border border-white/20 p-6">
        <HeroYakShaverCard />
        <div className="flex  items-center gap-6 w-full pt-4 ">
          <div className="w-full">
            <h2 className="text-white text-2xl pb-2 "> ISSUE SUMMARY </h2>
            <span className="font-light text-sm">
              {" "}
              Work items will be generated in real-time, assign and inform
              relevant parties, ensuring immediate tracking and management of
              tasks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is a work-around for not using markdown. Its a custom 'MDX component' but cant use markdown so we are using a plain string
// "{ }" indicates text to be highlighted
export const curlyBracketFormatter = (byLine: string) => {
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

export const SSWRedCurlyBracketFormatter = (byLine: string) => {
  return byLine?.split(/({.*?})/).map((part, index) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={index} className="text-[#CC4141]">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    )
  );
};

export const highlightCurlyBracketFormatter = (byLine: string) => {
  return byLine?.split(/({.*?})/).map((part, index) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={index} className="text-black bg-white rounded-sm p-[0.1rem]">
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
              <ShinyButton
                href={data.ctaLeft?.link}
                className="bg-gradient-to-br from-red-500 to-red-800 text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0"
              >
                {data.ctaLeft?.title}
              </ShinyButton>
            </div>
          )}
          {data?.ctaRight?.title && data?.ctaRight?.link && (
            <div>
              <ShinyButton
                href={data.ctaRight?.link}
                className="bg-[#131313] text-white py-4 px-6 border border-white/20 hover:-top-1 transition-all ease-in-out duration-300 relative top-0"
              >
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
