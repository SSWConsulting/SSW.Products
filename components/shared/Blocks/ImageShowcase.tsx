"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";

interface ImageShowcaseProps {
  title?: string | null;
  gridDescription?: any;
  showcaseImage?: string | null;
  showcaseTitle?: string | null;
  showcaseDescription?: string | null;
  downloadLink?: string | null;
}

const ImageShowcase = ({ 
  title, 
  gridDescription, 
  showcaseImage, 
  showcaseTitle, 
  showcaseDescription, 
  downloadLink 
}: ImageShowcaseProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const hasHeader = title || gridDescription;
  const hasShowcaseImage = showcaseImage?.trim();
  const hasContent = hasHeader || hasShowcaseImage || showcaseTitle || showcaseDescription;

  if (!hasContent) return null;

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadLink) window.open(downloadLink, '_blank');
  }, [downloadLink]);

  const toggleHover = useCallback(() => setIsHovered(prev => !prev), []);

  return (
    <div className="py-8 px-4 mx-auto max-w-300 md:px-12 sm:px-8 medium:px-0">
      {hasHeader && (
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

      <div className="bg-black rounded-2xl p-4">
        {hasShowcaseImage && (
          <div 
            className="relative overflow-hidden rounded-2xl mb-6 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleHover}
          >
            <Image
              src={showcaseImage!}
              alt="Showcase image"
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded-2xl"
            />
            
            {downloadLink && (
              <div className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-200 rounded-2xl ${isHovered ? 'opacity-90 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            )}
          </div>
        )}

        {showcaseTitle && (
          <h2 className="text-white text-2xl font-bold mb-3">{showcaseTitle}</h2>
        )}

        {showcaseDescription && (
          <p className="text-gray-300 text-sm">{showcaseDescription}</p>
        )}
      </div>
    </div>
  );
};

export default ImageShowcase;
