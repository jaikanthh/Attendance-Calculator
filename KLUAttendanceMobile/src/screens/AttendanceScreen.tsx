import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceCalculator } from '../components/AttendanceCalculator';
import Header from '../components/Header';

interface SavedResult {
  id: string;
  subject: string;
  totalClasses: number;
  presents: number;
  percentage: number;
  date: string;
}

const AttendanceScreen = () => {
  const [totalClasses, setTotalClasses] = useState<string>('');
  const [presents, setPresents] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);

  useEffect(() => {
    // Load saved results when component mounts
    loadSavedResults();
  }, []);

  const loadSavedResults = async () => {
    try {
      const savedResultsJson = await AsyncStorage.getItem('simpleCalculatorDrafts');
      if (savedResultsJson) {
        const parsed = JSON.parse(savedResultsJson);
        setSavedResults(parsed);
      }
    } catch (e) {
      console.error('Failed to load saved results', e);
    }
  };

  const handleCalculate = () => {
    if (!totalClasses || !presents) {
      Alert.alert('Missing Information', 'Please enter both total classes and classes attended.');
      return;
    }

    const totalClassesNum = parseInt(totalClasses);
    const presentsNum = parseInt(presents);

    if (isNaN(totalClassesNum) || isNaN(presentsNum)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers.');
      return;
    }

    if (presentsNum > totalClassesNum) {
      Alert.alert('Invalid Input', 'Classes attended cannot be more than total classes.');
      return;
    }

    setShowResult(true);
    
    // Save result if subject name is provided
    if (subjectName.trim()) {
      saveResult(totalClassesNum, presentsNum, subjectName);
    }
  };

  const saveResult = async (totalClasses: number, presents: number, subject: string) => {
    const percentage = (presents / totalClasses) * 100;
    
    // Check if a draft with the same subject name already exists
    const existingDraftIndex = savedResults.findIndex(result => 
      result.subject.toLowerCase() === subject.toLowerCase()
    );
    
    let updatedResults;
    
    if (existingDraftIndex !== -1) {
      // Update existing draft
      updatedResults = [...savedResults];
      updatedResults[existingDraftIndex] = {
        ...updatedResults[existingDraftIndex],
        totalClasses,
        presents,
        percentage,
        date: new Date().toLocaleDateString()
      };
    } else {
      // Create new draft
      const newResult: SavedResult = {
        id: Date.now().toString(),
        subject,
        totalClasses,
        presents,
        percentage,
        date: new Date().toLocaleDateString()
      };
      
      updatedResults = [...savedResults, newResult];
    }
    
    setSavedResults(updatedResults);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('simpleCalculatorDrafts', JSON.stringify(updatedResults));
    } catch (e) {
      console.error('Failed to save results', e);
    }
  };

  const deleteSavedResult = async (id: string) => {
    const updatedResults = savedResults.filter(result => result.id !== id);
    setSavedResults(updatedResults);
    
    try {
      await AsyncStorage.setItem('simpleCalculatorDrafts', JSON.stringify(updatedResults));
    } catch (e) {
      console.error('Failed to save updated results', e);
    }
  };

  const loadSavedResult = (result: SavedResult) => {
    setTotalClasses(result.totalClasses.toString());
    setPresents(result.presents.toString());
    setSubjectName(result.subject);
    setShowResult(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Header title="Simple Attendance Calculator" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.calculatorCard}>
          <Text style={styles.cardTitle}>Calculate Attendance</Text>
          <Text style={styles.cardDescription}>Enter your total classes and classes attended</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Classes</Text>
            <TextInput
              style={styles.input}
              value={totalClasses}
              onChangeText={setTotalClasses}
              placeholder="Enter total classes"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Classes Attended</Text>
            <TextInput
              style={styles.input}
              value={presents}
              onChangeText={setPresents}
              placeholder="Enter classes attended"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject Name <Text style={styles.optionalText}>(Optional - to save as draft)</Text></Text>
            <TextInput
              style={styles.input}
              value={subjectName}
              onChangeText={setSubjectName}
              placeholder="Enter subject name to save as draft"
            />
          </View>
          
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>
        
        {showResult && parseInt(totalClasses) > 0 && parseInt(presents) >= 0 && (
          <AttendanceCalculator
            totalClasses={parseInt(totalClasses)}
            presents={parseInt(presents)}
          />
        )}
        
        {savedResults.length > 0 && (
          <View style={styles.savedResultsContainer}>
            <Text style={styles.savedResultsTitle}>Saved Subjects</Text>
            
            {savedResults.map(result => (
              <View key={result.id} style={styles.savedResultItem}>
                <TouchableOpacity 
                  style={styles.savedResultContent}
                  onPress={() => loadSavedResult(result)}
                >
                  <View style={styles.savedResultHeader}>
                    <Text style={styles.savedResultSubject}>{result.subject}</Text>
                    <Text style={styles.savedResultDate}>{result.date}</Text>
                  </View>
                  <View style={styles.savedResultDetails}>
                    <Text style={styles.savedResultAttendance}>
                      Attendance: <Text style={[
                        styles.savedResultPercentage,
                        result.percentage >= 85 ? styles.textGreen :
                        result.percentage >= 75 ? styles.textYellow : styles.textRed
                      ]}>
                        {result.percentage.toFixed(2)}%
                      </Text>
                    </Text>
                    <Text style={styles.savedResultStats}>
                      {result.presents}/{result.totalClasses} classes
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSavedResult(result.id)}
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  calculatorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  optionalText: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  calculateButton: {
    backgroundColor: '#e11d48',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedResultsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  savedResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  savedResultItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  savedResultContent: {
    flex: 1,
    padding: 16,
  },
  savedResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savedResultSubject: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  savedResultDate: {
    fontSize: 12,
    color: '#888',
  },
  savedResultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savedResultAttendance: {
    fontSize: 14,
  },
  savedResultPercentage: {
    fontWeight: 'bold',
  },
  savedResultStats: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#e11d48',
    fontWeight: 'bold',
    fontSize: 16,
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

export default AttendanceScreen; 