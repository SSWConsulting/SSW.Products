import { cn } from "@/lib/utils";

// The one category style on the blog: cards, the featured card and the post
// header. red-400 rather than SSW red, which is only ~3.3:1 as small text on
// our dark backgrounds (red-400 is 5.5:1)
const CategoryLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "block w-fit text-xs font-semibold uppercase tracking-wider text-red-400",
        className
      )}
    >
      {children}
    </span>
  );
};

export default CategoryLabel;
