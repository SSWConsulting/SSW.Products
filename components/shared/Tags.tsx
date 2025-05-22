import Link from "next/link"

interface TagsProps {
  tags: string[]
}

export function Tags({ tags }: TagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
          className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
