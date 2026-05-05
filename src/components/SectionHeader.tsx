import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface SectionHeaderProps {
  title: string;
  icon: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  icon: { fontSize: 22 },
  title: { fontSize: 18, fontWeight: '600' },
});
