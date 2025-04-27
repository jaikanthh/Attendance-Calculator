import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider } from './src/context/ThemeContext';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import SimpleCalculatorScreen from './src/screens/SimpleCalculatorScreen';
import LTPSCalculatorScreen from './src/screens/LTPSCalculatorScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import SupportScreen from './src/screens/SupportScreen';

// Enable screens for better performance
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            cardStyle: { flex: 1 },
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SimpleCalculator" component={SimpleCalculatorScreen} />
          <Stack.Screen name="LTPSCalculator" component={LTPSCalculatorScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
