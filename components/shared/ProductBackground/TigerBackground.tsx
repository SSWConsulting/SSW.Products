import Image from "next/image";

export function TigerBackground() {
  return (
    <div
      className="absolute inset-x-0 top-0 h-[180vh] -z-10 pointer-events-none overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
      }}
    >
      <Image
        src="/Tiger/tiger-background.jpg"
        alt=""
        fill
        priority
        className="object-cover object-top"
      />
    </div>
  );
}
