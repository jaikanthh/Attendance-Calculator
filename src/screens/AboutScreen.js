import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AboutScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  const renderSection = (title, content) => {
    return (
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600)}
      >
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.sectionContent, { color: theme.textSecondary }]}>{content}</Text>
        </View>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          About
        </Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)}
        >
          <View style={[styles.appInfoCard, { backgroundColor: theme.card }]}>
            <View style={styles.appInfoContent}>
              <Text style={[styles.appName, { color: theme.text }]}>
                KL Attendance
              </Text>
              <Text style={[styles.appVersion, { color: theme.textSecondary }]}>
                Version 1.0.0
              </Text>
              <Text style={[styles.appDescription, { color: theme.textSecondary }]}>
                Your complete attendance management solution
              </Text>
            </View>
          </View>
        </Animated.View>
        
        {renderSection(
          "Attendance Policy",
          "Students are required to maintain at least 75% attendance in all courses to be eligible for examinations. Students with 85% or higher attendance receive full benefits. This app helps you track and calculate your attendance to ensure you meet these requirements."
        )}
        
        {renderSection(
          "Simple Calculator",
          "The Simple Calculator allows you to calculate your current attendance percentage based on total classes and attended classes. It also shows if you are eligible for examinations, how many classes you can afford to miss while maintaining eligibility, or how many more classes you need to attend to become eligible."
        )}
        
        {renderSection(
          "LTPS Calculator",
          "The LTPS Calculator is specifically designed for courses with Lecture, Tutorial, Practical, and Skilling components. It calculates the weighted attendance percentage according to KL University's formula, giving proper weightage to each component (100% for Lecture, 25% for Tutorial, 50% for Practical, and 25% for Skilling)."
        )}
        
        <Animated.View 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Built and Developed by
          </Text>
          <Text style={[styles.copyright, { color: theme.textSecondary }]}>
            © 2025 Jayakanth Kamisetti
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  appInfoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    padding: 20,
  },
  appInfoContent: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
  },
});

export default AboutScreen; 