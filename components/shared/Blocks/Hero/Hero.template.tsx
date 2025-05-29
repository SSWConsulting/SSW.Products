import { Template } from "tinacms";

export const HeroTemplate: Template = {
  label: "Hero",
  name: "hero",
  fields: [
    {
      name: "backgroundImageEnabled",
      label: "Background Image Enabled",
      type: "boolean",
    },
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
      name: "byLine",
      label: "By Line",
      description: "use bolding to make the text red",
      type: "rich-text",
    },
    // Placeholder for the buttons
    {
      name: "ctaLeft",
      label: "<LEFT> CTA button",
      type: "object",
      fields: [
        { name: "title", label: "Title", type: "string" },
        { name: "link", label: "Link", type: "string" },
      ],
    },
    {
      name: "ctaRight",
      label: "<RIGHT> CTA button",
      type: "object",
      fields: [
        { name: "title", label: "Title", type: "string" },
        { name: "link", label: "Link", type: "string" },
      ],
    },
    {
      name: "buttonSubtext",
      label: "Button Subtext",
      type: "string",
    },
    {
      name: "reportUIEnabled",
      label: "Report UI Enabled",
      type: "boolean",
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
              name: "issueReportName",
              label: "<LHS> Issue Report Name",
              type: "string",
            },
            {
              name: "issueReportTime",
              label: "<LHS> Issue Report Time",
              type: "string",
            },
            {
              name: "issueReportText",
              label: "<LHS> Issue Report Transcript",
              type: "string",
              list: true,
            },
            {
              name: "issueReportSummaryTitle",
              label: "<LHS> Issue Report Summary Title",
              type: "string",
            },
            {
              name: "issueReportSummarySubtitle",
              label: "<LHS> Issue Report Summary Subtitle",
              type: "string",
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
          ],
        },
      ],
    },
  ],
};
