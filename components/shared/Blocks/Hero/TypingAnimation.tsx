import React from "react";

export function TypingAnimation() {
  return (
    <span className="inline-block">
      <svg
        width="60"
        height="12"
        viewBox="0 0 60 12"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block"
      >
        {/* First dot */}
        <circle cx="15" cy="6" r="4" fill="#CC4141">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="cy"
            values="6;4;6"
            dur="1s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>

        {/* Second dot */}
        <circle cx="30" cy="6" r="4" fill="#CC4141">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1s"
            repeatCount="indefinite"
            begin="0.2s"
          />
          <animate
            attributeName="cy"
            values="6;4;6"
            dur="1s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </circle>

        {/* Third dot */}
        <circle cx="45" cy="6" r="4" fill="#CC4141">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1s"
            repeatCount="indefinite"
            begin="0.4s"
          />
          <animate
            attributeName="cy"
            values="6;4;6"
            dur="1s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </circle>
      </svg>
    </span>
  );
}
