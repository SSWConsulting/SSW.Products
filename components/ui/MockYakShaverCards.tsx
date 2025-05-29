"use client";

import { cn } from "@/lib/utils";
import { TypingAnimation } from "../shared/Blocks/Hero/TypingAnimation";

export function ExampleYakShaverCard() {
  return (
    <div className="bg-[#1E1E20] border-2  text-xs border-[#4D4D4E] shadow-2xl rounded-xl p-4  text-white ">
      <h2 className=" font-semibold pb-2 px lg:whitespace-nowrap whitespace-nowrap md:whitespace-normal">
        {" "}
        ✅ Done - ✨ A Work Item has been created by YakShaver.ai 🐂
      </h2>
      <h3 className="pb-1">Project</h3>

      <span className="h-[24px] items-center text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]">
        tina.io
      </span>

      <h3 className="pb-1">Work Item #2818</h3>
      <span className="items-center  h-[24px] text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F] whitespace-nowrap overflow-hidden text-ellipsis">
        🐛 Fix event display issue on tina.io homepage
      </span>
      <h3 className="pb-1">Assigned to</h3>
      <span className="items-center  h-[24px] text-xs font-normal mb-2 flex bg-[#4E4E4F] rounded-lg px-2 py-1 border-2 border-[#4E4E4F]">
        Betty Bondoc
      </span>
      <h3 className="pb-1">Mentioned Users</h3>
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
        "bg-linear-to-r to-[#1f1f1f] via-[#1e1e1e] from-[#292929]  p-3 border-2  text-xs border-[#4D4D4E]/30 shadow-2xl rounded-2xl text-white w-full h-82.5 [&>div>span]:animate-in [&>h3]:duration-500 [&>div>span]:duration-1000 [&>div>span]:fade-in [&_h3]:text-white/75 [&_h3]:pb-1",
        isVisible
          ? "[&>div>span]:opacity-100 [&>h3]:opacity-100"
          : " [&>div>span]:opacity-0 [&>div]:animate-pulse [&>h3]:opacity-0"
      )}
    >
      <h2 className="pb-2 text-sm md:text-base lg:text-lg relative h-[2.5em]">
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
      </h2>
      <h3>Project</h3>
      <div
        className={`h-9.25 items-center text-xs font-normal mb-2 flex  bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30`}
      >
        <span>TinaCloud</span>
      </div>

      <h3>Work Item</h3>
      <div
        className={`gap-2 items-center h-9.25 text-xs font-normal mb-2 flex bg-white/5  rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30 lg:whitespace-nowrap overflow-hidden text-ellipsis`}
      >
        <span className={`text-xs font-normal`}>
          🐛 App crashes when uploading file sizes &gt; 5MB on Chrome
        </span>
      </div>

      <h3>Assigned to</h3>
      <div
        className={`items-center  h-9.25 text-xs font-normal mb-2 flex  bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30 `}
      >
        <span>Betty Bondoc</span>
      </div>

      <h3>Mentioned Users</h3>
      <div
        className={`items-center  h-9.25 text-xs font-normal  mb-2 flex bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30`}
      >
        <span>Adam Cogan, Matt Wicks</span>
      </div>
    </div>
  );
}
