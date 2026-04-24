import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import * as DocumentPicker from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Types
type ReportType =
  | 'Lab Report'
  | 'X-Ray'
  | 'Prescription'
  | 'Ultrasound'
  | 'Other';

interface PickedFile {
  name: string;
  uri: string;
  type: string;
  size?: number;
}

const REPORT_TYPES: { label: ReportType; icon: string }[] = [
  { label: 'Lab Report', icon: '🧪' },
  { label: 'X-Ray', icon: '🦴' },
  { label: 'Prescription', icon: '💊' },
  { label: 'Ultrasound', icon: '🔊' },
  { label: 'Other', icon: '📄' },
];

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadScreen() {
  const { colors, radius, spacing } = useTheme();

  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [reportType, setReportType] = useState<ReportType>('Lab Report');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // File Picker
  const pickPDF = async () => {
    try {
      const result: DocumentPicker.DocumentPickerResponse[] =
        await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf],
          allowMultiSelection: false,
        });

      const file = result[0];
      setPickedFile({
        name: file.name ?? 'document.pdf',
        uri: file.uri,
        type: file.type ?? 'application/pdf',
        size: file.size ?? undefined,
      });

      if (!reportTitle && file.name) {
        setReportTitle(file.name.replace('.pdf', ''));
      }
    } catch (err: any) {
      const isUserCancelled =
        (DocumentPicker as any).isCancel?.(err) ||
        err?.code === 'DOCUMENT_PICKER_CANCELED' ||
        err?.message?.includes('canceled');

      if (!isUserCancelled) {
        Alert.alert('Error', 'Could not pick file. Please try again.');
        console.error('Picker Error:', err);
      }
    }
  };

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (asset) {
        setPickedFile({
          name: asset.fileName ?? 'image.jpg',
          uri: asset.uri ?? '',
          type: asset.type ?? 'image/jpeg',
          size: asset.fileSize,
        });
        if (!reportTitle && asset.fileName) {
          setReportTitle(asset.fileName.replace(/\.[^.]+$/, ''));
        }
      }
    });
  };

  const showPickerOptions = () => {
    Alert.alert('Select File', 'Choose file type to upload', [
      { text: 'PDF Document', onPress: pickPDF },
      { text: 'Image / Photo', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleUpload = async () => {
    if (!pickedFile) {
      Alert.alert('No File', 'Please select a file first.');
      return;
    }
    if (!reportTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a report title.');
      return;
    }

    setIsUploading(true);

    try {
      // Dummy delay
      await new Promise<void>(resolve => setTimeout(resolve, 1800));

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        resetForm();
      }, 2500);
    } catch (err) {
      Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setPickedFile(null);
    setReportTitle('');
    setReportType('Lab Report');
    setReportDate(new Date());
    setNotes('');
  };

  // Success State

  if (uploadSuccess) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.successContainer}>
          <View
            style={[
              styles.successIcon,
              {
                backgroundColor: colors.primaryLight,
                borderRadius: radius.full,
              },
            ]}
          >
            <Text style={{ fontSize: 48 }}>✅</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
            Upload Successful!
          </Text>
          <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
            Your report has been uploaded.{'\n'}AI analysis will be ready
            shortly.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main UI
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Upload Report
        </Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
          Gemini AI will analyze it for you
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* File Picker Area */}
        <TouchableOpacity
          style={[
            styles.filePicker,
            {
              borderColor: pickedFile ? colors.primary : colors.border,
              backgroundColor: pickedFile ? colors.primaryLight : colors.card,
              borderRadius: radius.lg,
            },
          ]}
          onPress={pickedFile ? showPickerOptions : showPickerOptions}
          activeOpacity={0.7}
        >
          {pickedFile ? (
            // File selected — show info
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
                {pickedFile.size
                  ? `  ·  ${formatFileSize(pickedFile.size)}`
                  : ''}
              </Text>
              <TouchableOpacity
                style={[
                  styles.changeBtn,
                  { borderColor: colors.primary, borderRadius: radius.sm },
                ]}
                onPress={showPickerOptions}
              >
                <Text style={[styles.changeBtnText, { color: colors.primary }]}>
                  Change File
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Empty state
            <View style={styles.fileEmpty}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📂</Text>
              <Text
                style={[styles.fileEmptyTitle, { color: colors.textPrimary }]}
              >
                Select File
              </Text>
              <Text
                style={[styles.fileEmptyDesc, { color: colors.textSecondary }]}
              >
                PDF, JPG, PNG supported{'\n'}Max size: 10 MB
              </Text>
              <View
                style={[
                  styles.fileEmptyBtn,
                  { backgroundColor: colors.primary, borderRadius: radius.md },
                ]}
              >
                <Text
                  style={[
                    styles.fileEmptyBtnText,
                    { color: colors.primaryText },
                  ]}
                >
                  Browse Files
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Report Title */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Title
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: reportTitle ? colors.borderFocus : colors.border,
              borderRadius: radius.md,
              color: colors.textPrimary,
            },
          ]}
          placeholder="e.g. CBC Blood Test — April 2025"
          placeholderTextColor={colors.textTertiary}
          value={reportTitle}
          onChangeText={setReportTitle}
        />

        {/* Report Type */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Type
        </Text>
        <View style={styles.typeGrid}>
          {REPORT_TYPES.map(({ label, icon }) => {
            const isActive = reportType === label;
            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
                onPress={() => setReportType(label)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 18 }}>{icon}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    {
                      color: isActive
                        ? colors.primaryText
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date Picker */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Date
        </Text>
        <TouchableOpacity
          style={[
            styles.dateBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ fontSize: 18 }}>📅</Text>
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>
            {formatDate(reportDate)}
          </Text>
          <Text style={[styles.dateChange, { color: colors.primary }]}>
            Change
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={reportDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, selected) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selected) setReportDate(selected);
            }}
          />
        )}

        {/* Notes (optional) */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Notes{' '}
          <Text style={[styles.optional, { color: colors.textTertiary }]}>
            (optional)
          </Text>
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.card,
              borderColor: notes ? colors.borderFocus : colors.border,
              borderRadius: radius.md,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Any additional info for AI analysis..."
          placeholderTextColor={colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Disclaimer */}
        <View
          style={[
            styles.disclaimer,
            {
              backgroundColor: colors.infoBg,
              borderRadius: radius.md,
              borderColor: colors.info,
            },
          ]}
        >
          <Text style={{ fontSize: 14 }}>🤖</Text>
          <Text style={[styles.disclaimerText, { color: colors.info }]}>
            AI analysis is for informational purposes only. Always consult your
            doctor for medical advice.
          </Text>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadBtn,
            {
              backgroundColor:
                isUploading || !pickedFile
                  ? colors.textTertiary
                  : colors.primary,
              borderRadius: radius.lg,
            },
          ]}
          onPress={handleUpload}
          disabled={isUploading || !pickedFile}
          activeOpacity={0.8}
        >
          {isUploading ? (
            <View style={styles.uploadingRow}>
              <ActivityIndicator color={colors.primaryText} size="small" />
              <Text
                style={[styles.uploadBtnText, { color: colors.primaryText }]}
              >
                Uploading...
              </Text>
            </View>
          ) : (
            <Text style={[styles.uploadBtnText, { color: colors.primaryText }]}>
              Upload & Analyze
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // File picker
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

  // Form fields
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optional: {
    fontWeight: '400',
    textTransform: 'none',
    letterSpacing: 0,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 20,
    minHeight: 90,
  },

  // Report type grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
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

  // Date
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    marginBottom: 20,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
  },
  dateChange: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderWidth: 0.5,
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },

  // Upload button
  uploadBtn: {
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Success
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
