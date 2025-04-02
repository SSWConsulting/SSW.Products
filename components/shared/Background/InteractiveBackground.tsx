"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import "./InteractiveBackground.scss";

type FogColor = "white" | "red"

const fogColors:  Record<FogColor,string>= {
  white: "",
  red: "[--color1:128,0,0] [--color2:77,0,0] [--color3:77,0,0] [--color4:51,0,0] [--color5:128,0,0]"
}

const InteractiveBackground = ({fogColor = "white"}: {fogColor: FogColor} ) => {

  const backgroundBubblesRef = useRef<HTMLDivElement[]>([]);
  return (
    <div className={cn("gradient-bg", fogColors[fogColor])}>
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
