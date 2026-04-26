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
import { useReports } from '../context/ReportContext';
import { useFamilyMembers } from '../context/FamilyMemberContext';
import * as DocumentPicker from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FilePicker } from '../components/FilePicker';
import { ReportTypeChip } from '../components/ReportTypeChip';
import { FamilyMemberSelector } from '../components/FamilyMemberSelector';

type ReportType =
  | 'blood-test'
  | 'x-ray'
  | 'prescription'
  | 'ultrasound'
  | 'other';

const REPORT_TYPES: { label: string; value: ReportType; icon: string }[] = [
  { label: 'Blood Test', value: 'blood-test', icon: '🧪' },
  { label: 'X-Ray', value: 'x-ray', icon: '🦴' },
  { label: 'Prescription', value: 'prescription', icon: '💊' },
  { label: 'Ultrasound', value: 'ultrasound', icon: '🔊' },
  { label: 'Other', value: 'other', icon: '📄' },
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
  const { uploadReport } = useReports();
  const { members } = useFamilyMembers();

  const [pickedFile, setPickedFile] = useState<any>(null);
  const [reportType, setReportType] = useState<ReportType>('blood-test');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-select first family member
  React.useEffect(() => {
    if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0]._id);
    }
  }, [members]);

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.pick({
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
      const isCancelled = err?.code === 'DOCUMENT_PICKER_CANCELED';
      if (!isCancelled) {
        Alert.alert('Error', 'Could not pick file. Please try again.');
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
    if (!selectedMemberId) {
      Alert.alert('Family Member', 'Please select who this report belongs to.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: pickedFile.uri,
        type: pickedFile.type,
        name: pickedFile.name,
      } as any);
      formData.append('title', reportTitle);
      formData.append('reportType', reportType);
      formData.append('reportDate', reportDate.toISOString().split('T')[0]);
      formData.append('familyMemberId', selectedMemberId);
      formData.append('notes', notes);

      const uploaded = await uploadReport(formData);

      Alert.alert('Success!', 'Report uploaded. AI analysis in progress.', [
        { text: 'OK', onPress: () => resetForm() },
      ]);
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setPickedFile(null);
    setReportTitle('');
    setReportType('blood-test');
    setReportDate(new Date());
    setNotes('');
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
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
      >
        <FilePicker
          pickedFile={pickedFile}
          onPress={showPickerOptions}
          formatFileSize={formatFileSize}
        />

        <FamilyMemberSelector
          selectedId={selectedMemberId}
          onSelect={setSelectedMemberId}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Title
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radius.md,
              color: colors.textPrimary,
            },
          ]}
          placeholder="e.g. CBC Blood Test"
          placeholderTextColor={colors.textTertiary}
          value={reportTitle}
          onChangeText={setReportTitle}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Type
        </Text>
        <View style={styles.typeGrid}>
          {REPORT_TYPES.map(({ label, value, icon }) => (
            <ReportTypeChip
              key={value}
              label={label}
              icon={icon}
              isActive={reportType === value}
              onPress={() => setReportType(value)}
            />
          ))}
        </View>

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
              borderColor: colors.border,
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
            doctor.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.uploadBtn,
            {
              backgroundColor:
                isUploading || !pickedFile || !selectedMemberId
                  ? colors.textTertiary
                  : colors.primary,
              borderRadius: radius.lg,
            },
          ]}
          onPress={handleUpload}
          disabled={isUploading || !pickedFile || !selectedMemberId}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
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
});
