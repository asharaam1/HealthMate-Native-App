import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
}) => {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      {[...Array(count)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            { backgroundColor: colors.card, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.icon, { backgroundColor: colors.border }]} />
            <View style={styles.info}>
              <View
                style={[styles.title, { backgroundColor: colors.border }]}
              />
              <View style={[styles.type, { backgroundColor: colors.border }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 12 },
  card: { marginBottom: 12, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 48, height: 48, borderRadius: 24 },
  info: { flex: 1, marginLeft: 12, gap: 6 },
  title: { height: 16, width: '70%', borderRadius: 4 },
  type: { height: 12, width: '40%', borderRadius: 4 },
});
