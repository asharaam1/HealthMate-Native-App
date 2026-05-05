import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { useVitals } from '../hooks/useVitals';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { ReportCard } from '../components/ReportCard';
import api from '../api/api';

const { width, height } = Dimensions.get('window');

// ============ Animated Components ============
const FadeInView = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

const PulseAnimation = ({ children }: { children: React.ReactNode }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  );
};

// ============ Components ============
const Header = ({ userName, profileImage, onPress }: any) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Animated.View
      style={[
        styles.header,
        { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={onPress} style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={[colors.white, colors.primaryLight]}
                style={styles.avatarPlaceholder}
              >
                <Text style={styles.avatarText}>
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const HealthScoreCard = ({
  score,
  trend,
}: {
  score: number;
  trend: 'up' | 'down' | 'stable';
}) => {
  const { colors } = useTheme();
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <FadeInView delay={100}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.scoreCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[styles.scoreRing, { transform: [{ rotate: spin }] }]}
        >
          <Icon name="heart-pulse" size={50} color={colors.white} />
        </Animated.View>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreLabel}>Health Score</Text>
        <View style={styles.trendContainer}>
          <Icon
            name={
              trend === 'up'
                ? 'trending-up'
                : trend === 'down'
                ? 'trending-down'
                : 'minus'
            }
            size={16}
            color={colors.white}
          />
          <Text style={styles.trendText}>
            {trend === 'up'
              ? 'Better than last week'
              : trend === 'down'
              ? 'Needs attention'
              : 'Stable'}
          </Text>
        </View>
      </LinearGradient>
    </FadeInView>
  );
};

const QuickActionCard = ({ icon, title, subtitle, onPress, color }: any) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[color, color + '80']}
          style={styles.actionIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name={icon} size={28} color={colors.white} />
        </LinearGradient>
        <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============ Main Component ============
export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const {
    isLoading: reportsLoading,
    refreshing,
    refresh,
    analyzedCount,
  } = useReports();
  const { vitals, isLoading: vitalsLoading } = useVitals();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports?limit=5');
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, []),
  );

  const recentReports = reports.slice(0, 5);

  if (reportsLoading && vitalsLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
            Loading Health Data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const healthScore =
    analyzedCount > 0 ? Math.min(100, 60 + analyzedCount * 5) : 85;
  // const recentReports =
  //   reports && reports.length > 0 ? reports.slice(0, 5) : [];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
      >
        <Header
          userName={user?.name?.split(' ')[0] || 'User'}
          profileImage={user?.profileImage}
          onPress={() => navigation.navigate('Profile')}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsScroll}
        >
          <QuickActionCard
            icon="cloud-upload"
            title="Upload Report"
            subtitle="AI will analyze"
            onPress={() => navigation.navigate('Upload')}
            color="#10B981"
          />
          <QuickActionCard
            icon="heart-pulse"
            title="Add Vitals"
            subtitle="Track health"
            onPress={() =>
              navigation.navigate('Vitals', { screen: 'AddVitals' })
            }
            color="#3B82F6"
          />
          <QuickActionCard
            icon="file-document"
            title="View Reports"
            subtitle={`${reports.length} reports`}
            onPress={() => navigation.navigate('Timeline')}
            color="#8B5CF6"
          />
        </ScrollView>

        <HealthScoreCard
          score={healthScore}
          trend={analyzedCount > 5 ? 'up' : 'stable'}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Reports
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Timeline')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {recentReports.length === 0 ? (
            <FadeInView delay={200}>
              <LinearGradient
                colors={[colors.card, colors.backgroundSecond]}
                style={styles.emptyState}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon
                  name="file-document-outline"
                  size={60}
                  color={colors.textTertiary}
                />
                <Text
                  style={[styles.emptyTitle, { color: colors.textPrimary }]}
                >
                  No Reports Yet
                </Text>
                <Text
                  style={[styles.emptyDesc, { color: colors.textSecondary }]}
                >
                  Upload your first report to get AI insights
                </Text>
                <TouchableOpacity
                  style={[
                    styles.emptyButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => navigation.navigate('Upload')}
                >
                  <Text
                    style={[styles.emptyButtonText, { color: colors.white }]}
                  >
                    Upload Now
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </FadeInView>
          ) : (
            recentReports.map((report, index) => (
              <ReportCard
                key={report._id}
                report={report}
                onPress={() =>
                  navigation.navigate('ReportDetail', { reportId: report._id })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: { fontSize: 14 },

  header: { width: '100%' },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  userName: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 4 },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#10B981' },

  actionsScroll: { paddingHorizontal: 16, paddingVertical: 20, gap: 16 },
  actionCard: {
    width: width * 0.28,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  actionSubtitle: { fontSize: 10, textAlign: 'center' },

  scoreCard: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 24,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  scoreRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scoreValue: { fontSize: 48, fontWeight: '800', color: '#fff', marginTop: 16 },
  scoreLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: { fontSize: 11, color: '#fff' },

  section: { paddingHorizontal: 20, marginTop: 16, marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 13, fontWeight: '600' },

  reportCard: {
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  reportIcon: { fontSize: 28 },
  reportInfo: { flex: 1, gap: 2 },
  reportTitle: { fontSize: 15, fontWeight: '600' },
  reportDate: { fontSize: 12 },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reportBadgeText: { fontSize: 9, fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 24,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  emptyButton: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 25 },
  emptyButtonText: { fontSize: 14, fontWeight: '600' },
});
