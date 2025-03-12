import Image from "next/image";

import { FaMinus, FaXmark } from "react-icons/fa6";
import { AnimatedBeamMultipleOutput } from "./AnimatedBeam";

import { FaExpandAlt } from "react-icons/fa";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Link from "next/link";
import YaksShavedCounterBox from "../../utilityComponents/YaksShavedCounter";
import TimeSavedCounterBox from "../../utilityComponents/TimeSavedCounter";

const YakShaverGray = "bg-[#131313] shadow-2xl";

function IconBox({ icon }: { icon: string }) {
  return (
    <div className="relative rounded-2xl md:w-[60px] md:h-[60px] w-[50px] h-[50px] flex items-center justify-center top-0 hover:-top-2 transition-all duration-300 group">
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-gray-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative rounded-2xl border border-gray-600 flex items-center justify-center w-full h-full">
        <div className="rounded-full border border-gray-600 bg-gradient-to-tr from-black to-gray-800 flex items-center justify-center md:h-12 md:w-12 h-10 w-10">
          <div className="w-5 h-5 md:w-7 md:h-7 relative">
            <Image
              src={icon || "/svg/github-mark-white.svg"}
              alt="icon"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExampleYakShaverCard() {
  return (
    <div className="bg-[#1E1E20] border-2  text-xs border-[#4D4D4E] shadow-2xl rounded-xl p-4  text-white ">
      <h2 className=" font-semibold pb-2 px lg:whitespace-nowrap whitespace-nowrap md:whitespace-normal">
        {" "}
        ✅ Done - ✨ A Work Item has been created by YakShaver.ai 🐂
      </h2>
      <h3 className="pb-1">Project</h3>

      <TypingAnimation className="h-[24px] items-center text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]">
        tina.io
      </TypingAnimation>

      <h3 className="pb-1">Work Item #2818</h3>
      <TypingAnimation
        delay={1000}
        className="items-center  h-[24px] text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F] whitespace-nowrap overflow-hidden text-ellipsis"
      >
        🐛 Fix event display issue on tina.io homepage
      </TypingAnimation>
      <h3 className="pb-1">Assigned to</h3>
      <TypingAnimation
        delay={5300}
        className="items-center  h-[24px] text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]"
      >
        Betty Bondoc
      </TypingAnimation>
      <h3 className="pb-1">Mentioned Users</h3>
      <TypingAnimation
        delay={5600}
        className="items-center h-[24px] text-xs font-normal  mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]"
      >
        Adam Cogan, Matt Wicks
      </TypingAnimation>
    </div>
  );
}

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
        <div className="absolute left-0 top-0 h-full w-full sm:w-[36%] bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] z-10"></div>

        <Image
          src={"/YakShaver/Arrow-bg.png"}
          alt="yak"
          layout="fill"
          objectFit="cover"
          className="h-full w-full flex rounded-xl z-20"
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
      <div className="grid gap-2">
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
        objectFit="cover"
        className="h-full w-full rounded-xl"
      />
      <div className="absolute inset-0 -bottom-2 flex items-end">
        <AnimatedBeamMultipleOutput data={data} />
      </div>
      <div className="absolute bottom-0 w-full pb-4  px-6">
        <h2 className="text-white text-xl font-semibold">{data?.title}</h2>
        <span className="text-[#797979] text-xs">{data?.description}</span>
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
        objectFit="cover"
        className="h-full w-full rounded-xl filter grayscale"
      />
    </div>
  );
}

function SSWBadge({ title, link }: { title: string; link?: string }) {
  return (
    <div className="flex justify-center">
      <Link href={link || ""} target="_blank">
        <div className="inline-flex py-2 px-4 rounded-xl bg-[#131313] justify-center items-center text-white border border-gray-400 hover:text-[#CC4141] hover:border-[#CC4141] transition-all hover:font-bold duration-500">
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

function TitleFadeIn({ title }: { title: string }) {
  const words = title.split(" ");
  const lastWord = words.pop();
  const firstPart = words.join(" ");

  return (
    <>
      <div className="text-white text-center lg:text-4xl text-3xl font-semibold py-6">
        <span className="inline-block max-w-full break-words">
          {firstPart}
          {firstPart ? " " : ""}
          <span className="whitespace-nowrap">
            {lastWord?.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block"
                style={{
                  animation: `colorChange 2000ms ease-in-out forwards ${
                    index * 100
                  }ms`,
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      </div>
      <style jsx>{`
        @keyframes colorChange {
          to {
            color: #cc4141;
          }
        }
      `}</style>
    </>
  );
}

export default function BentoBox({ data }: { data: any }) {
  const { topLeftBox, topRightBox } = data;
  return (
    <div className="lg:py-20 md:pb-10 ">
      <SSWBadge title={data?.badge} link={data?.badgeLink} />
      <TitleFadeIn title={data?.title} />
      <div className="text-white p-6 mx-auto max-w-7xl">
        {/* Container */}
        <div className=" grid gap-4">
          {/* Row 1 (Single row, 2 columns) */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4  relative">
            {/* Left box with glowing effect */}
            <div className="relative md:col-span-2 col-span-1 rounded-xl md:h-80 lg:h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-gray-400 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
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
                  <h2 className="text-white md:text-2xl lg:text-4xl font-semibold">
                    {topLeftBox.title}
                  </h2>
                </div>
                <div className="md:mt-12 mt-4 flex items-center flex-row justify-center gap-4 md:gap-6">
                  {topLeftBox.icons.map((icon: string) => (
                    <IconBox icon={icon} key={icon} />
                  ))}
                </div>
              </div>
            </div>
            {/* Right box with glowing effect */}
            <div className="relative col-span-1 rounded-xl h-80 md:h-80 lg:h-72 overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-gray-400 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div
                className={`${YakShaverGray} relative rounded-xl w-full h-full`}
              >
                <div className="p-6 pb-0 md:pb-6">
                  <h2 className="text-white text-2xl font-semibold">
                    {topRightBox.title}
                  </h2>
                  <p className="text-[#797979] text-xs">
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
      </div>
    </div>
  );
}
