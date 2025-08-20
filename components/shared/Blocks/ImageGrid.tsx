import Image from "next/image";
import { Download } from "lucide-react";
import { useState, useCallback } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";

interface ImageItem {
  id?: string;
  svgSrc?: string;
  pngSrc?: string;
  pngDownloadUrl?: string;
  alt?: string;
  blockColor?: string;
  imageScale?: number;
  enableDownload?: boolean;
}

interface ImageGridProps {
  title?: string | null;
  gridDescription?: any;
  images?: ImageItem[];
  itemsPerRow?: number;
  aspectRatio?: number;
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
  aspectRatio = 0.65,
  className = "",
}: ImageGridProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  const hasContent = images.length > 0 || title || gridDescription;
  if (!hasContent) return null;

  const downloadFile = useCallback((url: string, filename: string) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    window.location.href = proxyUrl;
  }, []);

  const gridCols = GRID_COLS_MAP[itemsPerRow] || GRID_COLS_MAP[3];

  const DownloadButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );

  const handleImageInteraction = useCallback((index: number, action: 'enter' | 'leave' | 'click') => {
    const image = images[index];
    if (image.enableDownload === false) return;

    switch (action) {
      case 'enter':
        setActiveImageIndex(index);
        break;
      case 'leave':
        setActiveImageIndex(null);
        break;
      case 'click':
        setActiveImageIndex(prev => prev === index ? null : index);
        break;
    }
  }, [images]);

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
            <div className="text-[14px] text-white font-medium leading-relaxed max-w-3xl mx-auto">
              <TinaMarkdown components={DocAndBlogMarkdownStyle} content={gridDescription} />
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className={`grid ${gridCols} gap-6`}>
          {images.map((image, index) => {
            const displaySrc = image.svgSrc || image.pngSrc;
            if (!displaySrc) return null;

            const isDownloadEnabled = image.enableDownload !== false;
            const isActive = activeImageIndex === index;

            return (
              <div
                key={image.id || index}
                className={`relative group overflow-hidden rounded-2xl flex items-center justify-center ${isDownloadEnabled ? 'cursor-pointer' : ''}`}
                style={{ 
                  backgroundColor: image.blockColor || 'transparent',
                  aspectRatio: `1 / ${aspectRatio}`
                }}
                onMouseEnter={() => handleImageInteraction(index, 'enter')}
                onMouseLeave={() => handleImageInteraction(index, 'leave')}
                onClick={() => handleImageInteraction(index, 'click')}
              >
                <Image
                  src={displaySrc}
                  alt={image.alt || ""}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain rounded-2xl"
                  style={{ transform: `scale(${image.imageScale || 1})` }}
                />

                {isDownloadEnabled && (
                  <div className={`absolute inset-0 bg-black/80 transition-opacity duration-200 flex items-center justify-center gap-3 rounded-2xl overflow-hidden ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    {image.svgSrc && (
                      <DownloadButton
                        onClick={() => downloadFile(image.svgSrc!, `${image.alt || 'image'}.svg`)}
                        label="SVG"
                      />
                    )}
                    {image.pngSrc && (
                      <DownloadButton
                        onClick={() => downloadFile(image.pngDownloadUrl || image.pngSrc!, `${image.alt || 'image'}.png`)}
                        label="PNG"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
