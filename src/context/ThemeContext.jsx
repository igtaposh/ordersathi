import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context for managing dark/light mode across the application
 * Provides theme state and toggle functionality to all components
 */
const ThemeContext = createContext();

/**
 * Custom hook to use theme context
 * @returns {Object} Theme context value with theme state and toggle function
 */
export const useTheme = () => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
   }
   return context;
};

/**
 * Theme Provider Component
 * Manages global theme state and provides it to child components
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ThemeProvider component
 */
export const ThemeProvider = ({ children }) => {
   const [theme, setTheme] = useState('light');

   /**
    * Initialize theme from localStorage on provider mount
    */
   useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;

      setTheme(initialTheme);
      applyTheme(initialTheme);
   }, []);

   /**
    * Apply theme to document root
    * @param {string} newTheme - Theme to apply ('light' or 'dark')
    */
   const applyTheme = (newTheme) => {
      const root = document.documentElement;

      if (newTheme === 'dark') {
         root.classList.add('dark');
      } else {
         root.classList.remove('dark');
      }

      // Save theme preference
      localStorage.setItem('theme', newTheme);
   };

   /**
    * Toggle between light and dark themes
    */
   const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
   };

   /**
    * Set specific theme
    * @param {string} newTheme - Theme to set ('light' or 'dark')
    */
   const setSpecificTheme = (newTheme) => {
      if (newTheme === 'light' || newTheme === 'dark') {
         setTheme(newTheme);
         applyTheme(newTheme);
      }
   };

   const value = {
      theme,
      toggleTheme,
      setTheme: setSpecificTheme,
      isDark: theme === 'dark',
      isLight: theme === 'light'
   };

   return (
      <ThemeContext.Provider value={value}>
         {children}
      </ThemeContext.Provider>
   );
};

export default ThemeContext;
