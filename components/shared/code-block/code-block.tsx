"use client";

import { useEffect, useState } from "react";
import "./code-block.css";
import { FaCheck } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { CodeBlockSkeleton } from "./code-block-skeleton";
import { shikiSingleton } from "./shiki-singleton";

export function CodeBlock({
    value,
    lang = "ts",
    showCopyButton = true,
    showBorder = true,
    setIsTransitioning,
}: {
    value: string;
    lang?: string;
    showCopyButton?: boolean;
    showBorder?: boolean;
    setIsTransitioning?: (isTransitioning: boolean) => void;
}) {
    const [html, setHtml] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setIsLoading(true);

            // Guard clause to prevent processing undefined/null/empty values
            // Shiki will throw an error if the value is not a string
            if (!value || typeof value !== "string") {
                if (isMounted) {
                    setHtml("");
                    setIsLoading(false);
                }
                return;
            }

            try {
                const code = await shikiSingleton.codeToHtml(value, lang);

                if (isMounted) {
                    setHtml(code);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    // Fallback to plain text if highlighting fails
                    setHtml(`<pre><code>${value}</code></pre>`);
                    setIsLoading(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [value, lang]);

    useEffect(() => {
        if (setIsTransitioning && html !== "") {
            // 200ms for smoother transitions, especially on slower devices
            setTimeout(() => setIsTransitioning(false), 200);
        }
    }, [html, setIsTransitioning]);

    // Show skeleton while loading
    if (isLoading && showCopyButton) {
        return <CodeBlockSkeleton />;
    }

    return (
        <div className={`relative w-full my-2 bg-[#2d2d2d] border border-[#404040] shadow-sm ${showCopyButton ? " group" : ""} ${showCopyButton ? "rounded-lg" : "rounded-b-xl"}`}>
            <div
                className={`absolute top-0 right-0 z-10 px-4 py-1 text-xs font-mono text-gray-400 transition-opacity duration-200 opacity-100 group-hover:opacity-0 group-hover:pointer-events-none ${showCopyButton ? "" : "hidden"
                    }`}
            >
                {lang}
            </div>
            <div
                className={`absolute top-0 right-0 z-10 mx-2 my-1 text-xs font-mono transition-opacity duration-200 opacity-0 group-hover:opacity-100 cursor-pointer ${showCopyButton ? "" : "hidden"
                    }`}
            >
                <button
                    type="button"
                    onClick={() => {
                        navigator.clipboard.writeText(value);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 1000);
                    }}
                    className="px-2 py-1 text-gray-400 rounded transition cursor-pointer flex items-center gap-1"
                >
                    {isCopied ? <FaCheck size={12} /> : <MdOutlineContentCopy />}
                </button>
            </div>
            <div
                className={`shiki w-full overflow-x-auto bg-transparent py-5 px-2 text-sm`}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
