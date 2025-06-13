const reg = /https:\/\/www.youtube.com\/embed\/([a-zA-Z0-9_\-]*)/;

export const getYouTubeVideoId = (src?: string) => {
  const matches = reg.exec(src || "");
  const videoId = matches ? matches[1] : null;
  return videoId;
};
