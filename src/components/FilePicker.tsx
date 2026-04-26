import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

interface FilePickerProps {
  pickedFile: {
    name: string;
    uri: string;
    type: string;
    size?: number;
  } | null;
  onPress: () => void;
  formatFileSize: (bytes?: number) => string;
}

export const FilePicker: React.FC<FilePickerProps> = ({
  pickedFile,
  onPress,
  formatFileSize,
}) => {
  const { colors, radius } = useTheme();

  if (pickedFile) {
    return (
      <TouchableOpacity
        style={[
          styles.filePicker,
          {
            borderColor: colors.primary,
            backgroundColor: colors.primaryLight,
            borderRadius: radius.lg,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.fileInfo}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>
            {pickedFile.type.includes('pdf') ? '📑' : '🖼️'}
          </Text>
          <Text
            style={[styles.fileName, { color: colors.textPrimary }]}
            numberOfLines={2}
          >
            {pickedFile.name}
          </Text>
          <Text style={[styles.fileMeta, { color: colors.textSecondary }]}>
            {pickedFile.type.includes('pdf') ? 'PDF' : 'Image'}
            {pickedFile.size ? `  ·  ${formatFileSize(pickedFile.size)}` : ''}
          </Text>
          <TouchableOpacity
            style={[
              styles.changeBtn,
              { borderColor: colors.primary, borderRadius: radius.sm },
            ]}
            onPress={onPress}
          >
            <Text style={[styles.changeBtnText, { color: colors.primary }]}>
              Change File
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.filePicker,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.fileEmpty}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>📂</Text>
        <Text style={[styles.fileEmptyTitle, { color: colors.textPrimary }]}>
          Select File
        </Text>
        <Text style={[styles.fileEmptyDesc, { color: colors.textSecondary }]}>
          PDF, JPG, PNG supported{'\n'}Max size: 10 MB
        </Text>
        <View
          style={[
            styles.fileEmptyBtn,
            { backgroundColor: colors.primary, borderRadius: radius.md },
          ]}
        >
          <Text
            style={[styles.fileEmptyBtnText, { color: colors.primaryText }]}
          >
            Browse Files
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filePicker: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  fileEmpty: {
    alignItems: 'center',
    padding: 28,
  },
  fileEmptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  fileEmptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  fileEmptyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  fileEmptyBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileInfo: {
    alignItems: 'center',
    padding: 24,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    marginBottom: 14,
  },
  changeBtn: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
