import Image from "next/image";

export function TigerBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
      }}
    >
      <Image
        src="/Tiger/tiger-background.jpg"
        alt=""
        fill
        priority
        className="object-cover object-left-top"
      />
    </div>
  );
}
