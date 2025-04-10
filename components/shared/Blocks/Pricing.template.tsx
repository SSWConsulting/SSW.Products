import { Template } from "tinacms";
import { actionsButtonTemplate } from "./ActionsButton.template";
import { jotFormBookingButtonSchema } from "./BookingButtom.template";

interface PlanItem {
  planTier?: string;
  planDescription?: string;
  price?: string;
  subPriceText?: string;
  isRecommended?: boolean;
  actions?: {
    label?: string;
  };
}

export const pricingTemplate: Template = {
  label: "Pricing",
  name: "pricing",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string" as const,
    },
    {
      name: "description",
      label: "Description",
      type: "rich-text",
    },
    {
      name: "plans",
      label: "Plans",
      type: "object",
      list: true as const,
      ui: {
        itemProps: (item: PlanItem) => ({
          label: item?.planTier || "Plan Item",
        }),
        defaultItem: () => ({
          planTier: "Default Plan Tier",
          planDescription: "Default Plan Description",
          price: "Default Price",
          subPriceText: "Default Sub Price Text",
          isRecommended: false,
          actions: {
            label: "Default Action Label",
          },
        }),
      },
      fields: [
        {
          name: "planTier",
          label: "Plan Tier Name",
          type: "string",
        },
        {
          name: "planDescription",
          label: "Plan Description",
          type: "string",
        },
        {
          name: "price",
          label: "Price",
          type: "string",
        },
        {
          name: "subPriceText",
          label: "Sub-text next to price",
          type: "string",
        },
        {
          name: "priceDescription",
          label: "Price Description",
          type: "string",
        },
        {
          name: "timeSaved",
          label: "Time Saved",
          type: "string",
        },
        {
          name: "isRecommended",
          label: "Is this tier recommended?",
          type: "boolean",
        },
        {
          name: "listTitle",
          label: "List Title",
          type: "string",
        },
        {
          name: "listItems",
          label: "List Items",
          type: "string",
          list: true,
        },

        {
          name: "actions",
          label: "Actions",
          type: "object",
          list: false,
          ui: {
            itemProps: (item: { label?: string }) => ({
              label: item?.label || "Action Item",
            }),
          },
          fields: [
            ...actionsButtonTemplate.fields,
            ...jotFormBookingButtonSchema.fields,
          ],
        },
      ],
    },
    {
      name: 'addOns',
      label: 'Add Ons Section',
      type: 'object',
      fields: [
        {name: 'title', label: 'Title', type: 'string'},
        {name: 'description', label: 'Description', type: 'string'},
        {name: 'price', label: 'Price', type: 'string'},
        {name: 'subPriceText', label: 'Sub-text next to price', type: 'string'},
        {
          name: "actionButton",
          label: "Action Button",
          type: "object",
          fields: [...actionsButtonTemplate.fields],
        },
      ]
    },
    
  ],
};
