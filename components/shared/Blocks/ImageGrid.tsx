import Image from "next/image";
import { Download } from "lucide-react";
import { useState } from "react";

interface ImageItem {
  id?: string;
  svgSrc?: string;
  pngSrc?: string;
  pngDownloadUrl?: string;
  alt?: string;
  blockColor?: string;
  imageScale?: number;
}

interface ImageGridProps {
  title?: string | null;
  gridDescription?: string | null;
  images?: ImageItem[];
  itemsPerRow?: number;
  className?: string;
}

const GRID_COLS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
};

const ImageGrid = ({
  title,
  gridDescription,
  images = [],
  itemsPerRow = 3,
  className = "",
}: ImageGridProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  if (!images?.length && !title && !gridDescription) return null;

  const downloadFile = (url: string, filename: string) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    window.location.href = proxyUrl;
  };

  const downloadPNG = (pngSrc: string, pngDownloadUrl: string | undefined, alt?: string) => {
    const filename = `${alt || 'image'}.png`;
    downloadFile(pngDownloadUrl || pngSrc, filename);
  };

  const getGridCols = () => GRID_COLS_MAP[itemsPerRow] || GRID_COLS_MAP[3];

  const buttonClassName = "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200";

  const renderDownloadButton = (
    onClick: () => void, 
    label: string
  ) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={buttonClassName}
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className={`py-8 px-4 mx-auto w-full max-w-300 md:px-12 sm:px-8 medium:px-0 ${className}`}>
      {(title || gridDescription) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-[32px] font-semibold text-white mb-1">
              {title}
            </h2>
          )}
          {gridDescription && (
            <p className="text-[14px] text-white font-medium leading-relaxed max-w-3xl mx-auto">
              {gridDescription}
            </p>
          )}
        </div>
      )}

      {images?.length > 0 && (
        <div className={`grid ${getGridCols()} gap-6`}>
          {images.map((image, index) => {
            const displaySrc = image.svgSrc || image.pngSrc;
            if (!displaySrc) return null;

            return (
              <div
                key={image.id || index}
                className="relative group overflow-hidden rounded-2xl cursor-pointer flex items-center justify-center"
                style={{ 
                  backgroundColor: image.blockColor || 'transparent',
                  aspectRatio: '1 / 0.65'
                }}
                onMouseEnter={() => setActiveImageIndex(index)}
                onMouseLeave={() => setActiveImageIndex(null)}
                onClick={() => setActiveImageIndex(activeImageIndex === index ? null : index)}
              >
                <Image
                  src={displaySrc}
                  alt={image.alt || ""}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain rounded-2xl"
                  style={{ transform: `scale(${image.imageScale || 1})` }}
                />

                <div className={`absolute inset-0 bg-black/80 transition-opacity duration-200 flex items-center justify-center gap-3 rounded-2xl overflow-hidden ${activeImageIndex === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                  {image.svgSrc && renderDownloadButton(
                    () => downloadFile(image.svgSrc!, `${image.alt || 'image'}.svg`),
                    'SVG'
                  )}
                  {image.pngSrc && renderDownloadButton(
                    () => downloadPNG(image.pngSrc!, image.pngDownloadUrl, image.alt),
                    'PNG'
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
