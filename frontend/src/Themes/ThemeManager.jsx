/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useMemo, useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { darkTheme, lightTheme } from './themes.js'; // <-- added .js

export const ThemeContext = createContext();

const ThemeManager = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentTheme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, token: currentTheme.token }}>
      <ConfigProvider theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeManager;
