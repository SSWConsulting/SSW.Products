import { Template } from "tinacms";
import { actionsButtonTemplate } from "./ActionsButton.template";
import { modalButtonTemplate } from "./ModalButton.template";
import { optimizedYoutubeFields } from "./VideoDisplay.template";

interface FeatureItem {
  headline?: string;
  text?: string;
  buttons?: Array<{ label: string; url: string }>;
  media?: Array<{ image?: string; src?: string }>;
  isReversed?: boolean;
}

export const FeaturesTemplate: Template = {
  label: "Features",
  name: "features",
  fields: [
    {
      name: "featureItem",
      label: "Feature",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: FeatureItem) => {
          return {
            label: item?.headline,
          };
        },
        defaultItem: () => {
          return {
            headline: "Another awesome feature",
            text: "How cool is this feature",
          };
        },
      },
      fields: [
        {
          name: "headline",
          label: "Headline Text Before Rotate Animation",
          type: "string" as const,
          required: true,
        },
        {
          name: "words",
          label: "Words for Rotate Animation",
          type: "string",
          list: true,
          required: false,
        },
        {
          name: "headlineAfter",
          label: "Headline Text After Rotate Animation",
          type: "string" as const,
          required: false,
        },
        {
          name: "text",
          label: "Text",
          type: "rich-text" as const,
          required: true,
        },
        {
          name: "buttons",
          label: "Buttons",
          list: true,
          type: "object",
          templates: [actionsButtonTemplate, modalButtonTemplate],
        },
        {
          name: "media",
          label: "Media",
          type: "object",
          list: true,
          ui: {
            min: 0,
            max: 1,
          },
          templates: [
            {
              name: "image",
              label: "Image",
              fields: [{ name: "image", label: "Image", type: "image" }],
            },
            {
              name: "externalVideo",
              label: "External Video",
              fields: [...optimizedYoutubeFields],
            },
            {
              name: "thumbnailToExternalLink",
              label: "Thumbnail to External Link",
              fields: [
                {
                  name: "image",
                  label: "Image",
                  type: "image",
                },
                {
                  name: "src",
                  label: "URL",
                  type: "string",
                  description:
                    "This is used to display an image that links to an external URL.",
                },
              ],
            },
          ],
        },
        {
          name: "isReversed",
          label: "Is Text on the Right?",
          type: "boolean",
          ui: {
            component: "toggle",
            parse: (value: unknown) => !!value,
            format: (value: unknown) => !!value,
          },
          description:
            "When toggled, the media and text content will be swapped.",
        },
      ],
    },
  ],
};
