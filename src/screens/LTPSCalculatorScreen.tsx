import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LTPSCalculatorScreen() {
  const [subjectName, setSubjectName] = useState('');
  const [lecture, setLecture] = useState('');
  const [tutorial, setTutorial] = useState('');
  const [practical, setPractical] = useState('');
  const [skilling, setSkilling] = useState('');
  const [result, setResult] = useState<{ percentage: number; status: string } | null>(null);

  const calculateAttendance = () => {
    const lectureVal = parseFloat(lecture);
    const tutorialVal = parseFloat(tutorial);
    const practicalVal = parseFloat(practical);
    const skillingVal = parseFloat(skilling);

    if (isNaN(lectureVal) || isNaN(tutorialVal) || isNaN(practicalVal) || isNaN(skillingVal)) {
      setResult(null);
      return;
    }

    // Calculate weighted average
    const weightedPercentage = (
      (lectureVal * 0.4) + // 40% weight for lecture
      (tutorialVal * 0.2) + // 20% weight for tutorial
      (practicalVal * 0.3) + // 30% weight for practical
      (skillingVal * 0.1)   // 10% weight for skilling
    );

    let status = '';
    if (weightedPercentage >= 85) {
      status = 'Eligible for Exams';
    } else if (weightedPercentage >= 75) {
      status = 'Eligible with Warning';
    } else {
      status = 'Not Eligible';
    }

    setResult({ percentage: weightedPercentage, status });
    saveDraft();
  };

  const saveDraft = async () => {
    try {
      const draft = {
        subjectName,
        lecture,
        tutorial,
        practical,
        skilling,
        timestamp: new Date().toISOString(),
      };

      const existingDrafts = await AsyncStorage.getItem('ltps_drafts');
      const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
      drafts.push(draft);
      await AsyncStorage.setItem('ltps_drafts', JSON.stringify(drafts));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>LTPS Calculator</Text>

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
        <Text style={styles.label}>Lecture Attendance (%)</Text>
        <TextInput
          style={styles.input}
          value={lecture}
          onChangeText={setLecture}
          keyboardType="numeric"
          placeholder="Enter lecture attendance"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tutorial Attendance (%)</Text>
        <TextInput
          style={styles.input}
          value={tutorial}
          onChangeText={setTutorial}
          keyboardType="numeric"
          placeholder="Enter tutorial attendance"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Practical Attendance (%)</Text>
        <TextInput
          style={styles.input}
          value={practical}
          onChangeText={setPractical}
          keyboardType="numeric"
          placeholder="Enter practical attendance"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Skilling Attendance (%)</Text>
        <TextInput
          style={styles.input}
          value={skilling}
          onChangeText={setSkilling}
          keyboardType="numeric"
          placeholder="Enter skilling attendance"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateAttendance}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Weighted Attendance: {result.percentage.toFixed(2)}%
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