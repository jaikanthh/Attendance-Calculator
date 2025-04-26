import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import PolicyItem from '../components/PolicyItem';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.mainTitle}>Attendance Calculator</Text>
          <View style={styles.mainTitleUnderline} />
          
          <Text style={styles.description}>
            Calculate your attendance percentage and check eligibility for exams based on the University attendance policy.
          </Text>
          
          <Card
            icon="calculator-outline"
            title="Simple Attendance Calculator"
            description="Quick calculation of your attendance percentage"
            buttonText="Use Simple Calculator"
            onButtonPress={() => navigation.navigate('Attendance')}
          >
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>Enter total classes and classes attended</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>Get instant calculation of attendance percentage</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>See eligibility status with color-coded alerts</Text>
              </View>
            </View>
          </Card>
          
          <Card
            icon="book-outline"
            title="LTPS Calculator"
            description="Calculate attendance with different component weights"
            buttonText="Use LTPS Calculator"
            onButtonPress={() => {}}
          >
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>Enter attendance for each component (Lecture, Tutorial, Practical, Skilling)</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>See individual component percentages</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>Get the final weighted attendance calculation</Text>
              </View>
            </View>
          </Card>
          
          <Card
            icon="school-outline"
            title="Attendance Policy"
          >
            <View style={styles.policyList}>
              <PolicyItem 
                type="eligible"
                title="Eligible (≥85%)"
                description="Your attendance is above the minimum required 85%"
              />
              
              <PolicyItem 
                type="conditional"
                title="Conditional Eligibility (75-85%)"
                description="You need to pay a condonation fine"
              />
              
              <PolicyItem 
                type="not-eligible"
                title="Not Eligible (<75%)"
                description="Your attendance is below 75%. You may face detention."
              />
            </View>
          </Card>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Built and developed by Jayakanth Kamisetti</Text>
            <Text style={styles.copyrightText}>© 2025</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  mainTitleUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: '#e11d48',
    marginBottom: 24,
    borderRadius: 2,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  featureList: {
    marginTop: 8,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featureBullet: {
    color: '#e11d48',
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    color: '#555',
  },
  policyList: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  copyrightText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default HomeScreen; 