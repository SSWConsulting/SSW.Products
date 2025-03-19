import Link from "next/link";

const TimelineItem = ({ data, last = false }: { data: any; last: boolean }) => {
  return (
    <div className="px-6 flex items-stretch w-full gap-8">
      <div className="flex-0 flex flex-col items-center">
        <div className="flex-shrink-0 w-[2px] h-12 bg-gradient-to-t from-red-700 to-red-400"></div>
        <div className="flex-shrink-0 relative w-4 h-4 rounded-full border-2 border-red-700">
          <div className="h-[2px] w-6 absolute top-1/2 left-full -translate-y-1/2 bg-gradient-to-r from-red-700 to-red-400"></div>
        </div>
        {!last && (
          <div className="w-[2px] h-full bg-gradient-to-b from-red-700 to-red-400"></div>
        )}
        {last && (
          <div className="w-[2px] h-2/3 bg-gradient-to-b from-red-600 via-red-500/30 to-red-400/0"></div>
        )}
      </div>
      <div className="flex-1 pt-10 pb-4 flex flex-col items-start gap-4">
        {data.title && (
          <h3 className="text-2xl lg:text-3xl lg:leading-tight text-white font-semibold">
            {data.title}
          </h3>
        )}
        {data.description && (
          <p className="text-muted-foreground text-lg text-gray-200">{data.description}</p>
        )}
            {data.badgeTitle && (
              data.badgeLink ? (
                <Link href={data.badgeLink} className="rounded-full w-auto flex justify-center text-center items-center whitespace-nowrap text-red-800 px-4 py-2 text-xs font-medium border border-red-100 bg-gradient-to-br from-white to-red-50 shadow-2xl">
                  {data.badgeTitle}
                </Link>
              ) : (
                <span className="rounded-full w-auto flex justify-center text-center items-center whitespace-nowrap text-red-800 px-4 py-2 text-xs font-medium border border-red-100 bg-gradient-to-br from-white to-red-50 shadow-2xl">
                  {data.badgeTitle}
                </span>
              )
            )}
      </div>
    </div>
  );
};

export function Timeline({ data }: { data: any }) {
  return (
    <section className="w-full flex flex-col gap-4 md:px-48 px-8 -mt-20 max-w-7xl mx-auto pb-40 md:pt-20">
      <h3 className="inline-block text-3xl lg:text-4xl lg:leading-tight text-white font-bold mb-4">
        {data.title}
      </h3>
      <div>
        {data.items &&
          data.items.map((itemData: any, index: number) => {
            const last = data.items.length - 1 === index;
            return <TimelineItem key={index} data={itemData} last={last} />;
          })}
      </div>
    </section>
  );
}
