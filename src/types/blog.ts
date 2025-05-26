import { Blogs } from "@tina/__generated__/types";

export type Blog = Omit<Blogs, "_values" | "_sys" | "id">;
