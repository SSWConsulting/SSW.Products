"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download, Upload } from "lucide-react";
import JSZip from "jszip";

interface ImageShowcaseProps {
  showcaseImages?: string[];
  title?: string;
  showcaseDescription?: string;
}

const ImageShowcase = ({ showcaseImages, title, showcaseDescription }: ImageShowcaseProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownloadZip = async () => {
    if (!showcaseImages || showcaseImages.length === 0) return;
    
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < showcaseImages.length; i++) {
        const response = await fetch(showcaseImages[i]);
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

  if (!showcaseImages || showcaseImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black rounded-2xl p-8">
          <div 
            className="relative overflow-hidden rounded-xl mb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={showcaseImages[0]}
              alt="Showcase image"
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded-xl"
            />
            
            <div className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-200 rounded-xl ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                Download ZIP ({showcaseImages.length} images)
              </button>
            </div>
          </div>

          {title && (
            <h2 className="text-white text-2xl font-bold mb-3">{title}</h2>
          )}

          {showcaseDescription && (
            <p className="text-gray-300 text-base">{showcaseDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageShowcase;