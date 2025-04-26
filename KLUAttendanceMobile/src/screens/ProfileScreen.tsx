import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedResult {
  id: string;
  subject: string;
  totalClasses: number;
  presents: number;
  percentage: number;
  date: string;
}

const ProfileScreen = () => {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [averageAttendance, setAverageAttendance] = useState<number>(0);

  useEffect(() => {
    loadSavedResults();
  }, []);

  const loadSavedResults = async () => {
    try {
      const savedResultsJson = await AsyncStorage.getItem('simpleCalculatorDrafts');
      if (savedResultsJson) {
        const parsed = JSON.parse(savedResultsJson);
        setSavedResults(parsed);
        
        // Calculate average attendance
        if (parsed.length > 0) {
          const total = parsed.reduce((sum: number, item: SavedResult) => sum + item.percentage, 0);
          setAverageAttendance(total / parsed.length);
        }
      }
    } catch (e) {
      console.error('Failed to load saved results', e);
    }
  };

  const clearAllResults = async () => {
    Alert.alert(
      'Clear All Saved Subjects',
      'Are you sure you want to delete all saved subjects?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('simpleCalculatorDrafts');
              setSavedResults([]);
              setAverageAttendance(0);
            } catch (e) {
              console.error('Failed to clear data', e);
            }
          },
        },
      ]
    );
  };

  const getOverallStatusColor = () => {
    if (averageAttendance >= 85) return styles.textGreen;
    if (averageAttendance >= 75) return styles.textYellow;
    return styles.textRed;
  };

  const getOverallStatus = () => {
    if (averageAttendance >= 85) return "Excellent";
    if (averageAttendance >= 75) return "Good";
    return "Needs Improvement";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.titleUnderline} />
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Overview</Text>
          
          {savedResults.length > 0 ? (
            <>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Total Subjects:</Text>
                <Text style={styles.overviewValue}>{savedResults.length}</Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Average Attendance:</Text>
                <Text style={[styles.overviewValue, getOverallStatusColor()]}>
                  {averageAttendance.toFixed(2)}%
                </Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Overall Status:</Text>
                <Text style={[styles.overviewValue, getOverallStatusColor()]}>
                  {getOverallStatus()}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearAllResults}
              >
                <Text style={styles.clearButtonText}>Clear All Saved Subjects</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No saved subjects found. Go to the Attendance Calculator tab to add subjects.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About KLU Attendance</Text>
          <Text style={styles.infoText}>
            • At least 85% attendance is required to be fully eligible for exams
          </Text>
          <Text style={styles.infoText}>
            • Between 75-85% attendance requires payment of condonation fee
          </Text>
          <Text style={styles.infoText}>
            • Below 75% attendance means you may be detained
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            KLU Attendance Calculator v1.0
          </Text>
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
    padding: 16,
  },
  header: {
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  titleUnderline: {
    height: 2,
    width: '50%',
    backgroundColor: '#e11d48',
    marginTop: 5,
    borderRadius: 2,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  overviewLabel: {
    fontSize: 16,
    color: '#555',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: '#e11d48',
    fontWeight: '500',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  textGreen: {
    color: '#22c55e',
  },
  textYellow: {
    color: '#eab308',
  },
  textRed: {
    color: '#ef4444',
  },
});

export default ProfileScreen; 