import { TypingAnimation } from "@/components/magicui/typing-animation";

export function ExampleYakShaverCard() {
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

export function HeroYakShaverCard() {
  return (
    <div className="bg-gradient-to-r to-[#1f1f1f] via-[#1e1e1e] from-[#292929]  p-3 border-2  text-xs border-[#4D4D4E]/30 shadow-2xl rounded-2xl text-white w-full h-[320px]">
      <h2 className=" pb-2 text-sm md:text-base lg:text-lg lg:whitespace-nowrap whitespace-nowrap md:whitespace-normal">
        {" "}
        ✅ Done - ✨ A bug report has been created
      </h2>
      <h3 className="pb-1 text-white/75">Project</h3>
      <div className="h-[2.3125rem] items-center text-xs font-normal mb-2 flex  bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30">
        <span className=" opacity-0 animate-[fadeIn_1000ms_ease_7000ms_forwards]">
          TinaCloud
        </span>
      </div>

      <h3 className="pb-1 text-white/75">Work Item</h3>
      <div className="gap-2 items-center md:h-[2.3125rem] text-xs font-normal mb-2 flex bg-white/5  rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30 lg:whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="text-xs font-normal opacity-0 animate-[fadeIn_1000ms_ease_7000ms_forwards]">
          🐛 App crashes when uploading file sizes 5MB+ on Chrome
        </span>
      </div>

      <h3 className="pb-1 text-white/75">Assigned to</h3>
      <div className="items-center  h-[2.3125rem] text-xs font-normal mb-2 flex  bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30">
        <span className="opacity-0 animate-[fadeIn_1000ms_ease_7000ms_forwards]">
          Betty Bondoc
        </span>
      </div>

      <h3 className="pb-1 text-white/75">Mentioned Users</h3>
      <div className="items-center h-[2.3125rem] text-xs font-normal  mb-2 flex bg-white/5 rounded-lg px-2 py-1 border-2 border-[#4E4E4F]/30">
        <span className="opacity-0 animate-[fadeIn_1000ms_ease_7000ms_forwards]">
          Adam Cogan, Matt Wicks
        </span>
      </div>
    </div>
  );
}
