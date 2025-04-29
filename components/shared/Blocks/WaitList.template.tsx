import { Template } from "tinacms";

const WaitListTemplate : Template = {
    name: "waitlist",
    label: "Waitlist",
    ui: {
        defaultItem: {
        title: "Join the waitlist",
        description:
            "Be the first to know when we launch!",
        buttonText: "Join Waitlist",
        buttonLink: "/waitlist",
        },
    },
    fields: [
        {
        name: "title",
        label: "Title",
        type: "string",
        },
        {
        name: "description",
        label: "Descripion",
        type: "rich-text",
        },
        {
        name: "buttonText",
        label: "Button Text",
        type: "string",
        },
    ],
}


export default WaitListTemplate;