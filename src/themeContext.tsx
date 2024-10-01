// ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { THEME } from "@excalidraw/excalidraw";

interface ThemeContextType {
  theme: string | undefined;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>(THEME.LIGHT);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || THEME.LIGHT;
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
