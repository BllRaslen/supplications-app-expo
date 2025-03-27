import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define theme type
export type ThemeType = 'light' | 'dark' | 'system';

// Define theme colors
export const lightTheme = {
  background: '#ffffff',
  cardBackground: '#f7f7f7',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#4a6da7',
  secondary: '#a9c1e6',
  accent: '#e8af5c',
  border: '#e0e0e0',
  success: '#4caf50',
  error: '#f44336',
  disabled: '#bbbbbb',
  button: '#5c94e8',
  buttonText: '#ffffff',
  statusBar: 'dark',
};

export const darkTheme = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  text: '#f5f5f5',
  textSecondary: '#aaaaaa',
  primary: '#6989bc',
  secondary: '#3e5a87',
  accent: '#e8af5c',
  border: '#444444',
  success: '#66bb6a',
  error: '#e57373',
  disabled: '#666666',
  button: '#5c94e8',
  buttonText: '#ffffff',
  statusBar: 'light',
};

// Context interface
interface ThemeContextType {
  isDarkMode: boolean;
  theme: typeof lightTheme;
  themeType: ThemeType;
  toggleTheme: () => void;
  setThemeType: (type: ThemeType) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  theme: lightTheme,
  themeType: 'system',
  toggleTheme: () => {},
  setThemeType: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeTypeState] = useState<ThemeType>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate if dark mode based on current settings and system
  const isDarkMode = themeType === 'dark' || (themeType === 'system' && systemColorScheme === 'dark');
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePreference');
        if (storedTheme) {
          setThemeTypeState(storedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemePreference();
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = async () => {
    try {
      const newThemeType = isDarkMode ? 'light' : 'dark';
      await AsyncStorage.setItem('themePreference', newThemeType);
      setThemeTypeState(newThemeType);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Set a specific theme type
  const setThemeType = async (type: ThemeType) => {
    try {
      await AsyncStorage.setItem('themePreference', type);
      setThemeTypeState(type);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Skip rendering until theme is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, themeType, toggleTheme, setThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
