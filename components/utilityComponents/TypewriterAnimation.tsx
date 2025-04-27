import { cn } from "@/lib/utils";
import { AnimatedComponent } from "@/types/components/animated";
import { TypewriterTextProps } from "@/types/components/transcript";
import React, { useImperativeHandle, useRef } from "react";
import useTypewriter from "../hooks/typewriter";
type TypewriterAnimationProps = {
  paragraphs: string[];
  onTypingComplete?: () => void;
};

export type ParagraphAnimations = {
  play: () => void;
  reset: () => void;
};

const TypewriterParagraphAnimation = React.forwardRef<
  ParagraphAnimations,
  Omit<TypewriterAnimationProps, "ref">
>(({ paragraphs, onTypingComplete }, ref) => {
  const paragraphRefs = useRef<(AnimatedComponent | null)[]>([]);
  const staggerDelay = 2100;

  // Ensure refs array stays consistent with paragraphs length
  React.useEffect(() => {
    paragraphRefs.current = Array(paragraphs.length).fill(null);
  }, [paragraphs.length]);

  useImperativeHandle(ref, () => ({
    play() {
      paragraphRefs.current.forEach((el) => {
        if (el) {
          el.play();
        }
      });
    },
    reset() {
      paragraphRefs.current.forEach((el) => {
        if (el) {
          el.reset();
        }
      });
    },
  }));

  return (
    <>
      {paragraphs.map((text, index) => {
        return (
          <span key={index}>
            <TypewriterAnimation
              ref={(el) => {
                if (el) paragraphRefs.current[index] = el;
              }}
              text={text}
              startDelay={index * staggerDelay}
              className="text-xs xl:text-base"
              onTypingComplete={
                index === paragraphs.length - 1
                  ? () => {
                      if (!onTypingComplete) return;
                      onTypingComplete();
                    }
                  : undefined
              }
            />
          </span>
        );
      })}
    </>
  );
});

TypewriterParagraphAnimation.displayName = "TypewriterParagraphAnimation";

// Typing Animation Component - made by Cursor
const TypewriterAnimation = React.forwardRef<
  AnimatedComponent,
  TypewriterTextProps
>((props, ref) => {
  const {
    text,
    repeatDelay = 60,
    startDelay = 0,
    onTypingComplete,
    className,
  } = props;

  const {
    displayText,
    isTypingComplete,
    isHighlightingComplete,
    parts,
    resetTypingAnimation,
    playTypingAnimation,
  } = useTypewriter({
    onTypingComplete,
    repeatDelay,
    startDelay,
    text,
  });

  useImperativeHandle(ref, () => ({
    play() {
      playTypingAnimation();
    },
    reset() {
      resetTypingAnimation();
    },
  }));

  if (!text) return null;

  // Before typing is complete, show the plain text being typed
  if (!isTypingComplete) {
    return <span className={className}>{displayText}</span>;
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
            <span className={"px-[0.1rem]"}>{part.text}</span>
          </span>
        ) : (
          part.text
        )
      )}
    </span>
  );
});

TypewriterAnimation.displayName = "TypewriterAnimation";

export { TypewriterAnimation, TypewriterParagraphAnimation };
