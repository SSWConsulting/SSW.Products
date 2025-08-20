"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

type Locale = 'en' | 'zh';

interface LanguageData {
  code: Locale;
  icon: string;
  alt: string;
  label: string;
  nativeLabel: string;
}

interface LanguageToggleProps {
  currentLocale: string;
}

const LANGUAGES: LanguageData[] = [
  { code: 'en', icon: '/svg/icon-en.svg', alt: 'English', label: 'English', nativeLabel: 'English' },
  { code: 'zh', icon: '/svg/icon-zh.svg', alt: '中文', label: 'Chinese', nativeLabel: '中文' }
];

const GRADIENT_BORDER_STYLE = {
  border: '1px solid transparent',
  backgroundImage: 'linear-gradient(#222222, #222222), linear-gradient(83.78deg, #CC4141 23.25%, #D699FB 63.5%, #FF778E 124.16%)',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box'
} as const;

const LanguageButton = ({ language, isActive, onClick }: {
  language: LanguageData;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={isActive}
    className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-300 ${
      isActive 
        ? 'bg-[#222222] cursor-default' 
        : 'bg-[#333333] hover:bg-[#404040] hover:shadow-lg hover:scale-[1.02] cursor-pointer'
    }`}
    style={isActive ? GRADIENT_BORDER_STYLE : undefined}
  >
    <div className="flex items-center gap-4 ml-4">
      <Image src={language.icon} alt={language.alt} width={42} height={42} />
      <div className="text-left">
        <div className="text-[#CC4141] text-lg font-semibold">{language.label}</div>
        <div className="text-white text-2xl font-bold">{language.nativeLabel}</div>
      </div>
    </div>
    <ChevronRight size={32} className="text-[#CC4141] mr-2" />
  </button>
);

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const buildUrl = useMemo(() => (targetLocale: Locale): string => {
    if (typeof window === 'undefined') return '/';
    
    const { hostname } = window.location;
    const isProduction = hostname === 'yakshaver.ai' || hostname === 'yakshaver.cn';
    const basePath = pathname.replace(/^\/zh/, '') || '/';
    
    if (!isProduction) {
      return targetLocale === 'zh' ? `/zh${basePath}` : basePath;
    }
    
    const urlMap = {
      zh: `https://yakshaver.cn${basePath}`,
      en: `https://yakshaver.ai${basePath}`
    };
    
    return urlMap[targetLocale];
  }, [pathname]);

  const switchLanguage = (targetLocale: Locale) => {
    if (targetLocale === currentLocale) return;
    
    const url = buildUrl(targetLocale);
    window.location[url.startsWith('http') ? 'href' : 'pathname'] = url;
  };

  const currentLanguage = LANGUAGES.find(({ code }) => code === currentLocale) ?? LANGUAGES[0];

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        aria-label="Switch language"
      >
        <Image
          src={currentLanguage.icon}
          alt={currentLanguage.alt}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && createPortal(
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#222222] rounded-2xl p-8 shadow-2xl z-50 w-[90%] max-w-[576px]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <h2 className="text-white text-3xl font-semibold text-center mb-6">
              Select your language
            </h2>
            
            <div className="space-y-3">
              {LANGUAGES.map(language => (
                <LanguageButton
                  key={language.code}
                  language={language}
                  isActive={language.code === currentLocale}
                  onClick={() => {
                    setIsOpen(false);
                    switchLanguage(language.code);
                  }}
                />
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
