import { Collection } from "tinacms";

const footerItemIcon = [
  "FaYouTube",
  "FaLinkedIn",
  "FaFacebook",
  "FaTwitter",
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
  ],
};
