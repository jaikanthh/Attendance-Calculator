import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { calculateLTPSAttendance, getAttendanceStatus, getAttendanceColor } from '../utils/attendanceUtils';

export default function LTPSCalculatorScreen() {
  const [components, setComponents] = useState({
    lecture: { percentage: null },
    tutorial: { percentage: null },
    practical: { percentage: null },
    skilling: { percentage: null }
  });
  const [subjectName, setSubjectName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [savedResults, setSavedResults] = useState([]);

  // Load saved results on initial render
  useEffect(() => {
    loadSavedResults();
  }, []);

  const loadSavedResults = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('ltpsCalculatorDrafts');
      if (jsonValue !== null) {
        setSavedResults(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load saved results', e);
    }
  };

  const saveResult = async () => {
    if (!subjectName.trim()) {
      Alert.alert('Subject Name Required', 'Please enter a subject name to save the result');
      return;
    }

    if (!hasValidInput()) {
      Alert.alert('Invalid Input', 'Please enter at least one component percentage');
      return;
    }

    const finalPercentage = calculateLTPSAttendance(components);
    
    // Check if result with the same subject name already exists
    const existingIndex = savedResults.findIndex(
      item => item.subject.toLowerCase() === subjectName.toLowerCase()
    );

    let updatedResults;
    const newResult = {
      id: Date.now().toString(),
      subject: subjectName,
      components: JSON.parse(JSON.stringify(components)), // Deep copy
      finalPercentage,
      date: new Date().toLocaleDateString()
    };

    if (existingIndex !== -1) {
      // Update existing result
      updatedResults = [...savedResults];
      updatedResults[existingIndex] = newResult;
    } else {
      // Add new result
      updatedResults = [...savedResults, newResult];
    }

    setSavedResults(updatedResults);
    
    try {
      await AsyncStorage.setItem('ltpsCalculatorDrafts', JSON.stringify(updatedResults));
      Alert.alert('Success', 'Result saved successfully');
    } catch (e) {
      console.error('Failed to save result', e);
      Alert.alert('Error', 'Failed to save the result');
    }
  };

  const deleteSavedResult = async (id) => {
    const updatedResults = savedResults.filter(item => item.id !== id);
    setSavedResults(updatedResults);
    
    try {
      await AsyncStorage.setItem('ltpsCalculatorDrafts', JSON.stringify(updatedResults));
    } catch (e) {
      console.error('Failed to delete result', e);
    }
  };

  const loadSavedResult = (result) => {
    setComponents(result.components);
    setSubjectName(result.subject);
    setShowResult(true);
  };

  const handleInputChange = (component, value) => {
    const percentage = value === '' 
      ? null 
      : Math.min(100, Math.max(0, parseFloat(value) || 0));
      
    setComponents(prev => ({
      ...prev,
      [component]: { percentage }
    }));
  };

  const hasValidInput = () => {
    return components.lecture.percentage !== null || 
           components.tutorial.percentage !== null || 
           components.practical.percentage !== null || 
           components.skilling.percentage !== null;
  };

  const handleCalculate = () => {
    if (!hasValidInput()) {
      Alert.alert('Invalid Input', 'Please enter at least one component percentage');
      return;
    }

    setShowResult(true);
  };

  const finalPercentage = calculateLTPSAttendance(components);
  const status = getAttendanceStatus(finalPercentage);
  const statusColor = getAttendanceColor(finalPercentage);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>LTPS Attendance Calculator</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Calculate LTPS Attendance</Text>
            <Text style={styles.cardDescription}>
              Enter attendance percentage for each component
            </Text>
            
            <View style={styles.componentsContainer}>
              <View style={styles.componentItem}>
                <Text style={styles.label}>Lecture (L)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage"
                  keyboardType="decimal-pad"
                  value={components.lecture.percentage === null ? '' : components.lecture.percentage.toString()}
                  onChangeText={(value) => handleInputChange('lecture', value)}
                />
              </View>
              
              <View style={styles.componentItem}>
                <Text style={styles.label}>Tutorial (T)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage"
                  keyboardType="decimal-pad"
                  value={components.tutorial.percentage === null ? '' : components.tutorial.percentage.toString()}
                  onChangeText={(value) => handleInputChange('tutorial', value)}
                />
              </View>
              
              <View style={styles.componentItem}>
                <Text style={styles.label}>Practical (P)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage"
                  keyboardType="decimal-pad"
                  value={components.practical.percentage === null ? '' : components.practical.percentage.toString()}
                  onChangeText={(value) => handleInputChange('practical', value)}
                />
              </View>
              
              <View style={styles.componentItem}>
                <Text style={styles.label}>Skilling (S)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage"
                  keyboardType="decimal-pad"
                  value={components.skilling.percentage === null ? '' : components.skilling.percentage.toString()}
                  onChangeText={(value) => handleInputChange('skilling', value)}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter subject name to save"
                value={subjectName}
                onChangeText={setSubjectName}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.calculateButton}
                onPress={handleCalculate}
              >
                <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveResult}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {showResult && hasValidInput() && (
            <View style={styles.resultContainer}>
              <View style={styles.resultCard}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>LTPS Attendance Result</Text>
                  <View style={styles.percentageContainer}>
                    <Text style={[styles.percentage, { color: statusColor }]}>
                      {finalPercentage.toFixed(2)}%
                    </Text>
                    <Text style={[styles.status, { color: statusColor }]}>
                      ({status})
                    </Text>
                  </View>
                </View>

                <View style={styles.content}>
                  {components.lecture.percentage !== null && (
                    <View style={styles.componentResult}>
                      <Text style={styles.componentLabel}>Lecture (Weight: 1.0):</Text>
                      <Text style={styles.componentValue}>{components.lecture.percentage.toFixed(2)}%</Text>
                    </View>
                  )}
                  
                  {components.tutorial.percentage !== null && (
                    <View style={styles.componentResult}>
                      <Text style={styles.componentLabel}>Tutorial (Weight: 0.25):</Text>
                      <Text style={styles.componentValue}>{components.tutorial.percentage.toFixed(2)}%</Text>
                    </View>
                  )}
                  
                  {components.practical.percentage !== null && (
                    <View style={styles.componentResult}>
                      <Text style={styles.componentLabel}>Practical (Weight: 0.5):</Text>
                      <Text style={styles.componentValue}>{components.practical.percentage.toFixed(2)}%</Text>
                    </View>
                  )}
                  
                  {components.skilling.percentage !== null && (
                    <View style={styles.componentResult}>
                      <Text style={styles.componentLabel}>Skilling (Weight: 0.25):</Text>
                      <Text style={styles.componentValue}>{components.skilling.percentage.toFixed(2)}%</Text>
                    </View>
                  )}
                  
                  <View style={styles.divider} />
                  
                  <View style={styles.componentResult}>
                    <Text style={styles.finalLabel}>Final Weighted Percentage:</Text>
                    <Text style={[styles.finalValue, { color: statusColor }]}>{finalPercentage.toFixed(2)}%</Text>
                  </View>
                </View>
              </View>

              <View style={[
                styles.alert, 
                { 
                  backgroundColor: finalPercentage >= 85 
                    ? '#22c55e20' 
                    : finalPercentage >= 75 
                      ? '#eab30820' 
                      : '#ef444420'
                }
              ]}>
                {finalPercentage >= 85 ? (
                  <View style={styles.alertContent}>
                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                    <View style={styles.alertTextContainer}>
                      <Text style={styles.alertTitle}>Eligible</Text>
                      <Text style={styles.alertText}>
                        Your attendance is above the minimum required 85%. You are eligible to appear for the examination.
                      </Text>
                    </View>
                  </View>
                ) : finalPercentage >= 75 ? (
                  <View style={styles.alertContent}>
                    <Ionicons name="alert-circle" size={20} color="#eab308" />
                    <View style={styles.alertTextContainer}>
                      <Text style={styles.alertTitle}>Conditional Eligibility</Text>
                      <Text style={styles.alertText}>
                        Your attendance is between 75% and 85%. You need to pay a condonation fine to be eligible for the examination.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.alertContent}>
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                    <View style={styles.alertTextContainer}>
                      <Text style={styles.alertTitle}>Not Eligible</Text>
                      <Text style={styles.alertText}>
                        Your attendance is below 75%. You may face detention and will not be eligible to appear for the examination.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {savedResults.length > 0 && (
            <View style={styles.savedResultsContainer}>
              <Text style={styles.savedResultsTitle}>Saved Results</Text>
              
              {savedResults.map((result) => (
                <View key={result.id} style={styles.savedResultCard}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteSavedResult(result.id)}
                  >
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.savedResultContent}
                    onPress={() => loadSavedResult(result)}
                  >
                    <View style={styles.savedResultHeader}>
                      <Text style={styles.savedResultSubject}>{result.subject}</Text>
                      <Text style={[styles.savedResultPercentage, { 
                        color: result.finalPercentage >= 85 
                          ? '#22c55e' 
                          : result.finalPercentage >= 75 
                            ? '#eab308' 
                            : '#ef4444'
                      }]}>
                        {result.finalPercentage.toFixed(2)}%
                      </Text>
                    </View>
                    
                    <Text style={styles.savedResultDetails}>
                      Components: {
                        [
                          result.components.lecture.percentage !== null ? 'L' : '',
                          result.components.tutorial.percentage !== null ? 'T' : '',
                          result.components.practical.percentage !== null ? 'P' : '',
                          result.components.skilling.percentage !== null ? 'S' : ''
                        ].filter(Boolean).join(', ')
                      }
                    </Text>
                    
                    <Text style={styles.savedResultDate}>
                      Saved on: {result.date}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  titleUnderline: {
    height: 2,
    width: 100,
    backgroundColor: '#ef4444',
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
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  componentsContainer: {
    marginBottom: 16,
  },
  componentItem: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  calculateButton: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    marginTop: 8,
  },
  componentResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  componentLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  componentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  finalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  finalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alert: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  alertText: {
    fontSize: 14,
    color: '#4b5563',
  },
  savedResultsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  savedResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  savedResultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  savedResultContent: {
    padding: 16,
  },
  savedResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedResultSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  savedResultPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedResultDetails: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  savedResultDate: {
    fontSize: 12,
    color: '#6b7280',
  },
}); 