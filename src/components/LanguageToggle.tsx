import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface LanguageToggleProps {
  showUrdu: boolean;
  onToggle: (showUrdu: boolean) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  showUrdu,
  onToggle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, !showUrdu && { backgroundColor: colors.primary }]}
        onPress={() => onToggle(false)}
      >
        <Text style={[styles.text, !showUrdu && { color: colors.primaryText }]}>
          English
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, showUrdu && { backgroundColor: colors.primary }]}
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.text, showUrdu && { color: colors.primaryText }]}>
          Roman Urdu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  btn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 25 },
  text: { fontSize: 14, fontWeight: '600' },
});
