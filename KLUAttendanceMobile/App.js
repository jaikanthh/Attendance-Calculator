import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import SimpleCalculatorScreen from './src/screens/SimpleCalculatorScreen';
import LTPSCalculatorScreen from './src/screens/LTPSCalculatorScreen';

const Tab = createBottomTabNavigator();

// Simple tab bar icon component to avoid the useLocale error
const TabBarIcon = ({ name, color }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#ef4444',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#ef4444',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'KLU Attendance',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon 
                  name={focused ? 'home' : 'home-outline'} 
                  color={color} 
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Simple" 
            component={SimpleCalculatorScreen} 
            options={{ 
              title: 'Simple Calculator',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon 
                  name={focused ? 'calculator' : 'calculator-outline'} 
                  color={color} 
                />
              ),
            }}
          />
          <Tab.Screen 
            name="LTPS" 
            component={LTPSCalculatorScreen} 
            options={{ 
              title: 'LTPS Calculator',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon 
                  name={focused ? 'school' : 'school-outline'} 
                  color={color} 
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 