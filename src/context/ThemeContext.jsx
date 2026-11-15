/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import { THEME_LIGHT, THEME_DARK, THEME_STORAGE_KEY } from '../constants/themeConstants';
import { getItem, setItem } from '../utils/storageUtil';

export const ThemeContext = createContext({
  theme: THEME_LIGHT,
  isDarkMode: false,
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return getItem(THEME_STORAGE_KEY, THEME_LIGHT);
  });

  const isDarkMode = theme === THEME_DARK;

  const applyThemeStylesheet = useCallback((targetTheme) => {
    const themeLink = document.getElementById('app-theme');
    if (themeLink) {
      themeLink.href = `/themes/${targetTheme}/theme.css`;
    }
    if (targetTheme === THEME_DARK) {
      document.documentElement.classList.add('app-dark-mode');
    } else {
      document.documentElement.classList.remove('app-dark-mode');
    }
  }, []);

  useEffect(() => {
    applyThemeStylesheet(theme);
  }, [theme, applyThemeStylesheet]);

  const toggleTheme = () => {
    const nextTheme = theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    setTheme(nextTheme);
    setItem(THEME_STORAGE_KEY, nextTheme);
    applyThemeStylesheet(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
