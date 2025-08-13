import Link from "next/link";
import Image from "next/image";
import Container from "../../Container";
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
  className?: string;
}

const MediaHero = ({
  heroTitle,
  heroDescription,
  heroButton,
  dateText,
  className = "",
}: MediaHeroProps) => {
  return (
    <div className={`relative w-full py-8 px-6 ${className}`}>
      <GradientBackground />
      <Container 
        size="small" 
        className="relative z-10 flex flex-col items-center justify-center text-center w-[50%] max-w-none mx-auto"
      >
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
              href={heroButton.href || "#"}
              target={heroButton.target || "_self"}
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
      </Container>
    </div>
  );
};

export default MediaHero;
