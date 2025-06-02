import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ReadMore = ({
  fileName,
  groupHover,
}: {
  fileName: string;
  groupHover?: boolean;
}) => {
  return (
    <Link
      href={`/blog/${fileName}`}
      className={cn(
        "text-ssw-red w-fit bottom-0 transition-colors hover:text-white mt-auto inline-flex items-center gap-1",
        groupHover ? "group-hover:text-white" : "hover:text-white"
      )}
    >
      Read More <ArrowRight className="h-4 w-4" />
    </Link>
  );
};

export default ReadMore;
