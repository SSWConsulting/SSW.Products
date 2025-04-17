import TryItNowClient, { TryItNowProps, useTryItNow } from "./TryItNow";

export const getTallestAspectRatio = (
  tryItNowCards: TryItNowProps["tryItNowCards"]
): string | undefined => {
  if (!tryItNowCards) {
    return;
  }
  let aspectRatio: string | undefined = undefined;
  let smallestAspectRatioProduct: number | undefined = undefined;
  for (const card in tryItNowCards) {
    const currentCard = tryItNowCards[card];
    if (!currentCard) {
      continue;
    }
    if (
      currentCard.image &&
      currentCard.image.imgSrc &&
      currentCard.image?.imgWidth &&
      currentCard.image?.imgHeight
    ) {
      if (smallestAspectRatioProduct === undefined) {
        const { imgWidth, imgHeight } = currentCard.image;
        smallestAspectRatioProduct =
          currentCard.image.imgWidth / currentCard.image.imgHeight;
        aspectRatio = `${imgWidth}/${imgHeight}`;
      }
    }
  }
  return aspectRatio;
};

export const TryItNowServer = () => {
  const props = useTryItNow();

  // find the tallest aspect ratio of the images in the tryItNowCards server side

  const aspectRatio = props
    ? getTallestAspectRatio(props.tryItNowCards)
    : undefined;
  if (!props) {
    return <></>;
  }
  return <TryItNowClient {...props} aspectRatio={aspectRatio} />;
};
