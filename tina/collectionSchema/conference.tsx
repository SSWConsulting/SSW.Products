import { Collection, TinaField } from "tinacms";
import { seoInformation } from "../shared/SEOInformation";

const iconOptions = ["FaRegStar", "IoMdBook", "GoPeople"];

export const conferenceCollection: Collection = {
  label: "Conference",
  name: "conference",
  path: "content/conference/",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      const breadcrumbs = document?._sys.breadcrumbs;
      if (breadcrumbs && breadcrumbs.length > 1) {
        return `/${breadcrumbs[0]}/conference`;
      }
      return "/conference";
    },
  },
  fields: [
    seoInformation as TinaField,
    {
      type: "object",
      name: "banner",
      label: "Banner",
      fields: [
        {
          type: "string",
          name: "bannerTitle",
          label: "Banner Title",
        },
        {
          type: "string",
          name: "bannerTagline",
          label: "Banner Tagline",
        },
        {
          type: "string",
          name: "bannerDescription",
          label: "Banner Description",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "date",
          label: "Date",
        },
        {
          type: "string",
          name: "time",
          label: "Time",
        },
        {
          type: "string",
          name: "location",
          label: "Location",
        },
        {
          type: "string",
          name: "locationLink",
          label: "Location Link",
        },
        {
          type: "object",
          name: "actionButton",
          label: "Left Button",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
            },
            {
              type: "string",
              name: "link",
              label: "Link",
            },
          ],
        },
        {
          type: "object",
          name: "rightButton",
          label: "Right Button",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
            },
            {
              type: "string",
              name: "link",
              label: "Link",
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "about",
      label: "About",
      fields: [
        {
          type: "string",
          name: "heading",
          label: "Heading",
        },
        {
          type: "rich-text",
          name: "description",
          label: "Description",
        },
        {
          type: "object",
          name: "keyHighlights",
          label: "Key Highlights",
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item.header,
            }),
          },
          fields: [
            {
              type: "string",
              name: "header",
              label: "Header",
            },
            {
              type: "string",
              name: "description",
              label: "Description",
              ui: {
                component: "textarea",
              },
            },
            {
              type: "string",
              name: "icon",
              label: "Icon",
              options: iconOptions,
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "speakers",
      label: "Speakers",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item.name,
        }),
      },
      fields: [
        {
          type: "string",
          name: "name",
          label: "Name",
        },
        {
          type: "string",
          name: "position",
          label: "Position",
        },
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "socialLink",
          label: "Primary Social Link",
        },
      ],
    },
    {
      type: "object",
      name: "speakerSchedule",
      label: "Speaker Schedule",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: `${item.talkSpeakerName ? `${item.talkSpeakerName} - ` : ""}${
            item.speechTitle ?? ""
          }`,
        }),
        defaultItem: {
          sessionType: "Talk",
        },
      },
      fields: [
        {
          type: "string",
          name: "speechTitle",
          label: "Speech Title",
        },
        {
          type: "string",
          name: "speechDescription",
          label: "Speech Description",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "talkSpeakerName",
          label: "Talk Speaker Name",
        },
        {
          type: "image",
          name: "talkSpeakerImage",
          label: "Talk Speaker Image",
        },
        {
          type: "number",
          name: "talkTimeStart",
          label: "Talk Time Start",
          description: "Enter in 24 hour format, e.g. 9.5 for 9:30 AM",
        },
        {
          type: "number",
          name: "talkTimeEnd",
          label: "Talk Time End",
          description: "Enter in 24 hour format, e.g. 13 for 1:00 PM",
        },
        {
          type: "string",
          name: "sessionType",
          label: "Session Type",
          options: ["Talk", "Workshop", "Break"],
          required: true,
        },
      ],
    },
  ],
};
