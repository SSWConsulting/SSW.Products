import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp, FaVideo } from "react-icons/fa6";
import { IoChatbox } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { FaFile } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

const icons = {
FaVideo,
IoChatbox,
FaImage,
FaFile,
};

const IconSelector = ({ input }: { input: any }) => {
  const iconKeys = Object.keys(icons);
  const [selectedIcon, setSelectedIcon] = useState(input.value || '');
  const [isMinimized, setIsMinimized] = useState(true);

  const handleIconChange = (iconKey: string) => {
    setSelectedIcon(iconKey);
    input.onChange(iconKey);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const TinaButtonClasses =
    'text-sm mb-2 shadow focus:shadow-outline focus:border-blue-500 w-full border border-gray-100 hover:border-gray-200 text-gray-500 hover:text-blue-400 focus:text-blue-500 rounded-md';

  return (
    <div>
      <button
        onClick={toggleMinimize}
        className={`${TinaButtonClasses} bg-white hover:bg-gray-50`}
      >
        <span className="inline-flex items-center m-2">
          {isMinimized ? (
            <>
              Show icons <FaAngleDown className="m-1" />
            </>
          ) : (
            <>
              Hide icons <FaAngleUp className="m-1" />
            </>
          )}
        </span>
      </button>
      {!isMinimized && (
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => handleIconChange('')}  
            className={`${TinaButtonClasses} flex items-center cursor-pointer p-2 ${
              selectedIcon === '' ? 'bg-blue-200' : 'bg-white'
            }`}
          >
            <ImCross className="mr-2" />{' '}
            <span className="text-xs">No Icon</span>
          </div>
          {iconKeys.map((key) => {
            const IconComponent = icons[key as keyof typeof icons];
            const trimmedKey = key.slice(2);
            return (
              <div
                key={key}
                onClick={() => handleIconChange(key)}
                className={`${TinaButtonClasses} flex items-center cursor-pointer p-2 ${
                  selectedIcon === key ? 'bg-blue-200' : 'bg-white'
                }`}
              >
                <IconComponent
                  color={selectedIcon === key ? 'blue' : 'black'}
                  size={16}
                  className="mr-2"
                />
                <span className="text-xs">{trimmedKey}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IconSelector;
