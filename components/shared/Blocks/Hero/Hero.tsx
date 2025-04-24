import { WordRotate } from "@/components/magicui/word-rotate";
import { cn } from "@/lib/utils";
import {
  TextPart,
  TranscriptBoxProps,
  TypewriterTextProps,
} from "@/types/components/transcript";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import Container from "../../../Container";
import { HeroYakShaverCard } from "../../../ui/MockYakShaverCards";

import Link from "next/link";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { AudioWaveAnimation } from "./AudioWaveAnimation";
import { GradientBackground } from "./GradientBackground";
import { YakAnimate, YakBorderAnimate } from "./yak-animate";

// Typing Animation Component - made by Cursor
const TypewriterText = ({
  text,
  repeatDelay = 60,
  startDelay = 0,
  className,
  shouldStartTyping,
  setShouldStartTyping,
}: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isHighlightingComplete, setIsHighlightingComplete] = useState(false);
  const [parts, setParts] = useState<TextPart[]>([]);

  // const isTypingComplete = displayText.length === text.length;

  const clearText = useCallback(() => {
    setDisplayText("");
    setIsTypingComplete(false);
    setIsHighlightingComplete(false);
  }, []);

  const playTypingAnimation = useCallback(() => {
    if (!shouldStartTyping) return;
    // Parse the text to identify parts to be highlighted
    const parsedParts = text.split(/({.*?})/).map((part) => ({
      text:
        part.startsWith("{") && part.endsWith("}") ? part.slice(1, -1) : part,
      highlight: part.startsWith("{") && part.endsWith("}"),
    }));
    setParts(parsedParts);

    // Start typing animation
    let fullText = "";
    const flatText = parsedParts.map((part) => part.text).join("");

    const typingSpeed = 2000 / flatText.length; // Distribute typing over 5 seconds

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < flatText.length) {
        fullText += flatText[i];
        setDisplayText(fullText);
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);

        // After typing completes, wait a moment then start the highlighting animation
        setTimeout(() => {
          setIsHighlightingComplete(true);
        }, 500);
      }
    }, typingSpeed);
  }, [text, shouldStartTyping]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (shouldStartTyping) {
      clearText();
      typingTimeout = setTimeout(() => {
        playTypingAnimation();
      }, startDelay);
    }
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [shouldStartTyping, playTypingAnimation, text, startDelay, clearText]);

  if (isTypingComplete && setShouldStartTyping) {
    setShouldStartTyping(false);
    setTimeout(() => {
      if (setShouldStartTyping) {
        setShouldStartTyping(true);
      }
    }, 1000 * repeatDelay);
  }

  if (!text) return null;

  // Before typing is complete, show the plain text being typed
  if (!isTypingComplete) {
    return <span>{displayText}</span>;
  }

  // After typing is complete, show the highlighted version
  return (
    <span className={cn(className)}>
      {parts.map((part, index) =>
        part.highlight ? (
          <span
            key={index}
            className={`
              relative overflow-hidden
              ${
                isHighlightingComplete
                  ? "text-black bg-white rounded-[2px]"
                  : "text-white bg-none"
              }
              transition-colors duration-500 ease-in-out
            `}
          >
            {/* Background highlight with animation */}
            <span
              className={`
                absolute inset-0
                bg-white
                rounded-[2px]
                origin-left
                ${isHighlightingComplete ? "scale-x-100" : "scale-x-0"}
                transition-transform duration-500 ease-in-out
                -z-10
              `}
            />
            <span className="px-[0.1rem]">{part.text}</span>
          </span>
        ) : (
          part.text
        )
      )}
    </span>
  );
};

const TranscriptBox = ({ data }: { data: TranscriptBoxProps }) => {
  // Calculate total animation duration for staggering
  const staggerDelay = 2100;
  const [shouldStartTyping, setShouldStartTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setShouldStartTyping(true);
  }, [data?.leftHandSide?.issueReportText]);
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 7000);
  }, []);

  return (
    <Container className="flex flex-col lg:flex-row pt-12 text-white w-full">
      {/* LHS */}
      <div className="relative bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] w-full lg:w-1/2 flex flex-col rounded-[20px] py-6 px-6 ">
        <div className="bg-gradient-to-r to-[#1f1f1f] via-[#1e1e1e] from-[#292929] rounded-2xl p-3 h-[20.625rem]">
          <div className="flex gap-4 pb-2">
            <div className="rounded-full w-10 h-10 text-lg text-center flex items-center justify-center font-bold">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/YakShaver/People/uly-avatar.png"
                  alt="Uly Avatar"
                  width={40}
                  height={40}
                  className="rounded-full relative z-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="lg:text-sm text-xs text-white">
                {data.leftHandSide?.issueReportName}
              </span>
            </div>
            <div className="flex-grow flex justify-end items-center">
              <div className="relative w-10 h-10 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#CC4141]/50 flex items-center justify-center">
                <AudioWaveAnimation />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            {data.leftHandSide?.issueReportText?.map((text, index: number) => {
              return (
                <>
                  {data?.leftHandSide?.issueReportText && (
                    <span key={index}>
                      <TypewriterText
                        setShouldStartTyping={
                          index === data.leftHandSide.issueReportText.length - 1
                            ? setShouldStartTyping
                            : undefined
                        }
                        shouldStartTyping={shouldStartTyping}
                        className="text-xs xl:text-base"
                        text={text || ""}
                        startDelay={index * staggerDelay}
                      />
                    </span>
                  )}
                </>
              );
            })}
          </div>
        </div>

        <div className="flex  justify-center items-center gap-6 w-full pt-4 ">
          <div className="w-full">
            <h2 className="text-white text-2xl pb-2 ">
              {" "}
              {data.leftHandSide?.issueReportSummaryTitle}{" "}
            </h2>
            <span className="font-light text-sm">
              {" "}
              {data.leftHandSide?.issueReportSummarySubtitle}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center p-5">
        <div className="relative md:w-20 md:h-20 h-20 w-20 overflow-visible bg-[#2b1f3b] rounded-full">
          <YakBorderAnimate />
          <div className="absolute inset-[3px] z-10 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-br from-white via-[#e6e6e6] to-[#c4c4c4]">
            <div className="scale-90 flex items-center justify-center">
              <YakAnimate />
            </div>
          </div>
        </div>
      </div>
      {/* RHS */}
      <div className="relative bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] w-full lg:w-1/2 flex flex-col rounded-[20px] p-6 ">
        <HeroYakShaverCard isVisible={isVisible} />

        <div className="flex  items-center gap-6 w-full pt-4 ">
          <div className="w-full">
            <h2 className="text-white text-2xl pb-2 ">
              {" "}
              {data.rightHandSide?.issueReportSummaryTitle}{" "}
            </h2>
            <span className="font-light text-sm">
              {" "}
              {data.rightHandSide?.issueReportSummarySubtitle}
            </span>
          </div>
        </div>
      </div>
    </Container>
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

// The old formatter is kept but no longer used in TranscriptBox
export const highlightCurlyBracketFormatter = (byLine: string) => {
  return byLine?.split(/({.*?})/).map((part, index) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span
        key={index}
        className="text-black bg-white rounded-[2px] px-[0.1rem]"
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
    <div className="relative max-w-7xl mx-auto">
      <GradientBackground />
      <div className="flex items-center w-full justify-center mx-auto relative overflow-hidden">
        {/* Content (z-10 to appear above the background) */}
        <div className="z-10 flex flex-col items-center justify-center w-full">
          <Container
            className="z-10 flex flex-col items-center justify-center w-full"
            size="small"
          >
            <div className="flex flex-col font-bold items-center justify-center text-2xl md:text-5xl  text-white">
              <div className="pt-20 flex items-center justify-center gap-2">
                <h1>{data?.titleBeforeRotate}</h1>
                <span className="text-[#CC4141] pl-1">
                  <WordRotate words={data?.rotatingWords} />
                </span>
              </div>
              <div>
                <h1>{data?.titleAfterRotate}</h1>
              </div>
            </div>
            <h2 className="text-white flex flex-col gap-2 text-center text-base md:text-lg pt-6 lg:pt-12">
              <TinaMarkdown
                content={data?.byLine}
                components={{
                  bold: (props: { children: ReactNode } | undefined) => (
                    <span className="text-[#CC4141] font-bold">
                      {props?.children}
                    </span>
                  ),
                }}
              />
              {/* {curlyBracketFormatter(data?.byLine)} */}
            </h2>

            {/* Buttons */}
            <div className="flex items-center justify-center pt-12 gap-6">
              {data?.ctaLeft?.title && data?.ctaLeft?.link && (
                <Link
                  className="bg-white hover:bg-white/80 text-[#222222] px-5 py-2 font-bold rounded-lg transition-all ease-in-out duration-300 border border-white"
                  href={data.ctaLeft?.link}
                >
                  {data.ctaLeft?.title}
                </Link>
              )}
              {data?.ctaRight?.title && data?.ctaRight?.link && (
                <Link
                  className="px-5 py-2 font-bold rounded-lg text-white border border-white bg-none flex items-center text-center justify-center gap-2 hover:bg-white/10 transition-all ease-in-out duration-300"
                  href={data.ctaRight?.link}
                >
                  {data.ctaRight?.title} <FaChevronRight className="pb-0.5" />
                </Link>
              )}
            </div>
            <span className="flex justify-center text-white text-center lg:text-sm text-xs pt-4">
              {data?.buttonSubtext}
            </span>
          </Container>

          {/* Transcript Container */}
          {data?.reportUIEnabled && <TranscriptBox data={data?.reportUI} />}
        </div>
      </div>
    </div>
  );
}
