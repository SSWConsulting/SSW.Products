import React, { useEffect } from "react";
import { ImageField } from "tinacms";

// A custom component that automatically infers the height & width of an uploaded image
//  from the Tina docs https://tina.io/docs/extending-tina/custom-field-components#image-component-with-hidden-meta-fields

const CustomImageField = (props: any) => {
  const loadImage = async (url: string) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  };
  const { form, input } = props;
  useEffect(() => {
    loadImage(input.value).then((img) => {
      const leadingField = input.name.replace("imgSrc", "");
      form.change(`${leadingField}imgWidth`, img.naturalWidth);
      form.change(`${leadingField}imgHeight`, img.naturalHeight);
    });
  }, [form, input]);

  return (
    <React.Fragment>
      <ImageField {...props} />
    </React.Fragment>
  );
};

export default CustomImageField;
