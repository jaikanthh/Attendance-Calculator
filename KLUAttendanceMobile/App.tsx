import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import LTPSCalculatorScreen from './src/screens/LTPSCalculatorScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#e11d48" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'home';

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Simple') {
                iconName = focused ? 'calculator' : 'calculator-outline';
              } else if (route.name === 'LTPS') {
                iconName = focused ? 'book' : 'book-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#e11d48',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#eee',
              elevation: 8,
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: -2 },
              shadowRadius: 4,
              height: 55,
              paddingBottom: 5,
              paddingTop: 5,
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: Platform.OS === 'ios' ? 20 : 0,
              left: 16,
              right: 16,
              borderRadius: 16,
              marginBottom: 10,
              zIndex: 1
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '500',
              marginBottom: 3,
            },
            headerShown: false
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
          />
          <Tab.Screen 
            name="Simple" 
            component={AttendanceScreen}
            options={{
              title: 'Simple'
            }}
          />
          <Tab.Screen 
            name="LTPS" 
            component={LTPSCalculatorScreen}
            options={{
              title: 'LTPS'
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  }
}); 