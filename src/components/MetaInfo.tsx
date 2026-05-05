import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/theme';

interface MetaInfoProps {
  date?: string;
  type?: string;
  status?: 'Analyzed' | 'Pending';
}

export const MetaInfo: React.FC<MetaInfoProps> = ({ date, type, status }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {date && (
        <View style={styles.row}>
          <Icon
            name="calendar-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            {new Date(date).toLocaleDateString()}
          </Text>
        </View>
      )}
      {type && (
        <View style={styles.row}>
          <Icon
            name="file-document-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            {type}
          </Text>
        </View>
      )}
      {status && (
        <View style={styles.row}>
          <Icon
            name="robot-outline"
            size={18}
            color={status === 'Analyzed' ? colors.success : colors.warning}
          />
          <Text
            style={[
              styles.text,
              {
                color: status === 'Analyzed' ? colors.success : colors.warning,
              },
            ]}
          >
            {status === 'Analyzed'
              ? 'AI Analysis Complete'
              : 'Analysis Pending'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 20,
    borderWidth: 0.5,
    borderRadius: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  text: { fontSize: 13 },
});
