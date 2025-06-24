"use client";

import { FormattedDate } from "@/formattedDate";
import { formatDate } from "@utils/formatDate";
import { useMemo, useRef } from "react";

export const useFormattedDate = ({
  initialFormattedDate,
  dynamicDate,
}: FormattedDate) => {
  const initialDate = useRef(dynamicDate);
  const date = useMemo(() => {
    if (dynamicDate === initialDate.current) {
      return initialFormattedDate;
    }
    return formatDate(dynamicDate);
  }, [dynamicDate, initialFormattedDate]);

  return { date };
};
