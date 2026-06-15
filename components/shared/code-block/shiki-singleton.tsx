import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { type Highlighter, createHighlighter } from "shiki";

class ShikiSingleton {
  private highlighter: Highlighter | null = null;
  private supportedLangs = new Set<string>();
  private readonly themes = ["dark-plus"];
  private initPromise: Promise<void> | null = null;

  private async initializeHighlighter(initialLang: string): Promise<void> {
    if (this.highlighter) return;

    this.highlighter = await createHighlighter({
      themes: this.themes,
      langs: [initialLang],
    });
    this.supportedLangs.add(initialLang);
  }

  private async ensureLanguageLoaded(lang: string): Promise<string> {
    if (!this.highlighter) {
      throw new Error("Highlighter not initialized");
    }

    if (!this.supportedLangs.has(lang)) {
      try {
        await this.highlighter.loadLanguage(lang as any);
        this.supportedLangs.add(lang);
        return lang;
      } catch {
        // Fallback to a default language if the requested one fails
        if (!this.supportedLangs.has("text")) {
          await this.highlighter.loadLanguage("text" as any);
          this.supportedLangs.add("text");
        }
        return "text";
      }
    }

    return lang;
  }

  async getHighlighter(lang: string): Promise<Highlighter> {
    // If no highlighter exists, initialize it
    if (!this.highlighter) {
      // Prevent multiple simultaneous initializations
      if (!this.initPromise) {
        this.initPromise = this.initializeHighlighter(lang).catch((error) => {
          this.initPromise = null;
          throw error;
        });
      }
      try {
        await this.initPromise;
      } catch {
        // Fallback to text if initialization fails
        if (!this.highlighter && lang !== "text") {
          return this.getHighlighter("text");
        }
      }
    }

    // Ensure the required language is loaded
    await this.ensureLanguageLoaded(lang);

    if (!this.highlighter) {
      throw new Error("Failed to initialize highlighter");
    }

    return this.highlighter;
  }

  async codeToHtml(code: string, lang: string): Promise<string> {
    const highlighter = await this.getHighlighter(lang);
    const loadedLang = await this.ensureLanguageLoaded(lang);

    return highlighter.codeToHtml(code, {
      lang: loadedLang,
      theme: "dark-plus",
      transformers: [
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        transformerNotationHighlight({ matchAlgorithm: "v3" }),
        transformerNotationFocus({ matchAlgorithm: "v3" }),
      ],
      meta: {
        showLineNumbers: true,
      },
    });
  }

  dispose(): void {
    if (this.highlighter) {
      this.highlighter.dispose();
      this.highlighter = null;
      this.supportedLangs.clear();
      this.initPromise = null;
    }
  }

  getLoadedLanguages(): string[] {
    return Array.from(this.supportedLangs);
  }
}

// Export the singleton instance
export const shikiSingleton = new ShikiSingleton();
