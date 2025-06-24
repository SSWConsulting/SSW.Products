import CustomImageField from "@tina/customSchemaComponents/optimizedImageField";
import { TinaField } from "tinacms";

export const optimizedImageField: TinaField[] = [
  {
    type: "image",
    label: "Image",
    name: "imgSrc",
    ui: {
      component: CustomImageField,
    },
  },
  {
    type: "number",
    name: "imgWidth",
    ui: {
      component: "hidden",
    },
  },
  {
    type: "number",
    name: "imgHeight",
    ui: {
      component: "hidden",
    },
  },
];
