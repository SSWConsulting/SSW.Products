"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { cn } from "@utils/cn";

interface CodeBlockProps {
    language?: string;
    value: string;
    className?: string;
}

export const CodeBlock = ({ language = "text", value, className }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Map Bicep to TypeScript for better highlighting if Bicep isn't natively supported
    const normalizedLanguage = language.toLowerCase();
    const syntaxLanguage = normalizedLanguage === "bicep" ? "typescript" : normalizedLanguage;

    return (
        <div className={cn("relative group my-4 rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] max-w-full", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-600 rounded transition-colors text-gray-400 hover:text-white"
                    aria-label="Copy code"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={syntaxLanguage}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                    }}
                    wrapLines={true}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
