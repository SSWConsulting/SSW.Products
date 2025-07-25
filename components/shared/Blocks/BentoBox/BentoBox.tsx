import { cn } from "@/lib/utils";
import { useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { FaExpandAlt } from "react-icons/fa";
import { FaMinus, FaXmark } from "react-icons/fa6";
import Container from "../../../Container";
import { ExampleYakShaverCard } from "../../../ui/MockYakShaverCards";
import TimeSavedCounterBox from "../../../utilityComponents/TimeSavedCounter";
import YaksShavedCounterBox from "../../../utilityComponents/YaksShavedCounter";
import { AnimatedBeamMultipleOutput } from "./AnimatedBeam";
import IconBox from "./IconBox";

import { IconBox as IconBoxProps } from "@/types/components/icon-box";

const YakShaverGray = "bg-[#131313] shadow-2xl";

function SmAndMdView({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Counter Boxes */}
      <div className="col-span-1">
        <YaksShavedCounterBox />
      </div>
      <div className="col-span-1">
        <TimeSavedCounterBox />
      </div>

      {/* Photo Box */}
      <div className="col-span-1 md:col-span-2">
        <PhotoBox photo={"/YakShaver/The-Yak.png"} />
      </div>

      {/* Large Box with Animated Content */}
      <div
        className={`${YakShaverGray} rounded-xl col-span-1 md:col-span-2 relative overflow-hidden h-96 md:h-64 flex flex-col sm:flex-row`}
      >
        <div className="absolute left-0 top-0 h-full w-full sm:w-[36%] bg-linear-to-r to-[#141414] via-[#131313] from-[#0e0e0e] z-10"></div>

        <Image
          src={"/YakShaver/Arrow-bg.png"}
          alt="yak"
          layout="fill"
          className="h-full w-full flex rounded-xl z-20 object-cover"
        />

        <div className="pt-14 md:pt-0 flex items-center justify-center h-1/2 sm:h-full w-full sm:w-2/3 z-30 order-first sm:order-last">
          <AnimatedBeamMultipleOutput data={data} />
        </div>

        <div className="pt-10 md:pt-6 lg:pt-20 flex flex-col justify-center p-6 z-30 w-full sm:w-1/2 order-last sm:order-first">
          <h2 className="text-white text-xl font-semibold">{data.title}</h2>
          <span className="text-[#797979] text-xs">{data.description}</span>
        </div>
      </div>
    </div>
  );
}

function LgView({ data }: { data: any }) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 pt-4 gap-4 h-96">
      {/* Left column (Sub-grid) */}
      <div className="grid gap-4">
        {/* First sub-row (Two columns) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Counter Box 1 - LHSsmall box */}
          {data.counterBox1?.counterMetric === "YakShaved" ? (
            <YaksShavedCounterBox />
          ) : data.counterBox1?.counterMetric === "MinutesSaved" ? (
            <TimeSavedCounterBox />
          ) : (
            <YaksShavedCounterBox />
          )}

          {/* Counter Box 2- RHS small box */}
          {data.counterBox2?.counterMetric === "YakShaved" ? (
            <YaksShavedCounterBox />
          ) : data.counterBox2?.counterMetric === "MinutesSaved" ? (
            <TimeSavedCounterBox />
          ) : (
            <YaksShavedCounterBox />
          )}
        </div>
        {/* Second sub-row (Full width) */}
        <PhotoBox photo={data?.bottomLeftBox?.media} />
      </div>
      {/* Right column (Full height box) */}
      <BeamBox data={data?.bottomRightBox} />
      {/* Large merged box */}
    </div>
  );
}

function BeamBox({ data }: { data: any }) {
  return (
    <div className={`${YakShaverGray} rounded-xl relative overflow-hidden`}>
      <Image
        src={"/YakShaver/Arrow-bg.png"}
        alt="yak"
        layout="fill"
        className="h-full w-full rounded-xl object-cover"
      />
      <div className="absolute inset-0 -bottom-2 flex items-end">
        <AnimatedBeamMultipleOutput data={data} />
      </div>
      <div className="absolute bottom-0 w-full pb-4  px-6">
        <h2 className="text-white text-xl font-semibold">{data?.title}</h2>
        <span className="text-[#797979] text-sm">{data?.description}</span>
      </div>
    </div>
  );
}

function PhotoBox({ photo }: { photo: string }) {
  return (
    <div className={`${YakShaverGray} md:h-64 h-32 rounded-xl relative`}>
      <Image
        src={photo || "/YakShaver/The-Yak.png"}
        alt="yak"
        layout="fill"
        className="h-full w-full rounded-xl filter grayscale object-cover"
      />
    </div>
  );
}

function SSWBadge({ title, link }: { title: string; link?: string }) {
  return (
    <div className="flex justify-center">
      <Link href={link || ""} target="_blank">
        <div className="inline-flex py-2 px-4 rounded-xl bg-[#131313] justify-center items-center text-white border border-gray-400 transition-all hover:bg-white/20 duration-300 uppercase">
          {title}
          <Image
            src={"/svg/ssw-4-square.svg"}
            alt="ssw-4-square"
            className="ml-2"
            width={20}
            height={20}
          />
        </div>
      </Link>
    </div>
  );
}

export function TitleFadeIn({ title }: { title: string }) {
  const titleWrapper = useRef(null);
  const isInView = useInView(titleWrapper, { once: true });
  const words = title.split(" ");
  const lastWord = words.pop();
  const firstPart = words.join(" ");

  return (
    <>
      <div className="text-white text text-center text-3xl font-semibold pb-12">
        <span className="inline-block max-w-full break-words">
          {firstPart}
          {firstPart ? " " : ""}
          <span className="whitespace-nowrap text-ssw-red">
            {lastWord?.split("").map((char, index) => (
              <span
                ref={titleWrapper}
                key={index}
                style={
                  {
                    "--text-duration": `${index * 100}ms`,
                  } as React.CSSProperties
                }
                className={cn(
                  "inline-block fade-in animate-in duration-2000 delay-(--text-duration) ease-in-out",
                  isInView ? "opacity-100" : "opacity-0"
                )}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      </div>
    </>
  );
}

export default function BentoBox({ data }: { data: any }) {
  const { topLeftBox, topRightBox } = data;
  return (
    <div className="flex flex-col">
      <Container size="small">
        <TitleFadeIn title={data?.title} />
      </Container>
      <Container className="text-white mx-auto">
        {/* Container */}
        <div className=" grid gap-4">
          {/* Row 1 (Single row, 2 columns) */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4  relative">
            {/* Top Left box */}
            <div className="relative md:col-span-2 col-span-1 rounded-xl md:h-80 lg:h-72">
              <div
                className={`${YakShaverGray} relative rounded-xl w-full h-full p-4`}
              >
                {/* Status bar */}
                <div className="flex flex-row gap-2">
                  <div className="bg-red-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
                    <FaXmark className="hidden group-hover:block absolute text-[8px] text-black" />
                  </div>
                  <div className="bg-yellow-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
                    <FaMinus className="hidden group-hover:block absolute text-[8px] text-black" />
                  </div>
                  <div className="bg-green-500 w-3 h-3 rounded-full relative flex items-center justify-center group">
                    <FaExpandAlt className="hidden group-hover:block absolute text-[8px] text-black" />
                  </div>
                </div>
                <div className="w-full mt-6 mx-3">
                  <h2 className="text-white md:text-2xl lg:text-4xl font-semibold text-center">
                    {topLeftBox.title}
                  </h2>
                </div>
                <div className="md:mt-12 mt-4 flex items-center flex-row justify-center gap-4 md:gap-6">
                  {topLeftBox.icons &&
                    topLeftBox.icons.map(
                      (icon: IconBoxProps, index: number) => (
                        <IconBox
                          iconLinkTitle={icon?.iconLinkTitle}
                          key={index}
                          iconImage={icon?.iconImage}
                          iconLink={icon?.iconLink}
                          iconToolTipText={icon.iconToolTipText}
                        />
                      )
                    )}
                </div>
              </div>
            </div>
            {/* Right box */}
            <div className="relative col-span-1 rounded-xl h-80 md:h-80 lg:h-72 overflow-hidden">
              <div className="absolute -inset-1 bg-linear-to-r from-gray-900 to-gray-400 rounded-xl blur-sm opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div
                className={`${YakShaverGray} relative rounded-xl w-full h-full`}
              >
                <div className="p-6 pb-0 md:pb-6">
                  <h2 className="text-white text-2xl font-semibold">
                    {topRightBox.title}
                  </h2>
                  <p className="text-[#797979] text-sm">
                    {topRightBox.description}
                  </p>
                </div>
                <div className="text-white flex justify-center items-center p-4 scale-75 md:scale-[65%] -mt-10 md:-mt-16">
                  <ExampleYakShaverCard />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 (2 Rows) */}
        <div className="pt-4 lg:pt-0">
          <div className="hidden lg:block">
            <LgView data={data} />
          </div>
          <div className="lg:hidden block">
            <SmAndMdView data={data.bottomRightBox} />
          </div>
        </div>
        <div className="pt-10">
          <SSWBadge title={data?.badge} link={data?.badgeLink} />
        </div>
      </Container>
    </div>
  );
}
