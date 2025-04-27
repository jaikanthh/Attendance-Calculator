import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  SlideInRight,
  withRepeat
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SimpleCalculatorScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [totalClasses, setTotalClasses] = useState('');
  const [presents, setPresents] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [canMissClasses, setCanMissClasses] = useState(0);
  const [classesFor75, setClassesFor75] = useState(0);
  const [classesFor85, setClassesFor85] = useState(0);
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('#000');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [subject, setSubject] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  
  // Animation values
  const cardScale = useSharedValue(1);
  const resultScale = useSharedValue(0);
  const resultTextOpacity = useSharedValue(0);
  const borderWidth = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (percentage !== null) {
      // Animate percentage when calculated
      resultScale.value = withTiming(1, { duration: 500 });
      resultTextOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    }
  }, [percentage]);
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Load drafts when component mounts
    loadDrafts();

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  useEffect(() => {
    if (percentage !== null) {
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
  }, [percentage, status]);
  
  const loadDrafts = async () => {
    try {
      const storedDrafts = await AsyncStorage.getItem('simpleCalcDrafts');
      if (storedDrafts) {
        setDrafts(JSON.parse(storedDrafts));
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };
  
  const calculateAttendance = (presentsVal = presents, totalClassesVal = totalClasses) => {
    const totalClassesNum = parseInt(totalClassesVal);
    const presentsNum = parseInt(presentsVal);
    
    // Input validation
    if (isNaN(totalClassesNum) || isNaN(presentsNum)) {
      Alert.alert("Invalid Input", "Please enter valid numbers.");
      return;
    }
    
    if (totalClassesNum < 0 || presentsNum < 0) {
      Alert.alert("Invalid Input", "Please enter non-negative values.");
      return;
    }
    
    if (presentsNum > totalClassesNum) {
      Alert.alert("Invalid Input", "Classes attended cannot be more than total classes.");
      return;
    }
    
    // Calculate percentage
    const calculatedPercentage = totalClassesNum === 0 ? 0 : (presentsNum / totalClassesNum) * 100;
    setPercentage(calculatedPercentage);
    
    // Calculate how many classes are needed to maintain 75% attendance
    const minRequiredFor75 = Math.ceil(totalClassesNum * 0.75);
    
    // Calculate how many classes can be missed while still maintaining 75%
    const canMiss = Math.max(0, presentsNum - minRequiredFor75);
    setCanMissClasses(canMiss);
    
    // Calculate classes needed for 75% and 85%
    setClassesFor75(Math.max(0, minRequiredFor75 - presentsNum));
    setClassesFor85(Math.max(0, Math.ceil(totalClassesNum * 0.85) - presentsNum));
    
    // Set status and color
    if (calculatedPercentage >= 85) {
      setStatus('Eligible');
      setStatusColor(isDarkMode ? '#4ade80' : '#22c55e'); // Green color
    } else if (calculatedPercentage >= 75) {
      setStatus('Conditional Eligibility');
      setStatusColor(isDarkMode ? '#facc15' : '#eab308'); // Yellow color
    } else {
      setStatus('Not Eligible');
      setStatusColor(isDarkMode ? '#f87171' : '#ef4444'); // Red color
    }
    
    // Animate result box appearance
    resultScale.value = withTiming(1, { duration: 500 });
    
    // Auto-save if subject is provided
    if (subject.trim()) {
      saveCalculation(calculatedPercentage);
    }
  };
  
  const saveCalculation = async (calculatedPercentage) => {
    const newDraft = {
      id: Date.now().toString(),
      title: subject.trim(),
      totalClasses: totalClasses,
      presents: presents,
      percentage: calculatedPercentage,
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
          totalClasses: totalClasses,
          presents: presents,
          percentage: calculatedPercentage,
          status: status,
          timestamp: new Date().toLocaleString()
        };
      } else {
        // Add new draft
        updatedDrafts = [...drafts, newDraft];
      }
      
      await AsyncStorage.setItem('simpleCalcDrafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };
  
  const loadDraft = (draft) => {
    // Set the values from the draft
    setTotalClasses(draft.totalClasses);
    setPresents(draft.presents);
    setSubject(draft.title);
    
    // Set the percentage and other calculated values directly from the draft
    setPercentage(draft.percentage);
    
    // Set status and color based on percentage
    if (draft.percentage >= 85) {
      setStatus('Eligible');
      setStatusColor(isDarkMode ? '#4ade80' : '#22c55e'); // Green color
    } else if (draft.percentage >= 75) {
      setStatus('Conditional Eligibility');
      setStatusColor(isDarkMode ? '#facc15' : '#eab308'); // Yellow color
    } else {
      setStatus('Not Eligible');
      setStatusColor(isDarkMode ? '#f87171' : '#ef4444'); // Red color
    }
    
    // Calculate missed classes
    const totalClassesNum = parseInt(draft.totalClasses);
    const presentsNum = parseInt(draft.presents);
    const minRequiredFor75 = Math.ceil(totalClassesNum * 0.75);
    const canMiss = Math.max(0, presentsNum - minRequiredFor75);
    setCanMissClasses(canMiss);
    setClassesFor75(Math.max(0, minRequiredFor75 - presentsNum));
    setClassesFor85(Math.max(0, Math.ceil(totalClassesNum * 0.85) - presentsNum));
    
    // Show the results
    resultScale.value = withTiming(1, { duration: 500 });
    setShowDrafts(false);
  };
  
  const deleteDraft = async (id) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    try {
      await AsyncStorage.setItem('simpleCalcDrafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Error deleting draft:', error);
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
  
  const clearInputs = () => {
    setTotalClasses('');
    setPresents('');
    setSubject('');
    resultScale.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setPercentage(null);
      setStatus('');
      setStatusColor('');
      setCanMissClasses(0);
      setClassesFor75(0);
      setClassesFor85(0);
    }, 300);
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Simple Attendance Calculator
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
          keyboardShouldPersistTaps="handled"
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
                  Classes Attended
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={presents}
                    onChangeText={setPresents}
                    keyboardType="numeric"
                    placeholder="Enter number"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Total Classes
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={totalClasses}
                    onChangeText={setTotalClasses}
                    keyboardType="numeric"
                    placeholder="Enter number"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isDarkMode ? '#ff5252' : '#d23838' }]}
                  onPress={() => calculateAttendance()}
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
            
            {/* Results Section */}
            {percentage !== null && (
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
                    Attendance Results
                  </Text>
                  
                  <View style={styles.resultContent}>
                    <View style={styles.resultRow}>
                      <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                        Your Attendance:
                      </Text>
                      <Text style={[styles.resultValue, { color: theme.text }]}>
                        {percentage.toFixed(2)}%
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
                    
                    {canMissClasses > 0 && (
                      <View style={styles.resultRow}>
                        <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                          Classes you can miss:
                        </Text>
                        <Text style={[styles.resultValue, { color: theme.text }]}>
                          {canMissClasses} (75%)
                        </Text>
                      </View>
                    )}
                    
                    {status !== 'Eligible' && (
                      <View style={styles.resultRow}>
                        <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                          Classes needed for {percentage < 75 ? '75%' : '85%'}:
                        </Text>
                        <Text style={[styles.resultValue, { color: theme.text }]}>
                          {percentage < 75 ? classesFor75 : classesFor85}
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
                  <Animated.View
                    style={[styles.draftCard, { backgroundColor: theme.card }]}
                  >
                    <TouchableOpacity
                      style={styles.draftContent}
                      onPress={() => loadDraft(item)}
                    >
                      <View>
                        <Text style={[styles.draftTitle, { color: theme.text }]}>{item.title}</Text>
                        <Text style={[styles.draftDetails, { color: theme.textSecondary }]}>
                          {`${item.presents}/${item.totalClasses} • ${item.percentage.toFixed(2)}%`}
                        </Text>
                        <Text style={[styles.draftDate, { color: theme.textSecondary }]}>
                          {item.timestamp}
                        </Text>
                      </View>
                      <View style={styles.draftActions}>
                        <View style={[styles.draftStatusBadge, { 
                          backgroundColor: item.percentage >= 85 ? '#4ade8015' : 
                                          item.percentage >= 75 ? '#facc1515' : '#f8717115'
                        }]}>
                          <Text style={[styles.draftStatusText, { 
                            color: item.percentage >= 85 ? '#4ade80' : 
                                  item.percentage >= 75 ? '#facc15' : '#f87171'
                          }]}>
                            {item.percentage >= 85 ? 'Eligible' : 
                            item.percentage >= 75 ? 'Conditional Eligibility' : 'Not Eligible'}
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
                  </Animated.View>
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
    borderWidth: 0,
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

export default SimpleCalculatorScreen; 