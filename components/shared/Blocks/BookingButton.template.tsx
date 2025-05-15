import { Template } from "tinacms";

export const jotFormBookingButtonSchema: Template = {
  name: "BookingButton",
  label: "JotForm Booking Button",
  ui: {
    defaultItem: () => {
      return {
        Title: "DEFAULT BUTTON",
        JotFormId: "DEFAULT-LINK",
      };
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "Title",
    },
    {
      name: "JotFormId",
      label: "JotFormId",
      type: "string",
    },
    {
      name: "variants",
      label: "Variant",
      type: "string" as const,
      options: [
        { value: "solidRed", label: "Solid Red" },
        { value: "solidWhite", label: "Solid White" },
        { value: "outlinedWhite", label: "Outlined White" },
      ],
    },
  ],
};
