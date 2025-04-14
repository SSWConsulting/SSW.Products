/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useTina } from "tinacms/dist/react";
import { blocksRenderer as BlocksRenderer } from "./blocksRenderer";

interface HomePageClientProps {
  query: any;
  data: any;
  variables: any;
}

export default function HomePageClient({
  query,
  data,
  variables,
}: HomePageClientProps) {
  const tinaData = useTina({
    query,
    variables,
    data,
  });

  return (
    <div className="flex pt-navBarHeight flex-col gap-14 lg:gap-24 mx-auto w-full min-h-[95vh]">
      <BlocksRenderer
        data={{ pageBlocks: tinaData.data.pages.pageBlocks ?? null }}
      />
    </div>
  );
}
