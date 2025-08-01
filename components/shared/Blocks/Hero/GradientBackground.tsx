export function GradientBackground({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="2074"
      height="1585"
      viewBox="0 0 2074 1585"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1844_3507)">
        <path
          d="M1714 792.5C1714 1031.36 1326.39 1225 848.247 1225C370.104 1225 340 1031.36 340 792.5C340 553.637 370.104 360 848.247 360C1326.39 360 1714 553.637 1714 792.5Z"
          fill="url(#paint0_linear_1844_3507)"
        />
        <path
          d="M1714 792.5C1714 1031.36 1326.39 1225 848.247 1225C370.104 1225 340 1031.36 340 792.5C340 553.637 370.104 360 848.247 360C1326.39 360 1714 553.637 1714 792.5Z"
          fill="black"
          fill-opacity="0.4"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1844_3507"
          x="-20"
          y="0"
          width="2094"
          height="1585"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="180"
            result="effect1_foregroundBlur_1844_3507"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1844_3507"
          x1="-17.5067"
          y1="362.248"
          x2="1529.13"
          y2="1492.28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF9D3F" />
          <stop offset="0.403862" stop-color="#F46772" />
          <stop offset="0.692179" stop-color="#AF33E4" />
          <stop offset="1" stop-color="#080808" />
        </linearGradient>
      </defs>
    </svg>
  );
}
