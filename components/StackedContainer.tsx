type StackedContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const StackedContainer = ({ children }: StackedContainerProps) => {
  return (
    <div className="w-full z-0 h-fit relative">
      <div className=" text-white z-20 border-2 border-gray-lighter/40 relative w-full py-12 bg-gray-dark mx-auto rounded-3xl px-8">
        {children}
      </div>
      <div className="absolute bg-gray-dark/75 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4"></div>
    </div>
  );
};

export default StackedContainer;
