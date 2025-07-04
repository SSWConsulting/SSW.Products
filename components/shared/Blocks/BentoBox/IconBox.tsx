import { IconBox as IconBoxProps } from "@/types/components/icon-box";
import { Maybe } from "@tina/__generated__/types";
import Image from "next/image";
import Link from "next/link";

const IconBox = ({ iconImage, iconToolTipText, iconLink }: IconBoxProps) => {
  return (
    <IconWrapper
      href={iconLink}
      className="relative rounded-2xl md:w-[60px] md:h-[60px] w-[50px] h-[50px] flex items-center justify-center top-0 hover:-top-2 transition-all duration-300 group"
    >
      <div className="absolute -inset-1 bg-linear-to-r from-gray-900 to-gray-400 rounded-2xl blur-sm opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative rounded-2xl border border-gray-600 flex items-center justify-center w-full h-full">
        <div className="rounded-full border border-gray-600 bg-linear-to-tr from-black to-gray-800 flex items-center justify-center md:h-12 md:w-12 h-10 w-10">
          <div className="w-5 h-5 md:w-7 md:h-7 relative">
            <Image
              src={iconImage || "/svg/github-mark-white.svg"}
              alt="icon"
              layout="fill"
              className="object-contain"
            />
          </div>
        </div>

        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-300 whitespace-nowrap">
          {iconToolTipText}
        </div>
      </div>
    </IconWrapper>
  );
};

const IconWrapper = ({
  href,
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
  href?: Maybe<string>;
}) =>
  href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children} </div>
  );

export default IconBox;
