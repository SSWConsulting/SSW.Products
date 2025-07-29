export function GradientBackground() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      {/*Webkit Transform fixes for IOS*/}
      <div
        className="absolute w-full h-200 -left-[66%] blur-[150px] opacity-59 rounded-full top-[12%] sm:top-[30%] z-[-1] mx-auto"
        style={{
          WebkitTransform: "translate3d(0, 0, 0);",
          background:
            "linear-gradient(to bottom right, #FF9D3F 0%, #F46772 40%, #AF33E4 69%, black 100%)", //in-line style is the best way to get control of a 40 stop gradient
        }}
      />
    </div>
  );
}
