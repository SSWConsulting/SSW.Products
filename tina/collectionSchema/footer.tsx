import { Collection } from "tinacms";

const footerItemIcon = [
  "FaYouTube",
  "FaLinkedIn",
  "FaFacebook",
  "FaXTwitter",
  "FaInstagram",
  "FaTiktok",
  "FaGithub",
  "FaDiscord",
];

export const footerCollection: Collection = {
  label: "Footer",
  name: "footer",
  path: "content/footer",
  format: "json",
  fields: [
    {
      name: "footerTitle",
      label: "Footer Title",
      type: "string",
    },
    {
        name: 'footerColor',
        label: 'Footer Color',
        type: 'string',
        ui: {
            component: 'color',
        }
    },
    {
      name: "footer",
      label: "Footer",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.footerItemIcon,
          };
        },
      },
      fields: [
        {
          name: "footerItemIcon",
          label: "Footer Item Icon",
          type: "string",
          options: footerItemIcon,
        },
        {
          name: "footerItemLink",
          label: "Footer Item Link",
          type: "string",
        },
      ],
    },
    {
      name: "links",
      label: "Text Links",
      description:
        "Shown after the copyright line, for example Security, Terms, Support. The Privacy Policy link is added automatically when the product has one.",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.label };
        },
      },
      fields: [
        {
          name: "label",
          label: "Label",
          type: "string",
          required: true,
        },
        {
          name: "href",
          label: "href",
          type: "string",
          required: true,
        },
      ],
    },
    {
      name: "poweredByTinaBanner",
      label: "Powered By Tina Banner",
      type: "object",
      fields: [
        {
          name: "textColour",
          label: "Text Colour",
          type: "string",
          ui: {
            component: 'color',
          }
        },
        {
          name: "text",
          label: "Text",
          type: "string",
        },
        {
          name: "image",
          label: "Image",
          type: "string",
        },
        {
          name: "url",
          label: "URL",
          type: "string",
        },
      ],
    },
  ],
};
