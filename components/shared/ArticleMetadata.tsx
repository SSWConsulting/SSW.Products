import { cn } from "@/lib/utils";
import { formatDate } from "@utils/formatDate";
import { Calendar, Clock } from "lucide-react";

const ArticleMetadata = ({
  date,
  formattedDate,
  readLength,
  className,
}: {
  date?: string | null;
  /** Shown as is instead of formatting `date`. */
  formattedDate?: string | null;
  readLength?: string | null;
  className?: string;
}) => {
  const shownDate = formattedDate ?? (date ? formatDate(date) : null);
  // Leave out a missing value along with its icon and separator (#840)
  if (!shownDate && !readLength) return null;
  return (
    <div className={cn("flex items-center gap-2 text-gray-400", className)}>
      {shownDate && (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{shownDate}</span>
        </div>
      )}
      {shownDate && readLength && <span>•</span>}
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
