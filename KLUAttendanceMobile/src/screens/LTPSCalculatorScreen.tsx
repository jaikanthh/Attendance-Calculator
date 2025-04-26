import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ComponentState {
  percentage: string;
}

interface ComponentsState {
  lecture: ComponentState;
  tutorial: ComponentState;
  practical: ComponentState;
  skilling: ComponentState;
}

const LTPSCalculatorScreen = () => {
  const [components, setComponents] = useState<ComponentsState>({
    lecture: { percentage: '' },
    tutorial: { percentage: '' },
    practical: { percentage: '' },
    skilling: { percentage: '' }
  });
  const [subjectName, setSubjectName] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [finalAttendance, setFinalAttendance] = useState<number>(0);
  
  const handleChange = (component: keyof ComponentsState, value: string) => {
    // Validate input
    if (value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    
    setComponents({
      ...components,
      [component]: { percentage: value }
    });
  };
  
  const calculateAttendance = () => {
    // Check if at least one component has a value
    const hasValue = Object.values(components).some(comp => comp.percentage !== '');
    
    if (!hasValue) {
      Alert.alert('Missing Input', 'Please enter attendance percentage for at least one component.');
      return;
    }
    
    // Track which components are provided by the user
    const hasLecture = components.lecture.percentage !== '';
    const hasTutorial = components.tutorial.percentage !== '';
    const hasPractical = components.practical.percentage !== '';
    const hasSkilling = components.skilling.percentage !== '';

    // Parse percentage values or use 0 for missing values
    const lecturePercentage = parseFloat(components.lecture.percentage) || 0;
    const tutorialPercentage = parseFloat(components.tutorial.percentage) || 0;
    const practicalPercentage = parseFloat(components.practical.percentage) || 0;
    const skillingPercentage = parseFloat(components.skilling.percentage) || 0;

    // Calculate total weight of provided components
    let totalWeight = 0;
    if (hasLecture) totalWeight += 1.0;  // Lecture weight: 100%
    if (hasTutorial) totalWeight += 0.25;  // Tutorial weight: 25%
    if (hasPractical) totalWeight += 0.5;  // Practical weight: 50%
    if (hasSkilling) totalWeight += 0.25;  // Skilling weight: 25%

    // If no components are provided, return 0
    if (totalWeight === 0) {
      setFinalAttendance(0);
      setShowResult(true);
      return;
    }

    // Calculate weighted attendance
    let weightedAttendance = 0;
    if (hasLecture) weightedAttendance += (lecturePercentage * 1.0);
    if (hasTutorial) weightedAttendance += (tutorialPercentage * 0.25);
    if (hasPractical) weightedAttendance += (practicalPercentage * 0.5);
    if (hasSkilling) weightedAttendance += (skillingPercentage * 0.25);

    const finalResult = weightedAttendance / totalWeight;
    setFinalAttendance(finalResult);
    setShowResult(true);
    
    // Save result if subject name is provided
    if (subjectName.trim()) {
      saveResult(finalResult);
    }
  };
  
  const saveResult = async (attendance: number) => {
    try {
      const savedResultsJson = await AsyncStorage.getItem('ltpsCalculatorResults');
      let savedResults = savedResultsJson ? JSON.parse(savedResultsJson) : [];
      
      const newResult = {
        id: Date.now().toString(),
        subject: subjectName,
        components: {
          lecture: components.lecture.percentage,
          tutorial: components.tutorial.percentage,
          practical: components.practical.percentage,
          skilling: components.skilling.percentage,
        },
        attendance,
        date: new Date().toLocaleDateString()
      };
      
      // Check if subject already exists
      const existingIndex = savedResults.findIndex(
        (r: any) => r.subject.toLowerCase() === subjectName.toLowerCase()
      );
      
      if (existingIndex !== -1) {
        savedResults[existingIndex] = newResult;
      } else {
        savedResults.push(newResult);
      }
      
      await AsyncStorage.setItem('ltpsCalculatorResults', JSON.stringify(savedResults));
    } catch (e) {
      console.error('Failed to save LTPS result', e);
    }
  };
  
  const getAttendanceStatusColor = () => {
    if (finalAttendance >= 85) return styles.textGreen;
    if (finalAttendance >= 75) return styles.textYellow;
    return styles.textRed;
  };
  
  const getAttendanceStatus = () => {
    if (finalAttendance >= 85) return "Eligible";
    if (finalAttendance >= 75) return "Conditional Eligibility";
    return "Not Eligible";
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Header title="LTPS Attendance Calculator" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.calculatorCard}>
          <Text style={styles.cardTitle}>Calculate Attendance</Text>
          <Text style={styles.cardDescription}>Enter your attendance percentages for each component</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Lecture (100%)</Text>
            <Text style={styles.label}>Lecture Attendance (%)</Text>
            <TextInput
              style={styles.input}
              value={components.lecture.percentage}
              onChangeText={(value) => handleChange('lecture', value)}
              placeholder="Enter lecture attendance"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Tutorial (25%)</Text>
            <Text style={styles.label}>Tutorial Attendance (%)</Text>
            <TextInput
              style={styles.input}
              value={components.tutorial.percentage}
              onChangeText={(value) => handleChange('tutorial', value)}
              placeholder="Enter tutorial attendance"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Practical (50%)</Text>
            <Text style={styles.label}>Practical Attendance (%)</Text>
            <TextInput
              style={styles.input}
              value={components.practical.percentage}
              onChangeText={(value) => handleChange('practical', value)}
              placeholder="Enter practical attendance"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Skilling (25%)</Text>
            <Text style={styles.label}>Skilling Attendance (%)</Text>
            <TextInput
              style={styles.input}
              value={components.skilling.percentage}
              onChangeText={(value) => handleChange('skilling', value)}
              placeholder="Enter skilling attendance"
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
            onPress={calculateAttendance}
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>
        
        {showResult && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Final Attendance</Text>
            <View style={styles.resultContent}>
              <Text style={[styles.resultPercentage, getAttendanceStatusColor()]}>
                {finalAttendance.toFixed(2)}%
              </Text>
              <Text style={[styles.resultStatus, getAttendanceStatusColor()]}>
                {getAttendanceStatus()}
              </Text>
            </View>
            
            <View style={styles.resultSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Lecture (100%):</Text>
                <Text style={styles.summaryValue}>
                  {components.lecture.percentage ? `${components.lecture.percentage}%` : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tutorial (25%):</Text>
                <Text style={styles.summaryValue}>
                  {components.tutorial.percentage ? `${components.tutorial.percentage}%` : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Practical (50%):</Text>
                <Text style={styles.summaryValue}>
                  {components.practical.percentage ? `${components.practical.percentage}%` : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Skilling (25%):</Text>
                <Text style={styles.summaryValue}>
                  {components.skilling.percentage ? `${components.skilling.percentage}%` : 'N/A'}
                </Text>
              </View>
            </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
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
  resultCard: {
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
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111',
  },
  resultContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  resultStatus: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  resultSummary: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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

export default LTPSCalculatorScreen; 