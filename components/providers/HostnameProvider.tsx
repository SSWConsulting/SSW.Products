"use client";

import { createContext, useContext } from "react";

/**
 * Carries the request hostname resolved on the server down to client components.
 *
 * `window.location.hostname` is unavailable during SSR, and the .cn domains serve
 * Chinese content on unprefixed paths, so contextual links cannot be built correctly
 * from the pathname alone. Providing the hostname once per request keeps server and
 * client markup identical for every consumer of useContextualLink.
 */
const HostnameContext = createContext<string | undefined>(undefined);

export const useHostname = () => useContext(HostnameContext);

export default function HostnameProvider({
  hostname,
  children,
}: {
  hostname: string;
  children: React.ReactNode;
}) {
  return (
    <HostnameContext.Provider value={hostname}>
      {children}
    </HostnameContext.Provider>
  );
}
