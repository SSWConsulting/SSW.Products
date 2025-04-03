import { Template } from "tinacms";

export const ComparisonTable: Template = {
  name: "comparisonTable",
  label: "Comparison Table",
  fields: [
    { name: "headline", label: "Headline", type: "string" },
    {
      name: "sectionDescription",
      label: "Section Description",
      type: "string",
    },
    {
      name: "table",
      label: "table",
      type: "object",
      list: true,
      fields: [
        { name: "title", label: "Title", type: "string" },
        { name: "footerText", label: "Footer Text", type: "string" },
        {
          name: "rows",
          label: "Rows",
          type: "object",
          list: true,
          fields: [
            { name: "column1", label: "Column 1", type: "string" },
            {
              name: "column1SubText",
              label: "Column 1 Sub Text",
              type: "string",
            },
            { name: "column2", label: "Column 2", type: "string" },
            {
              name: "column2SubText",
              label: "Column 2 Sub Text",
              type: "string",
            },
            { name: "column3", label: "Column 3", type: "string" },
            {
              name: "column3SubText",
              label: "Column 3 Sub Text",
              type: "string",
            },
            { name: "column4", label: "Column 4", type: "string" },
            {
              name: "column4SubText",
              label: "Column 4 Sub Text",
              type: "string",
            },
            { name: "column5", label: "Column 5", type: "string" },
            {
              name: "column5SubText",
              label: "Column 5 Sub Text",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
};
