import { getYouTubeVideoId } from "../utils/youtube";

test("getYouTubeVideoId works", () => {
  const expectedId = "CBes1SEvV54";
  const result = getYouTubeVideoId("https://www.youtube.com/embed/CBes1SEvV54");
  expect(result).toBe(expectedId);
});

test("getYouTubeVideoId handles dashes", () => {
  const id = "-7c6uagBBBM";
  const result = getYouTubeVideoId(
    "https://www.youtube.com/embed/-7c6uagBBBM?si=6Mxsd3VvDZXn1-OJ"
  );

  expect(result).toBe(id);
});

test("getYouTubeVideoId handles query params", () => {
  const id = "8fnfeuoh4s8";
  const result = getYouTubeVideoId(
    "https://www.youtube.com/embed/8fnfeuoh4s8?si=XBvBaWMR7EaZyxWI"
  );

  expect(result).toBe(id);
});

test("getYouTubeVideoId handles handles underscores & dashes", () => {
  const id = "-7_c6uagBBBM";
  const result = getYouTubeVideoId(
    "https://www.youtube.com/embed/-7_c6uagBBBM?si=6Mxsd3VvDZXn1-OJ"
  );

  expect(result).toBe(id);
});
