'use client';

import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class" forcedTheme="dark">
      {children}
    </ThemeProvider>
  );
}
