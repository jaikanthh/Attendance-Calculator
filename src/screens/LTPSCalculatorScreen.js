import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LTPSCalculatorScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Use state objects for each component's percentage
  const [components, setComponents] = useState({
    lecture: { percentage: null },
    tutorial: { percentage: null },
    practical: { percentage: null },
    skilling: { percentage: null }
  });
  
  const [finalPercentage, setFinalPercentage] = useState(null);
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('');
  const [canMissClasses, setCanMissClasses] = useState(0);
  const [drafts, setDrafts] = useState([]);
  const [subject, setSubject] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  
  // Animation values
  const cardScale = useSharedValue(1);
  const resultScale = useSharedValue(0);
  const borderWidth = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Load drafts when component mounts
    loadDrafts();
  }, []);
  
  useEffect(() => {
    if (finalPercentage !== null) {
      // Set a constant border width instead of pulsing
      borderWidth.value = withTiming(3, { duration: 500 });
      
      // Keep only the shadow glow animation
      shadowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1, // infinite
        true // reverse
      );
    } else {
      borderWidth.value = withTiming(0);
      shadowOpacity.value = withTiming(0);
    }
  }, [finalPercentage, status]);
  
  const loadDrafts = async () => {
    try {
      const storedDrafts = await AsyncStorage.getItem('ltpsCalcDrafts');
      if (storedDrafts) {
        setDrafts(JSON.parse(storedDrafts));
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };
  
  const saveDraft = async () => {
    if (finalPercentage === null) {
      Alert.alert('Error', 'Calculate attendance first before saving draft');
      return;
    }
    
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject to save as draft');
      return;
    }
    
    const newDraft = {
      id: Date.now().toString(),
      title: subject.trim(),
      components: components,
      finalPercentage: finalPercentage,
      status: status,
      timestamp: new Date().toLocaleString()
    };
    
    const updatedDrafts = [...drafts, newDraft];
    
    try {
      await AsyncStorage.setItem('ltpsCalcDrafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      setSubject('');
      Alert.alert('Success', 'Draft saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft');
      console.error('Error saving draft:', error);
    }
  };
  
  const loadDraft = (draft) => {
    // Set values from draft
    setComponents(draft.components);
    setSubject(draft.title);
    setFinalPercentage(draft.finalPercentage);
    setStatus(draft.status);
    
    // Set status color based on percentage
    if (draft.finalPercentage >= 85) {
      setStatusColor(isDarkMode ? '#4ade80' : '#22c55e'); // Green color
    } else if (draft.finalPercentage >= 75) {
      setStatusColor(isDarkMode ? '#facc15' : '#eab308'); // Yellow color
    } else {
      setStatusColor(isDarkMode ? '#f87171' : '#ef4444'); // Red color
    }
    
    // Calculate classes that can be missed while maintaining 75%
    if (draft.components.lecture.percentage !== null) {
      const totalLectureClasses = 100; // Assuming out of 100
      const currentAttended = Math.round((draft.components.lecture.percentage / 100) * totalLectureClasses);
      const minNeededFor75 = Math.ceil(totalLectureClasses * 0.75);
      const canMiss = Math.max(0, currentAttended - minNeededFor75);
      setCanMissClasses(canMiss);
    } else {
      setCanMissClasses(0);
    }
    
    // Show the results
    resultScale.value = withTiming(1, { duration: 500 });
    setShowDrafts(false);
  };
  
  const deleteDraft = async (id) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    try {
      await AsyncStorage.setItem('ltpsCalcDrafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };
  
  const calculateFinalAttendance = () => {
    const calculateClassesFromPercentage = (percentage) => {
      if (percentage === null) return { total: 0, present: 0 };
      // Assuming a base of 100 for calculations
      const total = 100;
      const present = Math.round((percentage / 100) * total);
      return { total, present };
    };
    
    const lecture = calculateClassesFromPercentage(components.lecture.percentage);
    const tutorial = calculateClassesFromPercentage(components.tutorial.percentage);
    const practical = calculateClassesFromPercentage(components.practical.percentage);
    const skilling = calculateClassesFromPercentage(components.skilling.percentage);
    
    // Track which components are provided by the user
    const hasLecture = components.lecture.percentage !== null;
    const hasTutorial = components.tutorial.percentage !== null;
    const hasPractical = components.practical.percentage !== null;
    const hasSkilling = components.skilling.percentage !== null;
    
    // If no components are provided, show an error
    if (!hasLecture && !hasTutorial && !hasPractical && !hasSkilling) {
      Alert.alert('Error', 'Please enter at least one component percentage');
      return null;
    }
    
    // Calculate total weight of provided components
    let totalWeight = 0;
    if (hasLecture) totalWeight += 1.0;  // Lecture weight: 100%
    if (hasTutorial) totalWeight += 0.25;  // Tutorial weight: 25%
    if (hasPractical) totalWeight += 0.5;  // Practical weight: 50%
    if (hasSkilling) totalWeight += 0.25;  // Skilling weight: 25%
    
    // Calculate weighted sum only for provided components
    let weightedSum = 0;
    if (hasLecture) weightedSum += (lecture.present / lecture.total) * 1.0;
    if (hasTutorial) weightedSum += (tutorial.present / tutorial.total) * 0.25;
    if (hasPractical) weightedSum += (practical.present / practical.total) * 0.5;
    if (hasSkilling) weightedSum += (skilling.present / skilling.total) * 0.25;
    
    // Calculate final percentage based on provided components only
    return (weightedSum / totalWeight) * 100;
  };
  
  const calculateAttendance = () => {
    const calculated = calculateFinalAttendance();
    
    if (calculated === null) {
      return;
    }
    
    setFinalPercentage(calculated);
    
    // Set status and color based on percentage
    if (calculated >= 85) {
      setStatus('Eligible');
      setStatusColor(isDarkMode ? '#4ade80' : '#22c55e'); // Green color
    } else if (calculated >= 75) {
      setStatus('Conditional Eligibility');
      setStatusColor(isDarkMode ? '#facc15' : '#eab308'); // Yellow color
    } else {
      setStatus('Not Eligible');
      setStatusColor(isDarkMode ? '#f87171' : '#ef4444'); // Red color
    }
    
    // Calculate classes that can be missed while maintaining 75%
    // This is a simplified calculation for LTPS
    if (components.lecture.percentage !== null) {
      const totalLectureClasses = 100; // Assuming out of 100
      const currentAttended = Math.round((components.lecture.percentage / 100) * totalLectureClasses);
      const minNeededFor75 = Math.ceil(totalLectureClasses * 0.75);
      const canMiss = Math.max(0, currentAttended - minNeededFor75);
      setCanMissClasses(canMiss);
    } else {
      setCanMissClasses(0);
    }
    
    resultScale.value = withTiming(1, { duration: 500 });
    
    // Auto-save if subject is provided
    if (subject.trim()) {
      saveCalculation(calculated);
    }
  };
  
  const saveCalculation = async (calculatedPercentage) => {
    const newDraft = {
      id: Date.now().toString(),
      title: subject.trim(),
      components: components,
      finalPercentage: calculatedPercentage,
      status: status,
      timestamp: new Date().toLocaleString()
    };
    
    try {
      // Check if a draft with the same subject already exists
      const existingDraftIndex = drafts.findIndex(
        draft => draft.title.toLowerCase() === subject.trim().toLowerCase()
      );
      
      let updatedDrafts;
      if (existingDraftIndex !== -1) {
        // Update existing draft
        updatedDrafts = [...drafts];
        updatedDrafts[existingDraftIndex] = {
          ...updatedDrafts[existingDraftIndex],
          components: components,
          finalPercentage: calculatedPercentage,
          status: status,
          timestamp: new Date().toLocaleString()
        };
      } else {
        // Add new draft
        updatedDrafts = [...drafts, newDraft];
      }
      
      await AsyncStorage.setItem('ltpsCalcDrafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };
  
  const handleCardPressIn = () => {
    cardScale.value = withTiming(0.98, { duration: 150 });
  };
  
  const handleCardPressOut = () => {
    cardScale.value = withSpring(1, {
      damping: 14,
      stiffness: 120
    });
  };
  
  const cardAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });
  
  const resultAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: resultScale.value,
      transform: [{ scale: resultScale.value }],
    };
  });
  
  const resultCardAnimStyle = useAnimatedStyle(() => {
    return {
      borderWidth: borderWidth.value,
      borderColor: statusColor,
      shadowColor: statusColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: shadowOpacity.value,
      shadowRadius: 10,
      elevation: 5 + borderWidth.value,
    };
  });
  
  const clearInputs = () => {
    setComponents({
      lecture: { percentage: null },
      tutorial: { percentage: null },
      practical: { percentage: null },
      skilling: { percentage: null }
    });
    setSubject('');
    resultScale.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setFinalPercentage(null);
      setStatus('');
      setStatusColor('');
    }, 300);
  };
  
  const handleInputChange = (componentName, value) => {
    const numericValue = parseFloat(value);
    
    if (value === '') {
      // Allow empty input
      setComponents(prev => ({
        ...prev,
        [componentName]: { percentage: null }
      }));
      return;
    }
    
    if (isNaN(numericValue)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }
    
    if (numericValue < 0 || numericValue > 100) {
      Alert.alert('Error', 'Percentage must be between 0 and 100');
      return;
    }
    
    setComponents(prev => ({
      ...prev,
      [componentName]: { percentage: numericValue }
    }));
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          LTPS Attendance Calculator
        </Text>
        <TouchableOpacity
          style={styles.draftsButton}
          onPress={() => setShowDrafts(!showDrafts)}
        >
          <Ionicons name={showDrafts ? "close" : "bookmark-outline"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {!showDrafts ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.delay(300).duration(700).springify()}
          >
            <Animated.View
              style={[
                styles.card, 
                { backgroundColor: theme.card },
                cardAnimStyle
              ]}
              onTouchStart={handleCardPressIn}
              onTouchEnd={handleCardPressOut}
            >
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Subject (optional)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Enter subject name to save as draft"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Lecture Attendance (%)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={components.lecture.percentage !== null ? components.lecture.percentage.toString() : ''}
                    onChangeText={(value) => handleInputChange('lecture', value)}
                    keyboardType="numeric"
                    placeholder="Enter lecture attendance %"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Tutorial Attendance (%)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={components.tutorial.percentage !== null ? components.tutorial.percentage.toString() : ''}
                    onChangeText={(value) => handleInputChange('tutorial', value)}
                    keyboardType="numeric"
                    placeholder="Enter tutorial attendance %"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Practical Attendance (%)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={components.practical.percentage !== null ? components.practical.percentage.toString() : ''}
                    onChangeText={(value) => handleInputChange('practical', value)}
                    keyboardType="numeric"
                    placeholder="Enter practical attendance %"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Skilling Attendance (%)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={components.skilling.percentage !== null ? components.skilling.percentage.toString() : ''}
                    onChangeText={(value) => handleInputChange('skilling', value)}
                    keyboardType="numeric"
                    placeholder="Enter skilling attendance %"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isDarkMode ? '#ff5252' : '#d23838' }]}
                  onPress={calculateAttendance}
                >
                  <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.clearButton, { backgroundColor: theme.cardAccent }]}
                  onPress={clearInputs}
                >
                  <Text style={[styles.clearButtonText, { color: theme.textSecondary }]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            {finalPercentage !== null && (
              <Animated.View
                entering={FadeInDown.delay(200).duration(600).springify()}
              >
                <Animated.View
                  style={[
                    styles.resultCard, 
                    { backgroundColor: theme.card },
                    resultCardAnimStyle
                  ]}
                >
                  <Text style={[styles.resultTitle, { color: theme.text }]}>
                    Final Attendance
                  </Text>
                  
                  <View style={styles.resultContent}>
                    <View style={styles.resultRow}>
                      <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                        Overall Percentage:
                      </Text>
                      <Text style={[styles.resultValue, { color: theme.text }]}>
                        {finalPercentage.toFixed(2)}%
                      </Text>
                    </View>
                    
                    <View style={styles.resultRow}>
                      <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                        Status:
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {status}
                        </Text>
                      </View>
                    </View>
                    
                    {components.lecture.percentage !== null && canMissClasses > 0 && (
                      <View style={styles.resultRow}>
                        <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                          Lecture classes you can miss:
                        </Text>
                        <Text style={[styles.resultValue, { color: theme.text }]}>
                          {canMissClasses} (75%)
                        </Text>
                      </View>
                    )}
                  </View>
                </Animated.View>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
      ) : (
        <View style={styles.draftsContainer}>
          <Text style={[styles.draftsTitle, { color: theme.text }]}>Saved Drafts</Text>
          
          {drafts.length === 0 ? (
            <View style={styles.emptyDrafts}>
              <Ionicons name="bookmark" size={48} color={theme.textSecondary} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No saved drafts yet
              </Text>
            </View>
          ) : (
            <FlatList
              data={drafts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Animated.View
                  entering={FadeInDown.delay(200).duration(400).springify()}
                >
                  <View style={[styles.draftCard, { backgroundColor: theme.card }]}>
                    <TouchableOpacity
                      style={styles.draftContent}
                      onPress={() => loadDraft(item)}
                    >
                      <View>
                        <Text style={[styles.draftTitle, { color: theme.text }]}>{item.title}</Text>
                        <Text style={[styles.draftDetails, { color: theme.textSecondary }]}>
                          {`LTPS Combined • ${item.finalPercentage.toFixed(2)}%`}
                        </Text>
                        <Text style={[styles.draftDate, { color: theme.textSecondary }]}>
                          {item.timestamp}
                        </Text>
                      </View>
                      <View style={styles.draftActions}>
                        <View style={[styles.draftStatusBadge, { 
                          backgroundColor: item.finalPercentage >= 85 ? '#4ade8015' : 
                                          item.finalPercentage >= 75 ? '#facc1515' : '#f8717115'
                        }]}>
                          <Text style={[styles.draftStatusText, { 
                            color: item.finalPercentage >= 85 ? '#4ade80' : 
                                  item.finalPercentage >= 75 ? '#facc15' : '#f87171'
                          }]}>
                            {item.finalPercentage >= 85 ? 'Eligible' : 
                            item.finalPercentage >= 75 ? 'Conditional Eligibility' : 'Not Eligible'}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deleteDraft(item.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
              contentContainerStyle={styles.draftsList}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 10,
  },
  draftsButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 0, // Initial border width
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultContent: {
    marginBottom: 0,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Drafts section
  draftsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  draftsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  draftsList: {
    paddingBottom: 20,
  },
  draftCard: {
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  draftContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  draftDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  draftDate: {
    fontSize: 12,
  },
  draftActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  draftStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  draftStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  emptyDrafts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 10,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default LTPSCalculatorScreen; 