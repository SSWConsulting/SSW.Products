import { Template } from "tinacms";

export const HeadingSpecimenTemplate: Template = {
  label: "Heading Specimen",
  name: "headingSpecimen",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      description: "Section title displayed above the heading samples",
    },
    {
      type: "rich-text",
      label: "Description",
      name: "description",
      description:
        "Optional intro displayed below the title. The samples below render live from the site's base heading styles, so they always match the real pages.",
    },
  ],
};
