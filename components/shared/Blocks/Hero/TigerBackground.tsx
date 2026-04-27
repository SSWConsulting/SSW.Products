import Image from "next/image";

export function TigerBackground() {
  return (
    <div className="absolute inset-x-0 top-0 h-screen -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#222222" }}
      />
      <Image
        src="/Tiger/tiger-pattern.png"
        alt=""
        fill
        priority
        className="object-cover object-top opacity-[0.26]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(0, 0, 0, 0.54) 20.26%, #222222 37.85%)",
        }}
      />
    </div>
  );
}
