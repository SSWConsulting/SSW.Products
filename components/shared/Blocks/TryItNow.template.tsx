import { Template } from "tinacms";

const TryItNowTemplate: Template = {
  label: "Try It Now",
  name: "tryItNow",
  fields: [
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
      list: true,
    },
  ],
};

export default TryItNowTemplate;
