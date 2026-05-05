import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'small',
}) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'Analyzed':
        return colors.success;
      case 'Pending':
        return colors.warning;
      case 'high':
        return colors.danger;
      case 'low':
        return colors.warning;
      case 'critical':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case 'Analyzed':
        return colors.successBg;
      case 'Pending':
        return colors.warningBg;
      case 'high':
        return colors.dangerBg;
      case 'low':
        return colors.warningBg;
      case 'critical':
        return colors.dangerBg;
      default:
        return colors.backgroundSecond;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getStatusBgColor() },
        size === 'small' ? styles.small : styles.medium,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: getStatusColor() },
          size === 'small' ? styles.textSmall : styles.textMedium,
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  small: { borderRadius: 10 },
  medium: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  text: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  textSmall: { fontSize: 10 },
  textMedium: { fontSize: 12 },
});
