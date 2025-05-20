import { Clock } from "lucide-react";

interface ReadingTimeProps {
  minutes: number;
  inline?: boolean;
}

export function ReadingTime({ minutes, inline = false }: ReadingTimeProps) {
  if (inline) {
    return <span>{minutes} min read</span>;
  }

  return (
    <div className="flex items-center text-sm text-gray-400">
      <Clock className="mr-1.5 h-4 w-4" />
      <span>{minutes} min read</span>
    </div>
  );
}
