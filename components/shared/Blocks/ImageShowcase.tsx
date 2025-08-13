"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import JSZip from "jszip";

interface ImageShowcaseProps {
  title?: string;
  gridDescription?: string;
  showcaseImages?: string[];
  showcaseTitle?: string;
  showcaseDescription?: string;
}

const ImageShowcase = ({ title, gridDescription, showcaseImages, showcaseTitle, showcaseDescription }: ImageShowcaseProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownloadZip = async () => {
    if (!showcaseImages || showcaseImages.length === 0) return;
    
    const validImages = showcaseImages.filter(image => image && image.trim() !== '');
    if (validImages.length === 0) return;
    
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < validImages.length; i++) {
        const response = await fetch(validImages[i]);
        const blob = await response.blob();
        const fileName = `image_${i + 1}.${blob.type.split('/')[1] || 'jpg'}`;
        zip.file(fileName, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `images_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Download failed, please try again');
    }
  };

  const firstImage = showcaseImages?.[0];
  const hasValidImage = firstImage && firstImage.trim() !== '';
  
  const validImagesCount = showcaseImages?.filter(image => image && image.trim() !== '').length || 0;

  return (
    <div className="w-[68%] mx-auto py-8">
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-black rounded-2xl p-4">
            {hasValidImage && (
              <div 
                className="relative overflow-hidden rounded-2xl mb-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Image
                  src={firstImage}
                  alt="Showcase image"
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rounded-2xl"
                />
                
                <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-200 rounded-2xl ${isHovered ? 'opacity-90' : 'opacity-0'}`}>
                  <button
                    onClick={handleDownloadZip}
                    className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    Download ZIP ({validImagesCount} images)
                  </button>
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
