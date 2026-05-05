import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  buttonText?: string;
  onPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  buttonText,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
      {buttonText && onPress && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onPress}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 },
  buttonText: { fontSize: 15, fontWeight: '600' },
});
