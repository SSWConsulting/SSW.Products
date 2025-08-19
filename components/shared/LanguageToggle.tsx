"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LanguageToggleProps {
  currentLocale: string;
}

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hostname, setHostname] = useState<string>('');

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const getAlternateUrl = (targetLocale: 'en' | 'zh'): string => {
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    const cleanPath = pathname.startsWith('/zh') ? pathname.substring(3) : pathname;
    const basePath = cleanPath || '/';

    if (isLocal) {
      return targetLocale === 'zh' ? `/zh${basePath}` : basePath;
    } else {
      if (targetLocale === 'zh') {
        if (hostname === 'yakshaver.ai') {
          return `https://yakshaver.cn${basePath}`;
        } else {
          return basePath;
        }
      } else {
        return `https://yakshaver.ai${basePath}`;
      }
    }
  };

  const handleLanguageSwitch = (targetLocale: 'en' | 'zh') => {
    if (targetLocale === currentLocale) return;
    
    const url = getAlternateUrl(targetLocale);
    if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      window.location.pathname = url;
    }
  };

  const currentIcon = currentLocale === 'zh' ? '/svg/icon-zh.svg' : '/svg/icon-en.svg';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        aria-label="Switch language"
      >
        <Image
          src={currentIcon}
          alt={currentLocale === 'zh' ? 'Chinese' : 'English'}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-[#222222] rounded-lg p-6 max-w-xs w-full mx-4 shadow-2xl">
            <h2 className="text-white text-lg font-semibold text-center mb-4">
              Select your language
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLanguageSwitch('en');
                }}
                disabled={currentLocale === 'en'}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentLocale === 'en'
                    ? 'bg-[#121212] cursor-not-allowed opacity-70'
                    : 'bg-[#333333] hover:bg-[#404040] cursor-pointer'
                }`}
              >
                <Image
                  src="/svg/icon-en.svg"
                  alt="English"
                  width={20}
                  height={20}
                />
                <span className="text-white">English</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLanguageSwitch('zh');
                }}
                disabled={currentLocale === 'zh'}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentLocale === 'zh'
                    ? 'bg-[#121212] cursor-not-allowed opacity-70'
                    : 'bg-[#333333] hover:bg-[#404040] cursor-pointer'
                }`}
              >
                <Image
                  src="/svg/icon-zh.svg"
                  alt="中文"
                  width={20}
                  height={20}
                />
                <span className="text-white">中文</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
