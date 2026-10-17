import React, { createContext, useContext, useState } from 'react';
import { darkColors, lightColors } from './colors';

type Theme = 'dark' | 'light';
const ThemeContext = createContext<{ theme: Theme; colors: typeof darkColors; toggle: () => void }>({
  theme: 'dark', colors: darkColors, toggle: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('dark');
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const colors = theme === 'dark' ? darkColors : lightColors;
  return <ThemeContext.Provider value={{ theme, colors, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }