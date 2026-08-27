"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// next-themes renders an inline <script> to set the theme class before
// hydration (avoiding a flash of the wrong theme). React 19 added a warning
// for <script> tags rendered as component children that doesn't account for
// this established pattern, so it logs a false positive on every render.
// next-themes hasn't been updated since March 2025 and has no fix upstream
// (https://github.com/pacocoursey/next-themes/issues/387) — filter just this
// exact message rather than leaving noisy, unfixable console spam.
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering")) {
      return;
    }
    originalError(...args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
