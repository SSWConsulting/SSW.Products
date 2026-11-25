import { buttonVariants } from "@comps/ui/button";
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
  hideGradientBackground?: boolean;
}

const MediaHero = ({
  heroTitle,
  heroDescription,
  heroButton,
  dateText,
  hideGradientBackground,
}: MediaHeroProps) => {
  return (
    <div className="relative max-w-7xl mx-auto">
      {!hideGradientBackground && (
        /* Ignore this weird code — no idea why the background is tied to the Hero component. I have to adjust the position manually for Ken. */
        <div className="relative" style={{ top: '310px', left: '30px' }}>
          <GradientBackground />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mx-auto max-w-300 md:px-12 sm:px-8 medium:px-0 pt-20">
        {heroTitle && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight lg:w-[65%]">
            {heroTitle}
          </h1>
        )}

        {heroDescription && (
          <div className="text-white text-center text-base md:text-lg flex flex-col gap-2 mb-16 lg:w-[80%]">
            {heroDescription.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {heroButton && (
          <Link
            href={heroButton.href}
            target={heroButton.target}
            className={buttonVariants({ variant: "solidWhite" })}
          >
            {heroButton.iconSrc && (
              <Image 
                src={heroButton.iconSrc} 
                alt="" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            )}
            {heroButton.label}
          </Link>
        )}

        {dateText && (
          <p className="text-sm text-white/70 mt-4">
            {dateText}
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaHero;
