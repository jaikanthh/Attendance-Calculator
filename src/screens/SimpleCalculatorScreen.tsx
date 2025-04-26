import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SimpleCalculatorScreen() {
  const [totalClasses, setTotalClasses] = useState('');
  const [classesAttended, setClassesAttended] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [result, setResult] = useState<{ percentage: number; status: string } | null>(null);

  const calculateAttendance = () => {
    const total = parseFloat(totalClasses);
    const attended = parseFloat(classesAttended);

    if (isNaN(total) || isNaN(attended) || total <= 0) {
      setResult(null);
      return;
    }

    const percentage = (attended / total) * 100;
    let status = '';

    if (percentage >= 85) {
      status = 'Eligible for Exams';
    } else if (percentage >= 75) {
      status = 'Eligible with Warning';
    } else {
      status = 'Not Eligible';
    }

    setResult({ percentage, status });
    saveDraft();
  };

  const saveDraft = async () => {
    try {
      const draft = {
        totalClasses,
        classesAttended,
        subjectName,
        timestamp: new Date().toISOString(),
      };

      const existingDrafts = await AsyncStorage.getItem('drafts');
      const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
      drafts.push(draft);
      await AsyncStorage.setItem('drafts', JSON.stringify(drafts));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Simple Attendance Calculator</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subject Name (Optional)</Text>
        <TextInput
          style={styles.input}
          value={subjectName}
          onChangeText={setSubjectName}
          placeholder="Enter subject name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Classes</Text>
        <TextInput
          style={styles.input}
          value={totalClasses}
          onChangeText={setTotalClasses}
          keyboardType="numeric"
          placeholder="Enter total classes"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Classes Attended</Text>
        <TextInput
          style={styles.input}
          value={classesAttended}
          onChangeText={setClassesAttended}
          keyboardType="numeric"
          placeholder="Enter classes attended"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateAttendance}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Attendance Percentage: {result.percentage.toFixed(2)}%
          </Text>
          <Text style={styles.statusText}>Status: {result.status}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
}); 