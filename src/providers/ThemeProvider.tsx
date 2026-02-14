import tokens from "@/styles";
import React, { createContext, useContext } from "react";

const defaultTheme = tokens;

const ThemeContext = createContext(defaultTheme);

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme?: Partial<typeof defaultTheme>;
  children: React.ReactNode;
}) => {
  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme.colors,
      ...theme?.colors,
    },
    spacing: {
      ...defaultTheme.spacing,
      ...theme?.spacing,
    },
  };

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
