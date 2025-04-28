import { TextPart, TypewriterTextProps } from "@/types/components/transcript";
import { useCallback, useState } from "react";

const useTypewriter = ({
  text,
  onTypingComplete,
  startDelay,
}: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");

  const [parts, setParts] = useState<TextPart[]>([]);

  const playDeferredTypingAnimation = () => {
    setTimeout(() => {
      playTypingAnimation();
    }, startDelay); // Delay before starting the typing animation
  };
  const playTypingAnimation = useCallback(() => {
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
        if (onTypingComplete) {
          onTypingComplete();
        } // Call the onTypingComplete callback if provided
        setIsTypingComplete(true);

        // After typing completes, wait a moment then start the highlighting animation
        setTimeout(() => {
          setIsHighlightingComplete(true);
        }, 500);
      }
    }, typingSpeed);
  }, [text, onTypingComplete]);

  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const reset = useCallback(() => {
    setDisplayText("");
    setIsTypingComplete(false);
    setIsHighlightingComplete(false);
  }, []);

  const [isHighlightingComplete, setIsHighlightingComplete] = useState(false);
  return {
    displayText,
    isTypingComplete,
    isHighlightingComplete,
    parts,
    playTypingAnimation: playDeferredTypingAnimation,
    resetTypingAnimation: reset,
    setDisplayText,
    setIsTypingComplete,
    setIsHighlightingComplete,
  };
};

export default useTypewriter;
