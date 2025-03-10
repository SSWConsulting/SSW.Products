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
    <div className="lg:pt-30 md:pt-10 mx-auto w-full">
      {/* <Hero/> */}
      <BlocksRenderer
        data={{ pageBlocks: tinaData.data.pages.pageBlocks ?? null }}
      />
    </div>
  );
}
