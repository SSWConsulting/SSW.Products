import axios from "axios";
import React from "react";
import { FormApi, Template, TextField, TinaField } from "tinacms";

const VideoUrl = (props: {
  field: {
    placeholder?: string;
    name: string;
    label?: string | undefined | boolean;
  };
  form?: FormApi;
  input: {
    onBlur: (event?: React.FocusEvent<string> | undefined) => void;
    onChange: (event: React.ChangeEvent<string>) => void;
    onFocus: (event: React.FocusEvent<string, Element> | undefined) => void;
    value: string;
    name: string;
  };
  meta: object;
}) => {
  const reg = /https:\/\/www.youtube.com\/embed\/([a-zA-Z0-9\-\_]*)/;
  const matches = reg.exec(props.input.value);
  const videoId = matches ? matches[1] : null;
  if (!props.form)
    throw new Error("Form is required for Video Display component");
  console.log("videoId", videoId);

  const leadingField = props.input.name.replace("externalVideoLink", "");

  const urls = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  ];
  const traverseUrls = (urls: string[]) => {
    axios
      .get(urls[0])
      .then(() => {
        props.form?.change(`${leadingField}thumbnail`, urls[0]);
      })
      .catch(() => {
        urls = urls.slice(1);
        if (urls.length === 0) {
          props.form?.change(`${leadingField}thumbnail`, null);
          return;
        }
        traverseUrls(urls);
      });
  };
  traverseUrls(urls);

  return (
    <React.Fragment>
      <TextField
        field={{
          description:
            "⚠︎ Only YouTube embed URLs work - they look like this https://www.youtube.com/embed/Yoh2c5RUTiY",
          name: props.field.name,
          component: null,
          placeholder: "",
          label: props.field.label || props.field.name,
        }}
        meta={props.meta}
        form={props.form}
        input={{
          name: props.field.name,
          value: props.input.value,
          onChange: (e) => {
            props.input.onChange(e);
          },
          onBlur: () => {},
          onFocus: () => {},
        }}
        className="w-full"
      />
    </React.Fragment>
  );
};

export const optimizedYoutubeFields: TinaField[] = [
  {
    name: "externalVideoLink",
    type: "string",
    label: "External Video Link",
    description:
      "YouTube embed link (e.g., https://www.youtube.com/embed/[videoId])",
    ui: {
      component: VideoUrl,
    },
  },
  {
    name: "thumbnail",
    ui: {
      component: "hidden",
    },
    label: "Thumbnail",
    type: "string",
  },
];

export const videoDisplayTemplate: Template = {
  label: "Video Display",
  name: "videoDisplay",
  fields: [
    { name: "altText", label: "Alt Text", type: "string" },
    { name: "title", label: "Title", type: "string" },
    ...optimizedYoutubeFields,

    { name: "figureCaption", label: "Figure Caption", type: "string" },
  ],
};
