'use client';

import Image from "next/image";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useEffect, useState } from "react";

const YakShaverGray = "bg-[#131313] shadow-2xl";

export default function YaksShavedCounterBox() {
    const [yaksShaved, setYaksShaved] = useState(0);
    useEffect(() => {
      fetch("/api/leaderboard") 
        .then((res) => res.json())
        .then((data) => {
          setYaksShaved(data.totalShaves);
        })
        .catch((error) =>
          console.error("Error fetching leaderboard counts:", error)
        );
    }, []);
    return (
      <div
        className={`${YakShaverGray} h-24 md:h-28 rounded-xl px-6 md:px-5 flex flex-col justify-center items-start md:items-start`}
      >
        <div className="flex flex-row gap-2 md:text-lg text-md  text-gray-200">
          <Image src={"/svg/yak-icon.svg"} alt="yak" width={20} height={20} />
          Yaks Shaved
        </div>
        <div className="text-3xl md:text-4xl font-semibold pt-2">
          <NumberTicker value={yaksShaved} className="text-white" />
        </div>
      </div>
    );
  }