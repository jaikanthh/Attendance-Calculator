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
import { calculatePercentage } from '../utils/attendanceUtils';
import { AttendanceResultCard } from '../components/AttendanceResultCard';

export default function SimpleCalculatorScreen() {
  const [totalClasses, setTotalClasses] = useState('');
  const [presents, setPresents] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [savedResults, setSavedResults] = useState([]);

  // Load saved results on initial render
  useEffect(() => {
    loadSavedResults();
  }, []);

  const loadSavedResults = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('simpleCalculatorDrafts');
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

    const totalClassesNum = parseInt(totalClasses);
    const presentsNum = parseInt(presents);

    if (isNaN(totalClassesNum) || isNaN(presentsNum) || totalClassesNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for total classes and classes attended');
      return;
    }

    const percentage = calculatePercentage(totalClassesNum, presentsNum);
    
    // Check if result with the same subject name already exists
    const existingIndex = savedResults.findIndex(
      item => item.subject.toLowerCase() === subjectName.toLowerCase()
    );

    let updatedResults;
    const newResult = {
      id: Date.now().toString(),
      subject: subjectName,
      totalClasses: totalClassesNum,
      presents: presentsNum,
      percentage,
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
      await AsyncStorage.setItem('simpleCalculatorDrafts', JSON.stringify(updatedResults));
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
      await AsyncStorage.setItem('simpleCalculatorDrafts', JSON.stringify(updatedResults));
    } catch (e) {
      console.error('Failed to delete result', e);
    }
  };

  const loadSavedResult = (result) => {
    setTotalClasses(result.totalClasses.toString());
    setPresents(result.presents.toString());
    setSubjectName(result.subject);
    setShowResult(true);
  };

  const handleCalculate = () => {
    const totalClassesNum = parseInt(totalClasses);
    const presentsNum = parseInt(presents);

    if (isNaN(totalClassesNum) || isNaN(presentsNum) || totalClassesNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for total classes and classes attended');
      return;
    }

    if (presentsNum > totalClassesNum) {
      Alert.alert('Invalid Input', 'Classes attended cannot be more than total classes');
      return;
    }

    setShowResult(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Simple Attendance Calculator</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Calculate Attendance</Text>
            <Text style={styles.cardDescription}>Enter your total classes and classes attended</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Total Classes</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter total classes"
                  keyboardType="number-pad"
                  value={totalClasses}
                  onChangeText={setTotalClasses}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Classes Attended</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter classes attended"
                  keyboardType="number-pad"
                  value={presents}
                  onChangeText={setPresents}
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
          
          {showResult && parseInt(totalClasses) > 0 && parseInt(presents) >= 0 && (
            <AttendanceResultCard 
              totalClasses={parseInt(totalClasses)}
              presents={parseInt(presents)}
              percentage={calculatePercentage(parseInt(totalClasses), parseInt(presents))}
            />
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
                        color: result.percentage >= 85 
                          ? '#22c55e' 
                          : result.percentage >= 75 
                            ? '#eab308' 
                            : '#ef4444'
                      }]}>
                        {result.percentage.toFixed(2)}%
                      </Text>
                    </View>
                    
                    <Text style={styles.savedResultDetails}>
                      Classes: {result.totalClasses} | Attended: {result.presents}
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
    flex: 1
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
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