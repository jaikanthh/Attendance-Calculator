import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PolicyType = 'eligible' | 'conditional' | 'not-eligible';

interface PolicyItemProps {
  type: PolicyType;
  title: string;
  description: string;
}

const PolicyItem = ({ type, title, description }: PolicyItemProps) => {
  const getIndicatorStyle = () => {
    switch (type) {
      case 'eligible':
        return [styles.indicator, styles.indicatorGreen];
      case 'conditional':
        return [styles.indicator, styles.indicatorYellow];
      case 'not-eligible':
        return [styles.indicator, styles.indicatorRed];
      default:
        return styles.indicator;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={getIndicatorStyle()}>
          <View style={styles.innerDot} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  indicatorGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  indicatorYellow: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  indicatorRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'currentColor',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default PolicyItem; 