import React from "react";

export function AudioWaveAnimation() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Center audio bar */}
        <rect x="18" y="10" width="4" height="20" rx="2" fill="#CC4141">
          <animate
            attributeName="height"
            values="10;20;10"
            dur="1s"
            repeatCount="9"
          />
          <animate
            attributeName="y"
            values="15;10;15"
            dur="1s"
            repeatCount="7"
          />
        </rect>

        {/* Left bar */}
        <rect
          x="10"
          y="15"
          width="4"
          height="10"
          rx="2"
          fill="#CC4141"
          opacity="0.8"
        >
          <animate
            attributeName="height"
            values="5;15;5"
            dur="1.3s"
            repeatCount="6"
          />
          <animate
            attributeName="y"
            values="17.5;12.5;17.5"
            dur="1.3s"
            repeatCount="6"
          />
        </rect>

        {/* Right bar */}
        <rect
          x="26"
          y="15"
          width="4"
          height="10"
          rx="2"
          fill="#CC4141"
          opacity="0.8"
        >
          <animate
            attributeName="height"
            values="8;18;8"
            dur="0.8s"
            repeatCount="9"
          />
          <animate
            attributeName="y"
            values="16;11;16"
            dur="0.8s"
            repeatCount="9"
          />
        </rect>
      </svg>
    </div>
  );
}
