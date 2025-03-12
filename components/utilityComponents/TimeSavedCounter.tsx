"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { useEffect, useState } from "react";
import { IoIosTimer } from "react-icons/io";

const YakShaverGray = "bg-[#131313] shadow-2xl";
export default function TimeSavedCounterBox() {
  const [timeSaved, setTimeSaved] = useState(0);
  useEffect(() => {
    fetch("/api/leaderboard") 
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setTimeSaved(data.totalShaves);
      })
      .catch((error) =>
        console.error("Error fetching leaderboard counts:", error)
      );
  }, []);

  return (
    <div
      className={`${YakShaverGray} h-24 md:h-28 rounded-xl px-6 md:px-5 flex flex-col justify-center items-start md:items-start`}
    >
      <div className="flex flex-row items-center gap-2 md:text-lg text-md text-gray-200">
        <IoIosTimer />
        Saving Users
      </div>
      <div className=" pt-2 flex flex-row gap-2">
        <div className="text-3xl md:text-4xl font-semibold">
          <NumberTicker value={timeSaved * 6} className="text-white" />
        </div>
        <div className="text-gray-400 text-sm place-self-end pb-1">Minutes</div>
      </div>
    </div>
  );
}
