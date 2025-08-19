"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface LanguageToggleProps {
  currentLocale: string;
}

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hostname, setHostname] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHostname(window.location.hostname);
    setMounted(true);
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

      {isOpen && mounted && createPortal(
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#222222] rounded-xl p-8 shadow-2xl z-50 w-[90%] max-w-[576px]"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <h2 className="text-white text-3xl font-semibold text-center mb-6">
              Select your language
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLanguageSwitch('en');
                }}
                disabled={currentLocale === 'en'}
                className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-300 relative ${
                  currentLocale === 'en'
                    ? 'bg-[#333333] cursor-default'
                    : 'bg-[#333333] hover:bg-[#404040] cursor-pointer'
                }`}
                style={currentLocale === 'en' ? {
                  border: '1px solid transparent',
                  backgroundImage: 'linear-gradient(#333333, #333333), linear-gradient(83.78deg, #CC4141 23.25%, #D699FB 63.5%, #FF778E 124.16%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                } : {}}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src="/svg/icon-en.svg"
                    alt="English"
                    width={36}
                    height={36}
                  />
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">English</div>
                    <div className="text-white text-xl font-medium">English</div>
                  </div>
                </div>
                {currentLocale === 'en' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="23.25%" stopColor="#CC4141"/>
                        <stop offset="63.5%" stopColor="#D699FB"/>
                        <stop offset="124.16%" stopColor="#FF778E"/>
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLanguageSwitch('zh');
                }}
                disabled={currentLocale === 'zh'}
                className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-300 relative ${
                  currentLocale === 'zh'
                    ? 'bg-[#333333] cursor-default'
                    : 'bg-[#333333] hover:bg-[#404040] cursor-pointer'
                }`}
                style={currentLocale === 'zh' ? {
                  border: '1px solid transparent',
                  backgroundImage: 'linear-gradient(#333333, #333333), linear-gradient(83.78deg, #CC4141 23.25%, #D699FB 63.5%, #FF778E 124.16%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                } : {}}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src="/svg/icon-zh.svg"
                    alt="中文"
                    width={36}
                    height={36}
                  />
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">Chinese</div>
                    <div className="text-white text-xl font-medium">中文</div>
                  </div>
                </div>
                {currentLocale === 'zh' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="23.25%" stopColor="#CC4141"/>
                        <stop offset="63.5%" stopColor="#D699FB"/>
                        <stop offset="124.16%" stopColor="#FF778E"/>
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
