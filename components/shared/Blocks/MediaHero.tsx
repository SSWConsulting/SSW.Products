import Link from "next/link";
import Image from "next/image";
import Container from "../../Container";

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
    <div className={`w-full py-16 px-6 ${className}`}>
      <Container 
        size="small" 
        className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
      >
        {heroTitle && (
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            {heroTitle}
          </h1>
        )}

        {heroDescription && (
          <p className="text-base md:text-lg text-white mb-12 max-w-2xl leading-relaxed">
            {heroDescription}
          </p>
        )}

        {heroButton && (
          <div className="mb-6">
            <Link
              href={heroButton.href || "#"}
              target={heroButton.target || "_self"}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg"
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
          <p className="text-xs font-light text-white/60">
            {dateText}
          </p>
        )}
      </Container>
    </div>
  );
};

export default MediaHero;
