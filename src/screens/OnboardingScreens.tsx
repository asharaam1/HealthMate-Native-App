import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Professional Color Palette
const COLORS = {
  primary: '#00796B',
  secondary: '#004D40',
  accent: '#26A69A',
  white: '#FFFFFF',
  lightGray: '#F0F4F4',
  textMain: '#1A2121',
  textSub: '#526161',
};

const DATA = [
  {
    id: '1',
    title: 'Unlock Your\nHealth\'s Future',
    subtitle: 'AI-Powered Insights',
    description: 'Meet HealthMate, your health companion integrated with Gemini AI for intelligent report analysis.',
    icon: '🧠',
    bg: COLORS.primary,
  },
  {
    id: '2',
    title: 'Smart Report\nAnalysis',
    subtitle: 'Upload & Track',
    description: 'Instantly upload your medical reports. AI trends your data and helps you stay proactive about your health.',
    icon: '📋',
    bg: COLORS.secondary,
  },
  {
    id: '3',
    title: 'Terms & Privacy\nFirst',
    subtitle: 'Secure & Encrypted',
    description: 'Your data is encrypted. AI analysis is for informational purposes. Consult a doctor for medical advice.',
    icon: '🛡️',
    bg: COLORS.accent,
  },
];

const OnboardingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const scrollToNext = () => {
    if (currentIndex < DATA.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onFinish();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.slide}>
      <View style={styles.topSection}>
        <View style={styles.iconCircle}>
          <Text style={styles.emoji}>{item.icon}</Text>
        </View>
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Decor */}
      <View style={[styles.bgCircle, { backgroundColor: DATA[currentIndex].bg }]} />

      <FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {DATA.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 25, 10],
              extrapolate: 'clamp',
            });
            return <Animated.View style={[styles.dot, { width: dotWidth }]} key={i} />;
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={scrollToNext} activeOpacity={0.8}>
          <Text style={styles.nextBtnText}>
            {currentIndex === DATA.length - 1 ? 'Get Started' : 'Next Step'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  bgCircle: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    opacity: 0.1,
  },
  slide: {
    width,
    alignItems: 'center'
  },
  topSection: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  emoji: {
    fontSize: 80
  },
  bottomCard: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textMain,
    lineHeight: 42,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    color: COLORS.textSub,
    lineHeight: 26,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row'
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 18,
    elevation: 5,
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 16, fontWeight: 'bold'
  },
});

export default OnboardingScreen;