import { Blogs } from "@tina/__generated__/types";

type Tags = Blogs["labels"];

type TagsProps = {
  tags: string[];
  "data-tina-field"?: string;
};

export function Tags({ tags, ...props }: TagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          data-tina-field={props["data-tina-field"]}
          key={tag}
          className="rounded-full bg-gray-800 px-3 py-1 text-sm text-white transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
