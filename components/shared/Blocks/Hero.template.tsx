import { Template } from "tinacms";

export const HeroTemplate: Template = {
  label: "Hero",
  name: "hero",
  fields: [
    {
      name: "titleBeforeRotate",
      label: "Title Before Rotate Animation",
      type: "string",
    },
    {
      name: "titleAfterRotate",
      label: "Title After Rotate Animation",
      type: "string",
    },
    {
      name: "rotatingWords",
      label: "Rotating Words",
      type: "string",
      list: true,
    },
    {
        name: 'test',
        label: 'Test',
        type: 'rich-text',
        templates:[
            {
                name: "MdxGradient",
                label: "Gradient Text",
                fields: [
                  {
                    name: "children",
                    label: "Text",
                    type: "string",
                  },
                ],
            },
        ]
    },
    {
      name: "byLine",
      label: "By Line",
      type: "string",
    },
    // Placeholder for the buttons
    {
      name: "buttonSubtext",
      label: "Button Subtext",
      type: "string",
    },
    {
      name: "reportUI",
      label: "Report UI",
      type: "object",
      fields: [
        {
          name: "leftHandSide",
          label: "Left Hand Side",
          type: "object",
          fields: [
            {
              name: "issueReportTitle",
              label: "<LHS> Issue Report Title",
              type: "string",
            },
            {
              name: "issueReportSubTitle",
              label: "<LHS> Issue Report Subtitle",
              type: "string",
            },
            {
              name: "issueReportByline",
              label: "<LHS> Issue Report Byline",
              type: "string",
            },
            {
              name: "issueReportTranscript",
              label: "<LHS> Issue Report Transcript",
              type: "rich-text",
            },
          ],
        },
        {
          name: "rightHandSide",
          label: "Right Hand Side",
          type: "object",
          fields: [
            {
              name: "issueReportSummaryTitle",
              label: "<RHS> Issue Report Summary Title",
              type: "string",
            },
            {
              name: "issueReportSummarySubtitle",
              label: "<RHS> Issue Report Summary Subtitle",
              type: "string",
            },
            {
              name: "issueReportBody",
              label: "<RHS> Issue Report Body",
              type: "rich-text",
            },
          ],
        },
      ],
    },
  ],
};
