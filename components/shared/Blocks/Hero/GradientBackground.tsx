export function GradientBackground() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <div
        className="absolute w-[70rem] h-[40rem] blur-[200px] rounded-full left-[-40%] top-[15%] z-[-1] mx-auto"
        style={{
          background:
            "linear-gradient(to bottom right, #FF9D3F 10%, #F46772 20%, #AF33E4 90%, black 100%)", //in-line style is the best way to get control of a 40 stop gradient
        }}
      />
    </div>
  );
}
