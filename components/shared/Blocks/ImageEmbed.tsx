import { Template } from "tinacms";
import Image from "next/image";

export function ImageEmbed({ data }: { data: any }) {
  const sizeClasses: Record<string, string> = {
    small: "max-w-sm",
    medium: "max-w-2xl",
    large: "max-w-full",
  };

  const borderClass = data.showBorder ? "border-[10px] border-transparent" : "";
  const heightClass = data.src ? "h-auto" : "h-[300px]";

  return (
    <div
      className={`bg-none mt-4 w-auto ${
        sizeClasses[data.size] || "max-w-sm"
      } ${borderClass} ${heightClass}`}
    >
      {data.src && (
        <Image
          src={data.src}
          alt={data.alt}
          width={0}
          height={0}
          sizes="100vw"
          placeholder="empty"
          className="w-full h-auto"
          unoptimized
        />
      )}
    </div>
  );
}

export const imageEmbedTemplate: Template = {
  name: "imageEmbed",
  label: "Image",
  ui: {
    defaultItem: {
      alt: "Image",
      size: "small",
      showBorder: false,
    },
  },
  fields: [
    { name: "src", label: "Src", type: "image", required: true },
    { name: "alt", label: "Alt", type: "string" },
    {
      name: "size",
      label: "Size",
      type: "string",
      required: true,
      options: [
        {
          value: "small",
          label: "Small",
        },
        {
          value: "medium",
          label: "Medium",
        },
        {
          value: "large",
          label: "Large",
        },
      ],
    },
    {
      name: "showBorder",
      label: "Show Border?",
      type: "boolean",
    },
  ],
};

export const imageEmbedComponent = {
  imageEmbed: (props: any) => <ImageEmbed data={props} />,
};
