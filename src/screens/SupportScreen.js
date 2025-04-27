import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Linking,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SupportScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  
  const sendEmail = (email) => {
    Linking.openURL(`mailto:${email}`).catch(err => console.error("Couldn't open email", err));
  };
  
  const renderSocialButton = (icon, name, url, color) => {
    return (
      <TouchableOpacity 
        style={[styles.socialButton, { backgroundColor: color }]}
        onPress={() => openLink(url)}
      >
        <Ionicons name={icon} size={22} color="#fff" style={styles.socialIcon} />
        <Text style={styles.socialText}>{name}</Text>
      </TouchableOpacity>
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
          Support
        </Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
        >
          <View style={[styles.supportCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.supportTitle, { color: theme.text }]}>
              Need Help?
            </Text>
            <Text style={[styles.supportDescription, { color: theme.textSecondary }]}>
              If you encounter any issues or have questions about the app, please contact the developer using one of the methods below.
            </Text>
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
        >
          <View style={[styles.developerSection, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Developer</Text>
            
            <View style={styles.developerCardContent}>
              <View style={[styles.developerInitials, { backgroundColor: isDarkMode ? '#ff5252' : '#d23838' }]}>
                <Text style={styles.initialsText}>JK</Text>
              </View>
              <Text style={[styles.developerName, { color: theme.text }]}>
                Jayakanth Kamisetti
              </Text>
            </View>
            
            <View style={styles.socialContainer}>
              {renderSocialButton("logo-linkedin", "LinkedIn", "https://www.linkedin.com/in/jaikanthh", "#0077B5")}
              {renderSocialButton("logo-github", "GitHub", "https://github.com/jaikanthh", "#333")}
              {renderSocialButton("logo-instagram", "Instagram", "https://www.instagram.com/jaikanthh/", "#E1306C")}
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: "#D44638" }]}
                onPress={() => sendEmail("jaikanthkamisetti@gmail.com")}
              >
                <Ionicons name="mail" size={22} color="#fff" style={styles.socialIcon} />
                <Text style={styles.socialText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
        >
          <View style={[styles.feedbackSection, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Report a Bug
            </Text>
            <Text style={[styles.feedbackText, { color: theme.textSecondary }]}>
              Found a bug or have a suggestion for improvement? Please send an email with details.
            </Text>
            
            <TouchableOpacity 
              style={[styles.reportButton, { backgroundColor: isDarkMode ? '#ff5252' : '#d23838' }]}
              onPress={() => sendEmail("jaikanthkamisetti@gmail.com?subject=KL Attendance App Feedback")}
            >
              <Ionicons name="bug-outline" size={22} color="#fff" style={styles.socialIcon} />
              <Text style={styles.reportButtonText}>Report a Bug</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
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
  supportCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    padding: 20,
  },
  supportTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  supportDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  developerSection: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  developerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  developerInitials: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '48%',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  feedbackSection: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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

export default SupportScreen; 