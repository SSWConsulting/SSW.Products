import { renderToStaticMarkup } from "react-dom/server";
import GoogleStructuredDataScript from "../components/GoogleStructuredDataScript";

describe("GoogleStructuredDataScript", () => {
  it("can't be closed early by a value containing </script>", () => {
    const value = { name: "</script><script>alert(1)</script>" };
    const html = renderToStaticMarkup(
      <GoogleStructuredDataScript jsonString={JSON.stringify(value)} />,
    );

    expect(html.match(/<\/script>/g)).toHaveLength(1);
    const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(JSON.parse(json)).toEqual(value);
  });
});
