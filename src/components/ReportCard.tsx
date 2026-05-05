import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/theme';
import { StatusBadge } from './StatusBadge';
import type { Report } from '../types';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
}

const getReportTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'blood-test': '🩸',
    'x-ray': '🦴',
    prescription: '💊',
    ultrasound: '🔊',
    other: '📄',
  };
  return icons[type] || '📄';
};

const getReportTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'blood-test': 'Blood Test',
    'x-ray': 'X-Ray',
    prescription: 'Prescription',
    ultrasound: 'Ultrasound',
    other: 'Other',
  };
  return labels[type] || 'Other';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const { colors, radius } = useTheme();
  const abnormalCount = report.aiSummary?.abnormalValues?.length || 0;
  const status = report.isProcessed ? 'Analyzed' : 'Pending';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.typeIcon}>
          {getReportTypeIcon(report.reportType)}
        </Text>

        <View style={styles.cardInfo}>
          <Text
            style={[styles.cardTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {report.title}
          </Text>
          <Text style={[styles.cardType, { color: colors.textSecondary }]}>
            {getReportTypeLabel(report.reportType)}
          </Text>
        </View>

        <StatusBadge status={status} size="small" />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Icon name="calendar-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.dateText, { color: colors.textTertiary }]}>
            {formatDate(report.reportDate)}
          </Text>
        </View>

        {abnormalCount > 0 && (
          <View style={styles.abnormalContainer}>
            <Icon name="alert-circle-outline" size={14} color={colors.danger} />
            <Text style={[styles.abnormalText, { color: colors.danger }]}>
              {abnormalCount} abnormal{' '}
              {abnormalCount === 1 ? 'value' : 'values'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardType: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
  abnormalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  abnormalText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
