/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { cn } from "@/lib/utils";
import { useTina } from "tinacms/dist/react";
import { bottomPaddingOptions } from "../../tina/collectionSchema/pages";
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
    <div
      className={cn(
        "flex pt-navBarHeight-mobile sm:pt-navBarHeight flex-col gap-14 lg:gap-24 mx-auto w-full min-h-[95vh] overflow-hidden",
        bottomPaddingOptions[
          tinaData?.data?.pages?.pageFormatting
            ?.bottomPadding as keyof typeof bottomPaddingOptions
        ]
      )}
    >
      <BlocksRenderer
        data={{ pageBlocks: tinaData.data.pages.pageBlocks ?? null }}
      />
    </div>
  );
}
