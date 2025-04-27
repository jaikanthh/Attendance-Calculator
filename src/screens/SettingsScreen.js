import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Switch,
  Linking,
  ToastAndroid,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [versionTapCount, setVersionTapCount] = useState(0);
  const tapTimerRef = useRef(null);
  
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  
  const handleVersionPress = () => {
    // Clear any existing timeout
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }
    
    // Increment tap count
    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);
    
    // Check if Easter egg should be shown
    if (newCount === 10) {
      // Show Easter egg message
      if (Platform.OS === 'android') {
        ToastAndroid.show('BOMBARDILO CROCODILO', ToastAndroid.LONG);
      } else {
        Alert.alert('BOMBARDILO CROCODILO', '');
      }
      // Reset counter
      setVersionTapCount(0);
      return;
    }
    
    // Set timeout to reset counter if next tap doesn't happen soon
    tapTimerRef.current = setTimeout(() => {
      setVersionTapCount(0);
    }, 2000); // Reset after 2 seconds of inactivity
  };
  
  const renderSetting = (icon, title, subtitle, action, isSwitch = false, value = false, showArrow = true) => {
    return (
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={isSwitch ? null : action}
        activeOpacity={isSwitch ? 1 : 0.7}
      >
        <View style={styles.settingLeftContent}>
          <View style={[styles.iconContainer, { backgroundColor: theme.cardAccent }]}>
            <Ionicons name={icon} size={22} color={isDarkMode ? '#ff5252' : '#d23838'} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          </View>
        </View>
        
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={action}
            trackColor={{ false: '#767577', true: isDarkMode ? '#ff5252' : '#d23838' }}
            thumbColor={'#f4f3f4'}
          />
        ) : (
          showArrow && <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        )}
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
          Settings
        </Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            APPEARANCE
          </Text>
          
          {renderSetting(
            'moon-outline',
            'Dark Mode',
            'Switch between light and dark theme',
            toggleTheme,
            true,
            isDarkMode
          )}
        </View>
        
        <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            INFORMATION
          </Text>
          
          {renderSetting(
            'information-circle-outline',
            'About',
            'Learn more about this app',
            () => navigation.navigate('About')
          )}
          
          {renderSetting(
            'heart-outline',
            'Support',
            'Get help or provide feedback',
            () => navigation.navigate('Support')
          )}
          
          {renderSetting(
            'code-slash-outline',
            'Version',
            '1.0.0',
            handleVersionPress,
            false,
            false,
            false
          )}
        </View>
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
    paddingTop: Platform.OS === 'android' ? 50 : 16,
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
  settingsSection: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
});

export default SettingsScreen; 