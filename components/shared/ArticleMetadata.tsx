import { cn } from "@/lib/utils";
import { formatDate } from "@utils/formatDate";
import { Calendar, Clock } from "lucide-react";

const ArticleMetadata = ({
  date,
  readLength,
  className,
}: {
  date?: string | null;
  readLength?: string | null;
  className?: string;
}) => {
  // Leave out a missing value along with its icon and separator (#840)
  if (!date && !readLength) return null;
  return (
    <div className={cn("flex items-center gap-2 text-gray-400", className)}>
      {date && (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(date)}</span>
        </div>
      )}
      {date && readLength && <span>•</span>}
      {readLength && (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readLength}</span>
        </div>
      )}
    </div>
  );
};

export default ArticleMetadata;
