import { Clock } from "lucide-react";

type ReadingTimeProps = {
  readingTime: string;
  inline?: boolean;
};

export function ReadingTime({ readingTime, inline = false }: ReadingTimeProps) {
  if (inline) {
    return <span>{readingTime}</span>;
  }

  return (
    <div className="flex items-center text-sm text-gray-400">
      <Clock className="mr-1.5 h-4 w-4" />
      <span>{readingTime}</span>
    </div>
  );
}
