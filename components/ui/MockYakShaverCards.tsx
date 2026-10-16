"use client";

import { cn } from "@/lib/utils";
import { TypingAnimation } from "../shared/Blocks/Hero/TypingAnimation";

export function ExampleYakShaverCard() {
  return (
    <div className="bg-[#1E1E20] border-2  text-xs border-[#4D4D4E] shadow-2xl rounded-xl p-4  text-white ">
      <p className="font-semibold pb-2 px lg:whitespace-nowrap whitespace-nowrap md:whitespace-normal">
        {" "}
        ✅ Done - ✨ A Work Item has been created by YakShaver.ai 🐂
      </p>
      <p className="pb-1">Project</p>

      <span className="h-[24px] items-center text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]">
        tina.io
      </span>

      <p className="pb-1">Work Item #2818</p>
      <span className="items-center  h-[24px] text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F] whitespace-nowrap overflow-hidden text-ellipsis">
        🐛 Fix event display issue on tina.io homepage
      </span>
      <p className="pb-1">Assigned to</p>
      <span className="items-center  h-[24px] text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]">
        Betty Bondoc
      </span>
      <p className="pb-1">Mentioned Users</p>
      <span className="items-center h-[24px] text-xs font-normal  mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]">
        Adam Cogan, Matt Wicks
      </span>
    </div>
  );
}

export function HeroYakShaverCard({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "bg-linear-to-r to-[#1f1f1f] via-[#1e1e1e] from-[#292929]  p-3 border-2  text-xs border-[#4D4D4E]/30 shadow-2xl rounded-2xl text-white w-full h-82.5 [&>div>span]:animate-in [&>p]:duration-500 [&>div>span]:duration-1000 [&>div>span]:fade-in [&_p]:text-white/75 [&_p]:pb-1",
        isVisible
          ? "[&>div>span]:opacity-100 [&>p]:opacity-100"
          : " [&>div>span]:opacity-0 [&>div]:animate-pulse [&>p]:opacity-0"
      )}
    >
      <div className="pb-2 text-sm md:text-base lg:text-lg font-semibold relative h-[2.5em]">
        <span
          className={`absolute left-0 right-0 transition-all duration-500 ${
            isVisible ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          ⚙️ YakShaver is processing your request
          <br />
          <div className="flex justify-start mt-1">
            <TypingAnimation />
          </div>
        </span>
        <span
          className={`absolute left-0 right-0 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          ✨ A bug report has been created
        </span>
      </div>
      <p>Project</p>
      <div
        className={`h-9.25 items-center text-xs font-normal mb-2 flex  bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30`}
      >
        <span>TinaCloud</span>
      </div>

      <p>Work Item</p>
      <div
        className={`gap-2 items-center h-9.25 text-xs font-normal mb-2 flex bg-white/5  rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30 lg:whitespace-nowrap overflow-hidden text-ellipsis`}
      >
        <span className={`text-xs font-normal`}>
          🐛 App crashes when uploading file sizes &gt; 5MB on Chrome
        </span>
      </div>

      <p>Assigned to</p>
      <div
        className={`items-center  h-9.25 text-xs font-normal mb-2 flex  bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30 `}
      >
        <span>Betty Bondoc</span>
      </div>

      <p>Mentioned Users</p>
      <div
        className={`items-center  h-9.25 text-xs font-normal  mb-2 flex bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30`}
      >
        <span>Adam Cogan, Matt Wicks</span>
      </div>
    </div>
  );
}
