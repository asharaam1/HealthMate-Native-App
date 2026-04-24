import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { useVitals } from '../hooks/useVitals';
import { Report, Vital } from '../types';
import { HomeStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

// Helpers
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// StatCard Component
const StatCard = ({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) => {
  const { colors, radius } = useTheme();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: radius.md,
        },
      ]}
    >
      <View style={[styles.statDot, { backgroundColor: bgColor }]}>
        <View style={[styles.statDotInner, { backgroundColor: color }]} />
      </View>
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

// ReportCard Component
const TYPE_ICONS: Record<string, string> = {
  'Lab Report': '🧪',
  'X-Ray': '🦴',
  Prescription: '💊',
  Ultrasound: '🔊',
  Other: '📄',
};

const ReportCard = ({
  report,
  onPress,
}: {
  report: Report;
  onPress: () => void;
}) => {
  const { colors, radius } = useTheme();
  const analyzed = report.status === 'Analyzed';
  return (
    <TouchableOpacity
      style={[
        styles.reportCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: radius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.reportIcon,
          {
            backgroundColor: colors.primaryLight,
            borderRadius: radius.md,
          },
        ]}
      >
        <Text style={{ fontSize: 22 }}>{TYPE_ICONS[report.type] ?? '📄'}</Text>
      </View>

      <View style={styles.reportInfo}>
        <Text
          style={[styles.reportTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {report.title}
        </Text>
        <Text style={[styles.reportMeta, { color: colors.textSecondary }]}>
          {report.type} · {report.date}
        </Text>
        {report.aiSummary && (
          <Text
            style={[styles.reportPreview, { color: colors.textTertiary }]}
            numberOfLines={1}
          >
            {report.aiSummary.en}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.badge,
          {
            backgroundColor: analyzed
              ? colors.statusAnalyzedBg
              : colors.statusPendingBg,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: analyzed ? colors.statusAnalyzed : colors.statusPending,
            },
          ]}
        >
          {report.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

//  VitalChip Component
const VitalChip = ({ vital }: { vital: Vital }) => {
  const { colors, radius } = useTheme();
  const map: Record<
    string,
    { color: string; bg: string; icon: string; unit: string }
  > = {
    BP: {
      color: colors.vitalBP,
      bg: colors.vitalBPBg,
      icon: '❤️',
      unit: 'mmHg',
    },
    Sugar: {
      color: colors.vitalSugar,
      bg: colors.vitalSugarBg,
      icon: '🩸',
      unit: 'mg/dL',
    },
    Weight: {
      color: colors.vitalWeight,
      bg: colors.vitalWeightBg,
      icon: '⚖️',
      unit: 'kg',
    },
    Oxygen: {
      color: colors.vitalOxygen,
      bg: colors.vitalOxygenBg,
      icon: '💨',
      unit: '%',
    },
    Other: {
      color: colors.textSecondary,
      bg: colors.backgroundThird,
      icon: '📊',
      unit: '',
    },
  };
  const c = map[vital.type] ?? map.Other;
  return (
    <View
      style={[
        styles.vitalChip,
        { backgroundColor: c.bg, borderRadius: radius.md },
      ]}
    >
      <Text style={{ fontSize: 18 }}>{c.icon}</Text>
      <View>
        <Text style={[styles.vitalLabel, { color: c.color }]}>
          {vital.type}
        </Text>
        <Text style={[styles.vitalValue, { color: c.color }]}>
          {vital.value} <Text style={{ fontSize: 10 }}>{c.unit}</Text>
        </Text>
      </View>
    </View>
  );
};

// HomeScreen
export default function HomeScreen() {
  const { colors, radius } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<HomeNavProp>();

  const {
    reports,
    isLoading,
    refreshing,
    refresh,
    analyzedCount,
    pendingCount,
  } = useReports();
  const { vitals } = useVitals();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting()} 👋
            </Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {user?.name ?? 'User'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={[styles.avatarText, { color: colors.primaryText }]}>
              {getInitials(user?.name ?? 'U')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total"
            value={String(reports.length)}
            color={colors.primary}
            bgColor={colors.primaryLight}
          />
          <StatCard
            label="Analyzed"
            value={String(analyzedCount)}
            color={colors.success}
            bgColor={colors.successBg}
          />
          <StatCard
            label="Pending"
            value={String(pendingCount)}
            color={colors.warning}
            bgColor={colors.warningBg}
          />
        </View>

        {/* Latest Vitals */}
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Latest Vitals
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Vitals' as any)}
          >
            <Text style={[styles.link, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.vitalsRow}>
          {vitals.map(v => (
            <VitalChip key={v._id} vital={v} />
          ))}
        </View>

        {/* Recent Reports */}
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Recent Reports
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Upload' as any)}
          >
            <Text style={[styles.link, { color: colors.primary }]}>
              + Upload
            </Text>
          </TouchableOpacity>
        </View>

        {reports.length === 0 ? (
          <View
            style={[
              styles.empty,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                borderRadius: radius.lg,
              },
            ]}
          >
            <Text style={{ fontSize: 36, marginBottom: 8 }}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Reports Yet
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Upload your first report to get AI-powered insights.
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyBtn,
                { backgroundColor: colors.primary, borderRadius: radius.md },
              ]}
              onPress={() => navigation.navigate('Upload' as any)}
            >
              <Text
                style={{
                  color: colors.primaryText,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Upload Now
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          reports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              onPress={() => navigation.navigate('ReportDetail', { report })}
            />
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 13,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  statDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },

  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  vitalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    minWidth: '30%',
  },
  vitalLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vitalValue: {
    fontSize: 15,
    fontWeight: '700',
  },

  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    gap: 12,
  },
  reportIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    gap: 3,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  reportMeta: {
    fontSize: 12,
  },
  reportPreview: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    padding: 32,
    borderWidth: 0.5,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
});
