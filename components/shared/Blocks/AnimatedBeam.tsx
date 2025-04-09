"use client";

import React, { forwardRef, useRef, useMemo, createRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Image from "next/image";
import { FaFile, FaImage, FaVideo } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";

const icons = {
  FaVideo,
  IoChatbox,
  FaImage,
  FaFile,
};

const OutputPill = forwardRef<HTMLDivElement, { title: string }>(
  ({ title }, ref) => {
    return (
      <div className="relative inline-flex gap-2 items-center p-1 rounded-3xl top-0 transition-all duration-300 group">
        
        <div
          ref={ref}
          className="relative inline-flex gap-2 py-3 lg:py-2 justify-center items-center md:px-4 px-2 rounded-3xl bg-gradient-to-br from-[#CB4542] to-[#7A2C2A] border border-gray-400 text-xs z-30 text-black"
        >
          <Image
            src={"/svg/github-mark-white.svg"}
            alt="icon"
            width={20}
            height={20}
            
          />
          <Image
            src={"/svg/devops.svg"}
            alt="icon"
            width={20}
            height={20}
            
          />
          <div className="hidden xl:block text-white">{title}</div>
        </div>
      </div>
    );
  }
);

OutputPill.displayName = "OutputPill";

const CircleLogo = forwardRef<HTMLDivElement, { media: string }>(
  ({ media }, ref) => {
    return (
      <div className="border border-gray-300 rounded-full z-30" ref={ref}>
        <div className="md:w-20 m-1 md:h-20 h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center bg-gradient-to-tr from-white via-gray-200 to-gray-500">
          <Image
            src={media || "/svg/yak-icon-fill.svg"}
            alt="yak"
            width={50}
            height={50}
            className="flex justify-center items-center pt-1 md:pt-0"
          />
        </div>
      </div>
    );
  }
);

CircleLogo.displayName = "CircleLogo";

const InputBadge = forwardRef<HTMLDivElement, { icon: keyof typeof icons; title: string }>(
  ({ icon, title }, ref) => {
    const Icon = icons[icon as keyof typeof icons];

    return (
      <div ref={ref} className="inline-flex border border-gray-600 rounded-full z-30">
        <div className="relative inline-flex flex-row items-center gap-1 md:gap-2 lg:gap-4 lg:text-sm text-xs rounded-full bg-[#131313] p-1 pr-2 lg:pr-8 border border-gray-600 shadow-[inset_0_0_12px_rgba(156,163,175,0.25)] w-full">
          <div className="bg-[#F8F8F8] bg-opacity-10 rounded-full p-1 lg:p-2">
            {Icon && <Icon />}
          </div>
          {title}
        </div>
      </div>
    );
  }
);

InputBadge.displayName = "InputBadge";

export function AnimatedBeamMultipleOutput({ className, data }: { className?: string; data: any; }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const divRefs = useMemo(() => Array.from({ length: 6 }, () => createRef<HTMLDivElement>()), []);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-4 md:p-6",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-4 md:gap-10">
        <div className="flex flex-col justify-center gap-3">
          <InputBadge ref={divRefs[0]} title={data?.inputItem[0]?.name} icon={data?.inputItem[0]?.icon} />
          <InputBadge ref={divRefs[1]} title={data?.inputItem[1]?.name} icon={data?.inputItem[1]?.icon} />
          <InputBadge ref={divRefs[2]} title={data?.inputItem[2]?.name} icon={data?.inputItem[2]?.icon} />
          <InputBadge ref={divRefs[3]} title={data?.inputItem[3]?.name} icon={data?.inputItem[3]?.icon} />
        </div>
        <div className="flex flex-col justify-center">
          <CircleLogo ref={divRefs[4]} media={data?.middleLogo} />
        </div>
        <div className="flex flex-col justify-center">
          <OutputPill ref={divRefs[5]} title={data?.outputText} />
        </div>
      </div>

      {divRefs.slice(0, 4).map((ref, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={ref}
          toRef={divRefs[4]}
        />
      ))}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={divRefs[4]}
        toRef={divRefs[5]}
      />
    </div>
  );
}
