import Image from "next/image";
import React, { useState, useEffect } from "react";
import { tinaField } from "tinacms/dist/react";

interface CarouselItem {
  tabTitle: string;
  title: string;
  description: string;
  image: string;
}

interface FeatureCarouselProps {
  data: {
    headline: string;
    carouselItems: CarouselItem[];
  } | null;
}

const FeatureHorizontalCarousel = ({ data }: FeatureCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isSmallOrMediumScreen, setIsSmallOrMediumScreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  //TODO : refactor small or medium screen https://github.com/SSWConsulting/SSW.Products/issues/14
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    setIsSmallOrMediumScreen(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsSmallOrMediumScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (isUserInteracting || isSmallOrMediumScreen) return;

    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1) % (data?.carouselItems.length || 1)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isUserInteracting, isSmallOrMediumScreen, data?.carouselItems.length]);

  useEffect(() => {
    setImageLoaded(false);
  }, [activeIndex]);

  if (!data || !data.carouselItems || data.carouselItems.length === 0) {
    return <div>No data available</div>;
  }

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    setIsUserInteracting(true);
  };

  //TODO : refactor renderMedia https://github.com/SSWConsulting/SSW.Products/issues/13
  const renderMedia = (item: CarouselItem) => {
    const fileExtension = item.image.split(".").pop()?.toLowerCase();

    if (["gif", "jpg", "jpeg", "png"].includes(fileExtension || "")) {
      return (
        <div
          className={`media-container flex justify-center items-center px-4 md:px-20 3xl:px-80 transition-opacity duration-1000 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          data-tina-field={tinaField(item, "image")}
        >
          <Image
            src={item.image}
            alt="Media item"
            className="w-full mt-10 rounded-xl"
            width={2000}
            height={2000}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      );
    } else if (["mp4", "webm"].includes(fileExtension || "")) {
      return (
        <video
          autoPlay
          muted
          loop
          className={`media-container w-full h-auto mt-6 rounded-xl shadow-lg px-4 md:px-20 lg:px-80 transition-opacity duration-1000 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          data-tina-field={tinaField(item, "image")}
          onCanPlayThrough={() => setImageLoaded(true)}
        >
          <source src={item.image} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };

  return (
    <div
      className="feature-carousel text-center mb-20 px-4 md:px-0 xl:mt-40 lg:mt-40 xl:px-40"
      data-tina-field={tinaField(data, "carouselItems")}
    >
      {!isSmallOrMediumScreen ? (
        <div className="flex justify-center mb-4">
          <div className="tab-titles flex justify-center rounded-xl bg-black max-w-fit">
            {data.carouselItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`lg:px-8 md:px-2 px-1 py-3 shadow-xl text-base rounded-xl ${
                  activeIndex === index
                    ? "text-black bg-white"
                    : "text-white bg-black hover:bg-zinc-700"
                }`}
                data-tina-field={tinaField(item, "tabTitle")}
              >
                <span className="px-2">
                  {item?.tabTitle || "Another Awesome Feature"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-10 hidden lg:block">
          <h2 className="text-3xl font-semibold text-white">All Features</h2>
        </div>
      )}

      <div className="text-white tab-content mt-10">
        {!isSmallOrMediumScreen ? (
          <div>
            {data.carouselItems[activeIndex]?.title && (
              <h2
                className="md:text-xl font-semibold lg:text-2xl "
                data-tina-field={tinaField(
                  data.carouselItems[activeIndex],
                  "title"
                )}
              >
                {data.carouselItems[activeIndex].title}
              </h2>
            )}
            {data.carouselItems[activeIndex]?.description && (
              <p
                className="text-base  mt-5"
                data-tina-field={tinaField(
                  data.carouselItems[activeIndex],
                  "description"
                )}
              >
                {data.carouselItems[activeIndex].description}
              </p>
            )}
            {renderMedia(data.carouselItems[activeIndex])}
          </div>
        ) : (
          data.carouselItems.map((item, index) => (
            <div key={index} className="mt-5 pb-8">
              {item.title && (
                <h2
                  className="text-2xl font-semibold lg:text-3xl "
                  data-tina-field={tinaField(item, "title")}
                >
                  {item.title}
                </h2>
              )}
              {item.description && (
                <p
                  className="text-base  mt-4 px-8"
                  data-tina-field={tinaField(item, "description")}
                >
                  {item.description}
                </p>
              )}
              {item.image && renderMedia(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeatureHorizontalCarousel;
