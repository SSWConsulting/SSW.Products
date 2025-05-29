import { Template } from "tinacms";
import { actionsButtonTemplate } from "./ActionsButton.template";

export const CalculatorTemplate: Template = {
  name: "calculator",
  label: "Calculator",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "desc",
      label: "Description",
      type: "string",
    },
    {
      name: "tiers",
      label: "Pricing Tiers",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: { tier?: string }) => ({
          label: item?.tier || "Empty Tier",
        }),
      },
      fields: [
        { name: "tier", label: "Tier", type: "string" },
        
        {
          name: "description",
          label: "Description",
          type: "string",
          list: true,
        },
        
        {
          name: "price",
          label: "Price",
          type: "number",
          description: 'If the price === 99999 it will be displayed as "Custom"',
          ui: {
            validate: (value) => {
              if (value < 0) {
                return "Price must be greater than 0";
              }
            },
          },
        },
        {
          name: 'estimatedHoursSaved',
          label: 'Estimated Hours Saved',
          type: 'number',
          description: 'This value doesnt matter for enterprise'
        },
        {
          name: 'itemsAbleToCreate',
          label: 'Work Items Able To Create',
          type: 'number',
          description: 'This value doesnt matter for enterprise'
        },
        {
          name: "priceDescription",
          label: "Price Description",
          type: "string",
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
            
          ],
        },
      ],
    },
    {
      name: "addOns",
      label: "Add Ons Section",
      type: "object",
      fields: [
        { name: "title", label: "Title", type: "string" },
        { name: "description", label: "Description", type: "string" },
        
        { name: "price", label: "Price", type: "string" },
        {
          name: "subPriceText",
          label: "Sub-text next to price",
          type: "string",
        },
        {
          name: "actionButton",
          label: "Action Button",
          type: "object",
          fields: [...actionsButtonTemplate.fields],
        },
      ],
    },
    {
      name: "bottomBox",
      label: "Bottom Box Text",
      type: "rich-text",
    },
    {
      name: "bottomAction",
      label: "Bottom Action",
      type: "object",
      list: false,
      ui: {
        itemProps: (item: { label?: string }) => ({
          label: item?.label || "Action Item",
        }),
      },
      fields: [
        ...actionsButtonTemplate.fields,
        
      ],
    },
  ],
};
