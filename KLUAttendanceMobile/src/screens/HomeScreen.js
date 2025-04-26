import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Attendance Calculator</Text>
          <View style={styles.titleUnderline} />
          <Text style={styles.subtitle}>
            Calculate your attendance percentage and check eligibility for exams based on the University attendance policy.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Simple Calculator Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Simple')}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="calculator-outline" size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>Simple Attendance Calculator</Text>
            </View>
            <Text style={styles.cardDescription}>
              Quick calculation of your attendance percentage
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>Enter total classes and classes attended</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>Get instant calculation of attendance percentage</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>See eligibility status with color-coded alerts</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Use Simple Calculator</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* LTPS Calculator Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('LTPS')}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="school-outline" size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>LTPS Calculator</Text>
            </View>
            <Text style={styles.cardDescription}>
              Calculate attendance with different component weights
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>Enter attendance for each component (Lecture, Tutorial, Practical, Skilling)</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>See individual component percentages</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>Get the final weighted attendance calculation</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Use LTPS Calculator</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.policyContainer}>
          <View style={styles.policyHeader}>
            <Ionicons name="school" size={24} color="#ef4444" />
            <Text style={styles.policyTitle}>Attendance Policy</Text>
          </View>
          
          <View style={styles.policyItem}>
            <View style={[styles.policyBullet, { backgroundColor: '#22c55e20' }]}>
              <View style={[styles.policyBulletInner, { backgroundColor: '#22c55e' }]} />
            </View>
            <View>
              <Text style={styles.policyItemTitle}>Eligible (≥85%)</Text>
              <Text style={styles.policyItemText}>
                Your attendance is above the minimum required 85%. You are eligible to appear for the examination.
              </Text>
            </View>
          </View>
          
          <View style={styles.policyItem}>
            <View style={[styles.policyBullet, { backgroundColor: '#eab30820' }]}>
              <View style={[styles.policyBulletInner, { backgroundColor: '#eab308' }]} />
            </View>
            <View>
              <Text style={styles.policyItemTitle}>Conditional Eligibility (75-85%)</Text>
              <Text style={styles.policyItemText}>
                Your attendance is between 75% and 85%. You need to pay a condonation fine to be eligible for the examination.
              </Text>
            </View>
          </View>
          
          <View style={styles.policyItem}>
            <View style={[styles.policyBullet, { backgroundColor: '#ef444420' }]}>
              <View style={[styles.policyBulletInner, { backgroundColor: '#ef4444' }]} />
            </View>
            <View>
              <Text style={styles.policyItemTitle}>Not Eligible (〈75%)</Text>
              <Text style={styles.policyItemText}>
                Your attendance is below 75%. You may face detention and will not be eligible to appear for the examination.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  titleUnderline: {
    height: 2,
    width: 120,
    backgroundColor: '#ef4444',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#111827',
  },
  cardDescription: {
    color: '#4b5563',
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginTop: 6,
    marginRight: 8,
  },
  featureText: {
    color: '#4b5563',
    flexShrink: 1,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  policyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#111827',
  },
  policyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  policyBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  policyBulletInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  policyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  policyItemText: {
    color: '#4b5563',
    flexShrink: 1,
  },
}); 