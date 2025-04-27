import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightTheme = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  cardAccent: '#F1F3F5',
  text: '#212529',
  textSecondary: '#495057',
  primary: '#d23838',
  primaryLight: '#ff5252',
  border: '#E9ECEF',
  input: '#F8F9FA',
  placeholder: '#ADB5BD',
  statusGreen: '#40916c',
  statusYellow: '#e9c46a',
  statusRed: '#e63946',
};

const darkTheme = {
  background: '#121212',
  card: '#1E1E1E',
  cardAccent: '#2D2D2D',
  text: '#E9ECEF',
  textSecondary: '#ADB5BD',
  primary: '#ff5252',
  primaryLight: '#ff7b7b',
  border: '#333333',
  input: '#333333',
  placeholder: '#666666',
  statusGreen: '#52b788',
  statusYellow: '#e9c46a',
  statusRed: '#ff5252',
};

// Create context
const ThemeContext = createContext();

// Theme storage key
const THEME_PREFERENCE_KEY = 'theme_preference';

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [theme, setTheme] = useState(isDarkMode ? darkTheme : lightTheme);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedPreference !== null) {
          setIsDarkMode(savedPreference === 'dark');
        } else {
          // If no saved preference, use system default
          setIsDarkMode(colorScheme === 'dark');
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setIsLoaded(true);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Toggle theme function
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Save theme preference
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Update theme when isDarkMode changes
  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);
  
  // Only listen to system theme changes if no manual preference has been set
  useEffect(() => {
    if (!isLoaded) return;
    
    const syncWithSystemTheme = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedPreference === null) {
          // Only update based on system if no user preference is saved
          setIsDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to check theme preference:', error);
      }
    };
    
    syncWithSystemTheme();
  }, [colorScheme, isLoaded]);
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => useContext(ThemeContext); 