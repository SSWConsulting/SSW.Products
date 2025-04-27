const PurpleSunBackground = () => {
  return (
    <div className="absolute -top-52 sm:-top-32 -bottom-80 -inset-x-96 -z-10  opacity-75 overflow-hidden">
      <svg
        preserveAspectRatio="none"
        className="w-full h-full relative"
        width="1575"
        height="1233"
        viewBox="0 0 1575 1233"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.64">
          <g filter="url(#filter0_f_1933_2463)">
            <path
              d="M1215 607.107C1215 785.709 1069.17 920.773 787.312 920.773C543.286 927.865 367.991 767.117 360 630.683C360 452.081 467.374 281.092 787.312 274C1207.87 274 1215 483.918 1215 607.107Z"
              fill="url(#paint0_linear_1933_2463)"
            />
            <path
              d="M1215 607.107C1215 785.709 1069.17 920.773 787.312 920.773C543.286 927.865 367.991 767.117 360 630.683C360 452.081 467.374 281.092 787.312 274C1207.87 274 1215 483.918 1215 607.107Z"
              fill="black"
              fill-opacity="0.1"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_1933_2463"
            x="0"
            y="-86"
            width="1575"
            height="1367"
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
              result="effect1_foregroundBlur_1933_2463"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1933_2463"
            x1="25.8334"
            y1="275.681"
            x2="1225.91"
            y2="1307.11"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF9D3F" />
            <stop offset="0.403862" stop-color="#F46772" />
            <stop offset="0.692179" stop-color="#AF33E4" />
            <stop offset="1" stop-color="#080808" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
export default PurpleSunBackground;
