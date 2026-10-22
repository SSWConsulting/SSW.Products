import { promises as fs } from "fs";
import { ImageResponse } from "next/og";
import path from "path";
import { getBlogWithFallback } from "@utils/i18n";

export const size = { width: 1200, height: 630 };
const devImageHeight = 490;
export const contentType = "image/png";
export const alt = "Blog post banner";

const mimeTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

// Accepts either a public/ relative path (local dev) or a full URL —
// TinaCloud rewrites media paths to assets.tina.io URLs in production
async function loadImage(src: string): Promise<string | null> {
  try {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      const res = await fetch(src);
      if (!res.ok) return null;
      const mime = res.headers.get("content-type")?.split(";")[0] || "";
      if (!mime.startsWith("image/")) return null;
      const data = Buffer.from(await res.arrayBuffer());
      return `data:${mime};base64,${data.toString("base64")}`;
    }
    const filePath = path.join(process.cwd(), "public", src);
    const mime = mimeTypes[path.extname(filePath).toLowerCase()];
    if (!mime) return null;
    const data = await fs.readFile(filePath);
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

// Dev photos are named after the author, spaces as hyphens (e.g. Steven-Qiang.png)
async function findDevImage(product: string, author?: string | null) {
  if (!author) return null;
  const filename = `${author.trim().replace(/\s+/g, "-")}.png`;
  return loadImage(path.join(product, "Devs", filename));
}

export default async function Image({
  params,
}: {
  params: Promise<{ product: string; slug: string }>;
}) {
  const { product, slug } = await params;

  const res = await getBlogWithFallback({ product, slug }).catch(() => null);
  const blog = res?.data?.blogs;

  const devImage = await findDevImage(product, blog?.author);

  // The post's banner is always the background; the author photo, when one
  // exists, is overlaid on top. The branded card is only a last resort for
  // posts with no banner at all
  const background =
    (blog?.bannerImage && (await loadImage(blog.bannerImage))) ||
    (await loadImage(`default-images/${product}-og.png`));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#161616",
        }}
      >
        {background && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={background}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {devImage && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to right, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        )}
        {devImage && (
          <div
            style={{
              position: "absolute",
              right: -120,
              bottom: -40,
              width: 680,
              height: 680,
              background:
                "radial-gradient(circle, rgba(229,72,77,0.55) 0%, rgba(229,72,77,0.18) 45%, rgba(229,72,77,0) 70%)",
            }}
          />
        )}
        {devImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={devImage}
            alt=""
            style={{
              position: "absolute",
              right: 36,
              bottom: 0,
              height: devImageHeight,
            }}
          />
        )}
      </div>
    ),
    size
  );
}
