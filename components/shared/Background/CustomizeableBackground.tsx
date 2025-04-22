"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { inputClasses } from "../../../tina/collectionSchema/pages";

import { useTina } from "tinacms/dist/react";
import client from "../../../tina/__generated__/client";

type TinaData = Awaited<ReturnType<typeof client.queries.pages>>;

type CustomizeableBackgroundProps = {
  children: ReactNode;
  tinaData: TinaData;
};

const CustomizeableBackground = ({
  children,
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
        "relative z-0"
      )}
    >
      {children}
    </div>
  );
};
export default CustomizeableBackground;
