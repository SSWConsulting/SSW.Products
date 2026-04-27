export function TigerBackground() {
  const mask =
    "radial-gradient(ellipse 50vw 100vh at 0% 0%, black 70%, transparent 100%)";

  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        backgroundImage: "url('/Tiger/tiger-background.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "80%",
        backgroundPosition: "-650px 0",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
