import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { KLULogo } from '../../assets/klu-logo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ title = '' }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.header, 
        { 
          paddingTop: Platform.OS === 'ios' ? 60 : 10,
          height: Platform.OS === 'ios' ? 120 : 70
        }
      ]}>
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={() => navigation.navigate('Home')}
        >
          <KLULogo width={110} height={40} />
        </TouchableOpacity>
        
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="sunny-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => {}}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {title ? (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.titleUnderline} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    backgroundColor: '#e11d48',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  menuButton: {
    padding: 4,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  titleUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: '#e11d48',
    borderRadius: 2,
  },
});

export default Header; 