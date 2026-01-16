"use client";

import { cn } from "@/lib/utils";
import { inputClasses } from "../../../tina/collectionSchema/pages";

import { useTina } from "tinacms/dist/react";
import client from "../../../tina/__generated__/client";

type TinaData = Awaited<ReturnType<typeof client.queries.pages>>;

type CustomizeableBackgroundProps = {
  tinaData: TinaData;
};

const CustomizeableBackground = ({
  tinaData,
}: CustomizeableBackgroundProps) => {
  const data = useTina({
    data: tinaData.data,
    query: tinaData.query,
    variables: tinaData.variables,
  });
  return (
    <div
      className={cn(
        inputClasses[
          data?.data?.pages?.pageFormatting?.backgroundColor || "gray"
        ],
        "absolute inset-0 -z-50"
      )}
    >
    </div>
  );
};
export default CustomizeableBackground;
