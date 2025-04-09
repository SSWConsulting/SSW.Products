"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import "./InteractiveBackground.scss";

const InteractiveBackground = () => {
  const backgroundBubblesRef = useRef<HTMLDivElement[]>([]);
  return (
    <div className={cn("gradient-bg")}>
      <div className="gradients-container">
        <div
          className="g1"
          ref={(el) => {
            if (el) backgroundBubblesRef.current.push(el);
          }}
        ></div>
        <div
          className="g2"
          ref={(el) => {
            if (el) backgroundBubblesRef.current.push(el);
          }}
        ></div>
        <div
          className="g3"
          ref={(el) => {
            if (el) backgroundBubblesRef.current.push(el);
          }}
        ></div>
        <div
          className="g4"
          ref={(el) => {
            if (el) backgroundBubblesRef.current.push(el);
          }}
        ></div>
        <div
          className="g5"
          ref={(el) => {
            if (el) backgroundBubblesRef.current.push(el);
          }}
        ></div>
      </div>
    </div>
  );
};

export default InteractiveBackground;
