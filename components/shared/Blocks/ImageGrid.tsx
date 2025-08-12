import Image from "next/image";
import { Download } from "lucide-react";
import Container from "../../Container";

interface ImageItem {
  id?: string;
  svgSrc?: string;
  pngSrc?: string;
  alt?: string;
}

interface ImageGridProps {
  title?: string;
  gridDescription?: string;
  images?: ImageItem[];
  itemsPerRow?: number;
  className?: string;
}

const ImageGrid = ({
  title,
  gridDescription,
  images = [],
  itemsPerRow = 3,
  className = "",
}: ImageGridProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const getGridCols = () => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    };
    return colsMap[itemsPerRow] || colsMap[3];
  };

  return (
    <div className={`w-[68%] py-8 mx-auto ${className}`}>
      {/* Title and Description Section */}
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

      <div className={`grid ${getGridCols()} gap-6`}>
        {images?.map((image, index) => {
            const displaySrc = image.svgSrc || image.pngSrc;
            if (!displaySrc) return null;

            return (
              <div
                key={image.id || index}
                className="relative group overflow-hidden rounded-xl"
              >
                <Image
                  src={displaySrc}
                  alt={image.alt || ""}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain rounded-xl"
                />

                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-3 rounded-xl">
                  {image.svgSrc && (
                    <button
                      onClick={() => handleDownload(image.svgSrc!, 'image.svg')}
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      SVG
                    </button>
                  )}
                  {image.pngSrc && (
                    <button
                      onClick={() => handleDownload(image.pngSrc!, 'image.png')}
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
    </div>
  );
};

export default ImageGrid;
