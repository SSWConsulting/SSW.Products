import Link from "next/link";
import Image from "next/image";
import { GradientBackground } from "./Hero/GradientBackground";

interface MediaHeroButtonProps {
  label: string;
  iconSrc?: string;
  href: string;
  target?: "_blank" | "_self";
}

interface MediaHeroProps {
  heroTitle?: string;
  heroDescription?: string;
  heroButton?: MediaHeroButtonProps;
  dateText?: string;
}

const MediaHero = ({
  heroTitle,
  heroDescription,
  heroButton,
  dateText,
}: MediaHeroProps) => {
  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Ignore this weird code — no idea why the background is tied to the Hero component. I have to adjust the position manually for Ken. */}
      <div className="relative" style={{ top: '310px', left: '30px' }}>
        <GradientBackground />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mx-auto max-w-300 md:px-12 sm:px-8 medium:px-0 pt-20">
        {heroTitle && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight">
            {heroTitle}
          </h1>
        )}

        {heroDescription && (
          <p className="text-[16px] text-white font-light mb-16 leading-relaxed">
            {heroDescription}
          </p>
        )}

        {heroButton && (
          <div>
            <Link
              href={heroButton.href}
              target={heroButton.target}
              className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md text-base font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              {heroButton.iconSrc && (
                <span className="flex items-center justify-center">
                  <Image 
                    src={heroButton.iconSrc} 
                    alt="" 
                    width={16} 
                    height={16}
                    className="w-4 h-4"
                  />
                </span>
              )}
              {heroButton.label}
            </Link>
          </div>
        )}

        {dateText && (
          <p className="text-sm font-light text-white/70 mt-4">
            {dateText}
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaHero;
