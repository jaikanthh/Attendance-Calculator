import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getAttendanceStatus, 
  getAttendanceColor,
  classesCanMiss,
  classesNeededToReach
} from '../utils/attendanceUtils';

export const AttendanceResultCard = ({ totalClasses, presents, percentage }) => {
  // Calculate how many classes can be missed
  const canMiss = classesCanMiss(totalClasses, presents);
  
  // Calculate classes needed to reach 85% and 75%
  const classesFor85 = classesNeededToReach(totalClasses, presents, 85);
  const classesFor75 = classesNeededToReach(totalClasses, presents, 75);
  
  // Get status and corresponding color
  const status = getAttendanceStatus(percentage);
  const statusColor = getAttendanceColor(percentage);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance Analysis</Text>
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentage, { color: statusColor }]}>
              {percentage.toFixed(2)}%
            </Text>
            <Text style={[styles.status, { color: statusColor }]}>
              ({status})
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.analysisItem}>
            <View style={styles.bulletContainer}>
              <View style={styles.bullet} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Classes Analysis</Text>
              <Text style={styles.analysisText}>
                Total Classes: {totalClasses} | Classes Attended: {presents}
              </Text>
            </View>
          </View>

          <View style={styles.analysisItem}>
            <View style={styles.bulletContainer}>
              <View style={styles.bullet} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Classes you can miss</Text>
              <Text style={styles.analysisText}>
                You can miss {canMiss} more classes and still maintain 75% attendance.
              </Text>
            </View>
          </View>

          <View style={styles.analysisItem}>
            <View style={styles.bulletContainer}>
              <View style={styles.bullet} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Classes needed for 75%</Text>
              <Text style={styles.analysisText}>
                {classesFor75 > 0 
                  ? `You need to attend ${classesFor75} more classes to reach 75% attendance.` 
                  : 'You have already reached 75% attendance.'}
              </Text>
            </View>
          </View>

          <View style={styles.analysisItem}>
            <View style={styles.bulletContainer}>
              <View style={styles.bullet} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Classes needed for 85%</Text>
              <Text style={styles.analysisText}>
                {classesFor85 > 0 
                  ? `You need to attend ${classesFor85} more classes to reach 85% attendance.` 
                  : 'You have already reached 85% attendance.'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[
        styles.alert, 
        { 
          backgroundColor: percentage >= 85 
            ? '#22c55e20' 
            : percentage >= 75 
              ? '#eab30820' 
              : '#ef444420'
        }
      ]}>
        {percentage >= 85 ? (
          <View style={styles.alertContent}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Eligible</Text>
              <Text style={styles.alertText}>
                Your attendance is above the minimum required 85%. You are eligible to appear for the examination.
              </Text>
            </View>
          </View>
        ) : percentage >= 75 ? (
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
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
  header: {
    marginBottom: 16,
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
  analysisItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bulletContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef444420',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#111827',
  },
  analysisText: {
    color: '#4b5563',
    fontSize: 14,
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
}); 