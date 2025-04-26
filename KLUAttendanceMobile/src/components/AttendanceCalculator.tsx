import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SimpleCalculatorProps {
  totalClasses: number;
  presents: number;
}

export const AttendanceCalculator = ({ totalClasses, presents }: SimpleCalculatorProps) => {
  const calculatePercentage = () => {
    if (totalClasses === 0) return 0;
    return (presents / totalClasses) * 100;
  };

  const percentage = calculatePercentage();
  
  // Calculate how many classes are needed to maintain 75% attendance (for bunking)
  const minRequiredFor75 = Math.ceil(totalClasses * 0.75);
  
  // Calculate how many classes can be missed while still maintaining 75%
  const classesCanMiss = Math.max(0, presents - minRequiredFor75);
  
  // Calculate how many more classes needed to reach 85% and 75%
  const classesToAttend85 = Math.max(0, Math.ceil(totalClasses * 0.85) - presents);
  const classesToAttend75 = Math.max(0, minRequiredFor75 - presents);

  // Determine the color and status based on attendance policy
  const getAttendanceColor = () => {
    if (percentage >= 85) return styles.textGreen;
    if (percentage >= 75) return styles.textYellow;
    return styles.textRed;
  };

  const getAttendanceStatus = () => {
    if (percentage >= 85) return "Eligible";
    if (percentage >= 75) return "Conditional Eligibility";
    return "Not Eligible";
  };

  const getAlertStyle = () => {
    if (percentage >= 85) return styles.alertGreen;
    if (percentage >= 75) return styles.alertYellow;
    return styles.alertRed;
  };

  return (
    <View style={styles.container}>
      <View style={styles.analysisCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Attendance Analysis</Text>
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageValue, getAttendanceColor()]}>
              {percentage.toFixed(2)}%
            </Text>
            <Text style={[styles.statusText, getAttendanceColor()]}>
              ({getAttendanceStatus()})
            </Text>
          </View>
        </View>
        
        <View style={styles.analysisSection}>
          <View style={styles.analysisRow}>
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
            <View style={styles.analysisTextContainer}>
              <Text style={styles.analysisTitle}>Classes Analysis</Text>
              <Text style={styles.analysisText}>
                Total Classes: {totalClasses} | Classes Attended: {presents}
              </Text>
            </View>
          </View>
          
          <View style={styles.analysisRow}>
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
            <View style={styles.analysisTextContainer}>
              <Text style={styles.analysisTitle}>Classes you can miss</Text>
              <Text style={styles.analysisText}>
                You can miss {classesCanMiss} more classes and still maintain 75% attendance.
              </Text>
            </View>
          </View>
          
          <View style={styles.analysisRow}>
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
            <View style={styles.analysisTextContainer}>
              <Text style={styles.analysisTitle}>Classes needed for 75%</Text>
              <Text style={styles.analysisText}>
                {classesToAttend75 > 0 
                  ? `You need to attend ${classesToAttend75} more classes to reach 75% attendance.` 
                  : 'You have already reached 75% attendance.'}
              </Text>
            </View>
          </View>
          
          <View style={styles.analysisRow}>
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
            <View style={styles.analysisTextContainer}>
              <Text style={styles.analysisTitle}>Classes needed for 85%</Text>
              <Text style={styles.analysisText}>
                {classesToAttend85 > 0 
                  ? `You need to attend ${classesToAttend85} more classes to reach 85% attendance.` 
                  : 'You have already reached 85% attendance.'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={[styles.alertCard, getAlertStyle()]}>
        {percentage >= 85 ? (
          <>
            <Text style={styles.alertTitle}>Eligible</Text>
            <Text style={styles.alertText}>
              Your attendance is above the minimum required 85%. You are eligible to appear for the examination.
            </Text>
          </>
        ) : percentage >= 75 ? (
          <>
            <Text style={styles.alertTitle}>Conditional Eligibility</Text>
            <Text style={styles.alertText}>
              Your attendance is between 75% and 85%. You need to pay a condonation fine to be eligible for the examination.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.alertTitle}>Not Eligible</Text>
            <Text style={styles.alertText}>
              Your attendance is below 75%. You may face detention and will not be eligible to appear for the examination.
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  analysisSection: {
    gap: 16,
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dotContainer: {
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e11d48',
  },
  analysisTextContainer: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  analysisText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  alertCard: {
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
  },
  alertGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  alertYellow: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.2)',
  },
  alertRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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