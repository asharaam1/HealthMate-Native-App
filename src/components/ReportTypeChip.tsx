import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface ReportTypeChipProps {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}

export const ReportTypeChip: React.FC<ReportTypeChipProps> = ({
  label,
  icon,
  isActive,
  onPress,
}) => {
  const { colors, radius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.typeChip,
        {
          backgroundColor: isActive ? colors.primary : colors.card,
          borderColor: isActive ? colors.primary : colors.border,
          borderRadius: radius.md,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text
        style={[
          styles.typeLabel,
          {
            color: isActive ? colors.primaryText : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
