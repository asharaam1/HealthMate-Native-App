import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { pick, types } from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';

type ReportType =
  | 'blood-test'
  | 'x-ray'
  | 'prescription'
  | 'ultrasound'
  | 'other';

const REPORT_TYPES = [
  { label: 'Blood Test', value: 'blood-test', icon: '🩸' },
  { label: 'X-Ray', value: 'x-ray', icon: '🦴' },
  { label: 'Prescription', value: 'prescription', icon: '💊' },
  { label: 'Ultrasound', value: 'ultrasound', icon: '🔊' },
  { label: 'Other', value: 'other', icon: '📄' },
];

export default function UploadScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation();
  const { uploadReport } = useReports();
  const { members, fetchFamilyMembers } = useFamilyMembers();

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [reportType, setReportType] = useState<ReportType>('blood-test');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  // Pick PDF using DocumentPicker
  const pickPDF = async () => {
    try {
      const result = await pick({
        type: [types.pdf],
      });

      if (result[0]) {
        const file = result[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.type || 'application/pdf',
          size: file.size,
        });
        if (!reportTitle && file.name) {
          setReportTitle(file.name.replace('.pdf', ''));
        }
      }
    } catch (err) {
      if (err) {
        console.log('User cancelled');
      } else {
        console.log('Error:', err);
      }
    }
  };

  // Pick Image using ImagePicker
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        console.log('Error:', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
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
      { text: '📷 Image / Photo', onPress: pickImage },
      { text: '📄 PDF Document', onPress: pickPDF },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
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
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      } as any);
      formData.append('title', reportTitle);
      formData.append('reportType', reportType);
      formData.append('reportDate', reportDate.toISOString().split('T')[0]);
      formData.append('familyMemberId', selectedMemberId);
      formData.append('notes', notes);

      await uploadReport(formData);

      // ✅ RESET FORM 
      setSelectedFile(null);
      setReportTitle('');
      setReportType('blood-test');
      setReportDate(new Date());
      setNotes('');
      setSelectedMemberId(null);

      Alert.alert('Success!', 'Report uploaded. AI analysis in progress.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const selectedMember = members.find(m => m._id === selectedMemberId);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Upload Report
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* File Picker */}
        <TouchableOpacity
          style={[
            styles.filePicker,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radius.lg,
            },
          ]}
          onPress={showPickerOptions}
        >
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Text style={styles.fileIcon}>
                {selectedFile.type?.includes('pdf') ? '📄' : '🖼️'}
              </Text>
              <Text
                style={[styles.fileName, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {selectedFile.name}
              </Text>
              <Text style={[styles.fileSize, { color: colors.textSecondary }]}>
                {formatFileSize(selectedFile.size)}
              </Text>
              <TouchableOpacity
                style={[styles.changeBtn, { borderColor: colors.primary }]}
                onPress={showPickerOptions}
              >
                <Text style={[styles.changeBtnText, { color: colors.primary }]}>
                  Change File
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fileEmpty}>
              <Text style={styles.fileEmptyIcon}>📂</Text>
              <Text
                style={[styles.fileEmptyTitle, { color: colors.textPrimary }]}
              >
                Select File
              </Text>
              <Text
                style={[styles.fileEmptyDesc, { color: colors.textSecondary }]}
              >
                PDF, JPG, PNG supported
              </Text>
              <TouchableOpacity
                style={[
                  styles.browseBtn,
                  { backgroundColor: colors.primary, borderRadius: radius.md },
                ]}
                onPress={showPickerOptions}
              >
                <Text
                  style={[styles.browseBtnText, { color: colors.primaryText }]}
                >
                  Browse Files
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Family Member Selector */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          For Whom? *
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.memberScroll}
        >
          <View style={styles.memberContainer}>
            {members.map(member => (
              <TouchableOpacity
                key={member._id}
                style={[
                  styles.memberChip,
                  {
                    backgroundColor:
                      selectedMemberId === member._id
                        ? colors.primary
                        : colors.card,
                    borderColor:
                      selectedMemberId === member._id
                        ? colors.primary
                        : colors.border,
                    borderRadius: radius.full,
                  },
                ]}
                onPress={() => setSelectedMemberId(member._id)}
              >
                <Text>{member.relationship === 'self' ? '👤' : '👨‍👩‍👧'}</Text>
                <Text
                  style={[
                    styles.memberName,
                    {
                      color:
                        selectedMemberId === member._id
                          ? colors.primaryText
                          : colors.textPrimary,
                    },
                  ]}
                >
                  {member.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Report Title */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Title *
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
          placeholder="e.g., CBC Blood Test"
          placeholderTextColor={colors.textTertiary}
          value={reportTitle}
          onChangeText={setReportTitle}
        />

        {/* Report Type */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Type
        </Text>
        <View style={styles.typeGrid}>
          {REPORT_TYPES.map(({ label, value, icon }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.typeChip,
                {
                  backgroundColor:
                    reportType === value ? colors.primary : colors.card,
                  borderColor:
                    reportType === value ? colors.primary : colors.border,
                  borderRadius: radius.md,
                },
              ]}
              onPress={() => setReportType(value as ReportType)}
            >
              <Text>{icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  {
                    color:
                      reportType === value
                        ? colors.primaryText
                        : colors.textSecondary,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Picker */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Report Date *
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
          <Icon name="calendar" size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>
            {reportDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={reportDate}
            mode="date"
            maximumDate={new Date()}
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setReportDate(date);
            }}
          />
        )}

        {/* Notes */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Notes (Optional)
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
          placeholder="Any additional information..."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadBtn,
            {
              backgroundColor:
                isUploading || !selectedFile || !selectedMemberId
                  ? colors.textTertiary
                  : colors.primary,
              borderRadius: radius.lg,
            },
          ]}
          onPress={handleUpload}
          disabled={isUploading || !selectedFile || !selectedMemberId}
        >
          {isUploading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={[styles.uploadBtnText, { color: colors.primaryText }]}>
              Upload & Analyze
            </Text>
          )}
        </TouchableOpacity>

        {/* Disclaimer */}
        <View
          style={[
            styles.disclaimer,
            { backgroundColor: colors.infoBg, borderRadius: radius.md },
          ]}
        >
          <Text style={{ fontSize: 18 }}>🤖</Text>
          <Text style={[styles.disclaimerText, { color: colors.info }]}>
            AI analysis is for informational purposes only. Always consult your
            doctor.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },

  filePicker: {
    borderWidth: 1,
    borderStyle: 'dashed',
    minHeight: 180,
    justifyContent: 'center',
    marginBottom: 20,
  },
  fileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    marginBottom: 12,
  },
  changeBtn: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '500',
  },
  fileEmpty: {
    alignItems: 'center',
    padding: 28,
  },
  fileEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  fileEmptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  fileEmptyDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  memberScroll: {
    marginBottom: 12,
  },
  memberContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
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

  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    flex: 1,
  },

  textArea: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
  },

  uploadBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    marginTop: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
