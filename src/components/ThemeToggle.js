import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { toggleTheme, isDarkMode, theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[
        styles.toggleButton,
        { backgroundColor: isDarkMode ? theme.cardAccent : theme.cardAccent }
      ]}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={isDarkMode ? "sunny-outline" : "moon-outline"} 
        size={20} 
        color={isDarkMode ? "#fff" : "#212529"} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle; 