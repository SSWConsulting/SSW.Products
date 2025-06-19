import TableOfContents from "./[slug]/TableOfContents";

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    product: string;
  };
}) => {
  return (
    <>
      <div className="grid grid-cols-1 h-full md:grid-cols-[1.25fr_3fr] lg:grid-cols-[1fr_3fr] max-w-360 mx-auto">
        {/* LEFT COLUMN 1/3 */}
        <div className=" max-h-[calc(100vh-13rem)] mt-20 hidden md:block py-8 bg-gray-darkest max-w-[calc(100%_-_2rem)]  max-w-offset-container-16 mb-8 rounded-lg left-4 top-44 text-white self-start px-6  overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-ssw-charcoal)_transparent] sticky">
          <TableOfContents product={params.product} />
        </div>

        {/* RIGHT COLUMN 2/3 */}
        <div className="grow px-4 sm:pt-20 ">{children}</div>
      </div>
    </>
  );
};
export default RootLayout;
