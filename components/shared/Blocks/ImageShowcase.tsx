"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

interface ImageShowcaseProps {
  title?: string | null;
  gridDescription?: string | null;
  showcaseImage?: string | null;
  showcaseTitle?: string | null;
  showcaseDescription?: string | null;
  downloadLink?: string | null;
}

const ImageShowcase = ({ title, gridDescription, showcaseImage, showcaseTitle, showcaseDescription, downloadLink }: ImageShowcaseProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownloadClick = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    }
  };

  const hasValidImage = showcaseImage && showcaseImage.trim() !== '';

  return (
    <div className="py-8 px-4 md:px-12 sm:px-8 medium:px-0 max-w-300 mx-auto">
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

      <div className="w-full">
        <div className="w-full">
          <div className="bg-black rounded-2xl p-4">
            {hasValidImage && (
              <div 
                className="relative overflow-hidden rounded-2xl mb-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Image
                  src={showcaseImage}
                  alt="Showcase image"
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rounded-2xl"
                />
                
                <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-200 rounded-2xl ${isHovered ? 'opacity-90' : 'opacity-0'}`}>
                  {downloadLink && (
                    <button
                      onClick={handleDownloadClick}
                      className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  )}
                </div>
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
      </div>
    </div>
  );
};

export default ImageShowcase;
