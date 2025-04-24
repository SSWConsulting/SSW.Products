import { TextPart, TypewriterTextProps } from "@/types/components/transcript";
import { useCallback, useEffect, useState } from "react";

const useTypewriter = ({
  shouldStartTyping,
  text,
  setShouldStartTyping,
  startDelay,
}: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [parts, setParts] = useState<TextPart[]>([]);
  const playTypingAnimation = useCallback(() => {
    if (!shouldStartTyping) return;
    // Parse the text to identify parts to be highlighted
    const parsedParts = text.split(/({.*?})/).map((part) => ({
      text:
        part.startsWith("{") && part.endsWith("}") ? part.slice(1, -1) : part,
      highlight: part.startsWith("{") && part.endsWith("}"),
    }));
    setParts(parsedParts);
    // Start typing animation
    let fullText = "";
    const flatText = parsedParts.map((part) => part.text).join("");

    const typingSpeed = 2000 / flatText.length; // Distribute typing over 5 seconds

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < flatText.length) {
        fullText += flatText[i];
        setDisplayText(fullText);
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);

        // After typing completes, wait a moment then start the highlighting animation
        setTimeout(() => {
          setIsHighlightingComplete(true);
        }, 500);
      }
    }, typingSpeed);
  }, [text, shouldStartTyping]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const reset = useCallback(() => {
    setDisplayText("");
    setIsTypingComplete(false);
    setIsHighlightingComplete(false);
  }, []);

  if (isTypingComplete && setShouldStartTyping) {
    setShouldStartTyping(false);
    setTimeout(() => {
      if (setShouldStartTyping) {
        setShouldStartTyping(true);
      }
    }, 1000 * 5);
  }

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (shouldStartTyping) {
      reset();
      typingTimeout = setTimeout(() => {
        playTypingAnimation();
      }, startDelay);
    }
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [shouldStartTyping, reset, playTypingAnimation, startDelay]);

  const [isHighlightingComplete, setIsHighlightingComplete] = useState(false);
  return {
    displayText,
    isTypingComplete,
    isHighlightingComplete,
    parts,
    playTypingAnimation,
    reset,
    setDisplayText,
    setIsTypingComplete,
    setIsHighlightingComplete,
  };
};

export default useTypewriter;
