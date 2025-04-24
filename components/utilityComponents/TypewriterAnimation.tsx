import { cn } from "@/lib/utils";
import { TypewriterTextProps } from "@/types/components/transcript";
import useTypewriter from "../hooks/typewriter";

// Typing Animation Component - made by Cursor
const TypewriterAnimation = ({
  text,
  repeatDelay = 60,
  startDelay = 0,
  className,
  shouldStartTyping,
  setShouldStartTyping,
}: TypewriterTextProps) => {
  const { displayText, isTypingComplete, isHighlightingComplete, parts } =
    useTypewriter({
      repeatDelay,
      startDelay,
      setShouldStartTyping,
      shouldStartTyping,
      text,
    });

  if (!text) return null;

  // Before typing is complete, show the plain text being typed
  if (!isTypingComplete) {
    return <span>{displayText}</span>;
  }

  // After typing is complete, show the highlighted version
  return (
    <span className={cn(className)}>
      {parts.map((part, index) =>
        part.highlight ? (
          <span
            key={index}
            className={`
              relative overflow-hidden
              ${
                isHighlightingComplete
                  ? "text-black bg-white rounded-[2px]"
                  : "text-white bg-none"
              }
              transition-colors duration-500 ease-in-out
            `}
          >
            {/* Background highlight with animation */}
            <span
              className={`
                absolute inset-0
                bg-white
                rounded-[2px]
                origin-left
                ${isHighlightingComplete ? "scale-x-100" : "scale-x-0"}
                transition-transform duration-500 ease-in-out
                -z-10
              `}
            />
            <span className="px-[0.1rem]">{part.text}</span>
          </span>
        ) : (
          part.text
        )
      )}
    </span>
  );
};

export default TypewriterAnimation;
