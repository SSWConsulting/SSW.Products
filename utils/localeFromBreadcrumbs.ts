export type Locale = "en" | "zh";

/**
 * Tina `_sys.breadcrumbs` look like ["YakShaver","home"] (en) or
 * ["YakShaver","zh","home"] (zh). zh content lives only under <product>/zh.
 */
export function localeFromBreadcrumbs(breadcrumbs: string[]): Locale {
  return breadcrumbs[1] === "zh" ? "zh" : "en";
}
