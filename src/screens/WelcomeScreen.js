import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  Dimensions,
  Image
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
  withSequence, 
  withDelay,
  Easing,
  SlideInRight
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Animated values
  const logoScale = useSharedValue(1);
  const logoRotate = useSharedValue(0);
  const highlightOpacity = useSharedValue(0);
  
  // Create separate animation values for each card
  const card1Scale = useSharedValue(1);
  const card2Scale = useSharedValue(1);
  const card3Scale = useSharedValue(1);
  
  useEffect(() => {
    // Enhanced breathing animation for logo with slight rotation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite repeat
      true // reverse
    );
    
    // Remove rotation animation
    logoRotate.value = 0;
    
    // Enhanced shine effect with delay between cards
    const animateHighlight = () => {
      highlightOpacity.value = withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(0.5, { duration: 1500 }),
        withTiming(0, { duration: 1500 }, (finished) => {
          if (finished) {
            setTimeout(animateHighlight, 4000);
          }
        })
      );
    };
    
    setTimeout(animateHighlight, 2000);
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: logoScale.value },
        { rotate: `${logoRotate.value}rad` }
      ],
    };
  });
  
  // Card press handlers for each card
  const handleCard1PressIn = () => {
    card1Scale.value = withTiming(0.95, { duration: 150 });
  };

  const handleCard1PressOut = () => {
    card1Scale.value = withSpring(1, {
      damping: 14,
      stiffness: 120,
    });
  };
  
  const handleCard2PressIn = () => {
    card2Scale.value = withTiming(0.95, { duration: 150 });
  };

  const handleCard2PressOut = () => {
    card2Scale.value = withSpring(1, {
      damping: 14,
      stiffness: 120,
    });
  };
  
  const handleCard3PressIn = () => {
    card3Scale.value = withTiming(0.95, { duration: 150 });
  };

  const handleCard3PressOut = () => {
    card3Scale.value = withSpring(1, {
      damping: 14,
      stiffness: 120,
    });
  };
  
  // Create separate animated styles for each card
  const card1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: card1Scale.value }],
    };
  });
  
  const card2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: card2Scale.value }],
    };
  });
  
  const card3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: card3Scale.value }],
    };
  });
  
  const shineAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: highlightOpacity.value,
      transform: [{ translateX: withTiming(highlightOpacity.value * 200, { duration: 2000 }) }],
    };
  });

  const renderFeatureCard = (icon, title, subtitle, onPress, delay = 0, gradient = ['#ff5252', '#d23838'], cardIndex = 1) => {
    // Choose the appropriate animation style and handlers based on cardIndex
    let animStyle, pressInHandler, pressOutHandler;
    
    switch(cardIndex) {
      case 1:
        animStyle = card1AnimatedStyle;
        pressInHandler = handleCard1PressIn;
        pressOutHandler = handleCard1PressOut;
        break;
      case 2:
        animStyle = card2AnimatedStyle;
        pressInHandler = handleCard2PressIn;
        pressOutHandler = handleCard2PressOut;
        break;
      case 3:
        animStyle = card3AnimatedStyle;
        pressInHandler = handleCard3PressIn;
        pressOutHandler = handleCard3PressOut;
        break;
      default:
        animStyle = card1AnimatedStyle;
        pressInHandler = handleCard1PressIn;
        pressOutHandler = handleCard1PressOut;
    }
    
    return (
      <Animated.View
        entering={FadeInUp.delay(400 + delay).duration(700).springify()}
      >
        <Animated.View style={[animStyle]}>
          <TouchableOpacity
            style={[styles.featureCard, { 
              backgroundColor: theme.card,
              shadowColor: isDarkMode ? gradient[0] : '#000',
              shadowOpacity: isDarkMode ? 0.2 : 0.1,
              borderColor: isDarkMode ? 'rgba(255,82,82,0.6)' : 'rgba(210,56,56,0.4)',
              borderWidth: 2
            }]}
            onPress={onPress}
            onPressIn={pressInHandler}
            onPressOut={pressOutHandler}
            activeOpacity={0.9}
          >
            <View style={[styles.cardGradient, { 
              backgroundColor: isDarkMode ? 'rgba(150,150,150,0.08)' : 'rgba(240,240,240,0.6)' 
            }]} />
            
            <Animated.View style={[styles.cardShine, shineAnimatedStyle]} />
            
            <View style={styles.featureIconContainer}>
              <View style={styles.iconGlow}>
                <Ionicons name={icon} size={30} color={isDarkMode ? '#ff5252' : '#d23838'} />
              </View>
            </View>
            
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                {title}
              </Text>
              <Text style={[styles.featureSubtitle, { color: theme.textSecondary }]}>
                {subtitle}
              </Text>
            </View>
            
            <Animated.View 
              entering={SlideInRight.delay(600 + delay).duration(500)}
              style={styles.featureArrow}
            >
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? theme.textSecondary : '#b72f2f'} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(300).duration(800).springify()}
        >
          <Animated.View
            style={[styles.logoContainer, logoAnimatedStyle]}
          >
            {/* Use the actual logo image instead of placeholder */}
            <Image 
              source={require('../../assets/icon.png')} 
              style={[styles.logoImage, {
                backgroundColor: isDarkMode ? '#FFFFFF' : 'transparent'
              }]}
              resizeMode="contain"
            />
            
            {/* Subtle ring around logo */}
            <View style={[styles.logoRing, { 
              borderColor: isDarkMode ? 'rgba(255,82,82,0.6)' : 'rgba(210,56,56,0.4)',
              borderWidth: 2.5
            }]} />
          </Animated.View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(800).springify()}
          style={styles.welcomeTextContainer}
        >
          {/* Simple text instead of masked view */}
          <Text style={[styles.welcomeText, {
            fontWeight: 'bold',
            color: isDarkMode ? '#ff5252' : '#d23838'
          }]}>
            Attendance Calculator
          </Text>
          
          <Text style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
            Calculate your attendance details with ease
          </Text>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {renderFeatureCard(
            'calculator',
            'Simple Calculator',
            'Calculate With Attended Classes and Total Classes',
            () => navigation.navigate('SimpleCalculator'),
            0,
            [isDarkMode ? '#5282ff' : '#3852d2', isDarkMode ? '#3867ff' : '#2e45b7'],
            1
          )}
          
          {renderFeatureCard(
            'school-outline',
            'LTPS Calculator',
            'Calculate Using LTPS Components',
            () => navigation.navigate('LTPSCalculator'),
            100,
            [isDarkMode ? '#38b8d2' : '#2e8a99', isDarkMode ? '#2eadc9' : '#287686'],
            2
          )}
          
          {renderFeatureCard(
            'settings-outline',
            'Settings',
            'Change app preferences',
            () => navigation.navigate('Settings'),
            200,
            [isDarkMode ? '#52b788' : '#2e8a5c', isDarkMode ? '#40916c' : '#287652'],
            3
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
    overflow: 'visible',
    padding: 20,
    position: 'relative',
  },
  logoImage: {
    width: 190,
    height: 140,
    borderRadius: 95,
  },
  logoRing: {
    position: 'absolute',
    width: 210,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    opacity: 1.0,
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 0.5,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  cardShine: {
    position: 'absolute',
    left: -100,
    top: 0,
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 2,
  },
  featureIconContainer: {
    marginRight: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  iconGlow: {
    shadowColor: '#ff5252',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  featureTextContainer: {
    flex: 1,
    zIndex: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureSubtitle: {
    fontSize: 14,
  },
  featureArrow: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    zIndex: 3,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
  },
});

export default WelcomeScreen; 