import TryItNowClient, { useTryItNow } from "./TryItNow";

export const TryItNowServer = () => {
  const props = useTryItNow();

  // find the tallest aspect ratio of the images in the tryItNowCards server side

  const getTallestAspectRatio = (): string | undefined => {
    if (!props?.tryItNowCards) {
      return;
    }
    let aspectRatio: string | undefined = undefined;
    let smallestAspectRatioProduct: number | undefined = undefined;
    for (const card in props.tryItNowCards) {
      const currentCard = props.tryItNowCards[card];
      if (!currentCard) {
        continue;
      }
      if (
        currentCard.image &&
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

  const aspectRatio = getTallestAspectRatio();
  console.log("aspectRatio", aspectRatio);
  if (!props) {
    return <></>;
  }
  return <TryItNowClient {...props} aspectRatio={aspectRatio} />;
};
