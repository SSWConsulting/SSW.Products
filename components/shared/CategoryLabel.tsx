const CategoryLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-ssw-charcoal drop-shadow-xs z-10 w-fit text-white px-3 py-1 rounded-full",
        className
      )}
    >
      {children}
    </div>
  );
};
