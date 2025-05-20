import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has a saved preference in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    // Return saved preference or use system preference as fallback
    return savedTheme !== null 
      ? JSON.parse(savedTheme)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save user preference when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 