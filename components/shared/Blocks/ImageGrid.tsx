import Image from "next/image";
import { Download } from "lucide-react";

interface ImageItem {
  id?: string;
  svgSrc?: string;
  pngSrc?: string;
  alt?: string;
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
  if (!images?.length) return null;

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.open(url, '_blank');
      }
    }
  };

  const getGridCols = () => GRID_COLS_MAP[itemsPerRow] || GRID_COLS_MAP[3];

  const renderDownloadButton = (src: string, type: 'SVG' | 'PNG', alt?: string) => (
    <button
      onClick={() => downloadFile(src, `${alt || 'image'}.${type.toLowerCase()}`)}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
    >
      <Download className="w-4 h-4" />
      {type}
    </button>
  );

  return (
    <div className={`w-[65%] py-8 mx-auto ${className}`}>
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
        {images.map((image, index) => {
          const displaySrc = image.svgSrc || image.pngSrc;
          if (!displaySrc) return null;

          return (
            <div
              key={image.id || index}
              className="relative group overflow-hidden rounded-2xl"
            >
              <Image
                src={displaySrc}
                alt={image.alt || ""}
                width={400}
                height={300}
                className="w-full h-auto object-contain rounded-2xl"
              />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 rounded-2xl" style={{ backgroundColor: 'rgba(34, 34, 34, 0.8)' }}>
                {image.svgSrc && renderDownloadButton(image.svgSrc, 'SVG', image.alt)}
                {image.pngSrc && renderDownloadButton(image.pngSrc, 'PNG', image.alt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGrid;
