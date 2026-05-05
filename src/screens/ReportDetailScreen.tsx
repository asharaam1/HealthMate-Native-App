import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useReports } from '../context/ReportContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBadge } from '../components/StatusBadge';
import { MetaInfo } from '../components/MetaInfo';
import { LanguageToggle } from '../components/LanguageToggle';
import { SectionHeader } from '../components/SectionHeader';
import type { Report, AbnormalValue } from '../types';

// ============ Sub-components ============
const AbnormalValueCard = ({ item }: { item: AbnormalValue }) => {
  const { colors, radius } = useTheme();

  const getStatusColor = () => {
    switch (item.status) {
      case 'high':
        return colors.danger;
      case 'low':
        return colors.warning;
      default:
        return colors.danger;
    }
  };

  return (
    <View
      style={[
        styles.abnormalCard,
        { backgroundColor: colors.dangerBg, borderRadius: radius.md },
      ]}
    >
      <View style={styles.abnormalHeader}>
        <Text style={[styles.abnormalParameter, { color: colors.textPrimary }]}>
          {item.parameter}
        </Text>
        <StatusBadge status={item.status} size="small" />
      </View>
      <Text style={[styles.abnormalValue, { color: colors.danger }]}>
        Value: {item.value}
      </Text>
      <Text style={[styles.normalRange, { color: colors.textSecondary }]}>
        Normal: {item.normalRange}
      </Text>
    </View>
  );
};

const ListCard = ({
  items,
  icon,
  showUrdu,
}: {
  items: string[];
  icon: string;
  showUrdu: boolean;
}) => {
  const { colors, radius } = useTheme();
  if (!items || items.length === 0) return null;

  const splitText = (text: string) => {
    const parts = text.split(' / ');
    if (parts.length === 1) return { english: text, urdu: '' };
    return { english: parts[0], urdu: parts[1] };
  };

  return (
    <View
      style={[
        styles.listCard,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={styles.listIcon}>{icon}</Text>
      <View style={styles.listContent}>
        {items.map((item, index) => {
          const { english, urdu } = splitText(item);
          return (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
              <Text
                style={[styles.listItemText, { color: colors.textPrimary }]}
              >
                {showUrdu ? urdu || english : english}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ============ Main Component ============
export default function ReportDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { getReportById, loading, deleteReport } = useReports();
  const [report, setReport] = useState<Report | null>(null);
  const [showUrdu, setShowUrdu] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const reportId = route.params?.reportId;

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const data = await getReportById(reportId);
      setReport(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load report');
      navigation.goBack();
    }
  };

  const handleShare = async () => {
    if (!report) return;
    try {
      await Share.share({
        title: report.title,
        message: `${report.title}\n\n${
          report.aiSummary?.englishSummary || 'No analysis available'
        }\n\nShared from HealthMate`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  if (loading || !report) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading report...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAnalyzed = report.isProcessed && report.aiSummary;
  const summary = isAnalyzed ? report.aiSummary : null;
  const status = report.isProcessed ? 'Analyzed' : 'Pending';
  const isImage = report.file?.fileType === 'image';
  const fileUrl = report.file?.url;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Timeline');
            }
          }}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {report.title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Delete', 'Delete this report?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await deleteReport(reportId);
                  navigation.goBack();
                },
              },
            ]);
          }}
        >
          <Icon name="delete-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Icon name="share-variant" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Report Image Section */}
        {fileUrl && (
          <>
            <SectionHeader title="Report Image" icon="🖼️" />
            <TouchableOpacity
              style={[
                styles.imageContainer,
                {
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setImageModalVisible(true)}
            >
              <Image
                source={{ uri: fileUrl }}
                style={styles.reportImage}
                resizeMode="contain"
              />
              <View style={styles.imageOverlay}>
                <Icon name="magnify-plus" size={24} color={colors.white} />
                <Text
                  style={[styles.imageOverlayText, { color: colors.white }]}
                >
                  Tap to zoom
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Meta Info */}
        <MetaInfo
          date={report.reportDate}
          type={report.reportType.replace('-', ' ').toUpperCase()}
          status={status}
        />

        {!isAnalyzed ? (
          <View
            style={[
              styles.pendingCard,
              { backgroundColor: colors.warningBg, borderRadius: 12 },
            ]}
          >
            <Icon name="clock-outline" size={32} color={colors.warning} />
            <Text style={[styles.pendingTitle, { color: colors.warning }]}>
              Analysis in Progress
            </Text>
            <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
              Our AI is analyzing your report. This may take a few moments.
              Please check back soon.
            </Text>
          </View>
        ) : (
          <>
            {/* Language Toggle */}
            <LanguageToggle showUrdu={showUrdu} onToggle={setShowUrdu} />

            {/* Summary */}
            <SectionHeader title="Summary" icon="📋" />
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
                {showUrdu ? summary?.romanUrduSummary : summary?.englishSummary}
              </Text>
            </View>

            {/* Abnormal Values */}
            {summary?.abnormalValues && summary.abnormalValues.length > 0 && (
              <>
                <SectionHeader title="Abnormal Values" icon="⚠️" />
                {summary.abnormalValues.map((item, index) => (
                  <AbnormalValueCard key={index} item={item} />
                ))}
              </>
            )}

            {/* Doctor Questions */}
            {summary?.doctorQuestions && summary.doctorQuestions.length > 0 && (
              <>
                <SectionHeader title="Ask Your Doctor" icon="👨‍⚕️" />
                <ListCard
                  items={summary.doctorQuestions}
                  icon="❓"
                  showUrdu={showUrdu}
                />
              </>
            )}

            {/* Foods Section */}
            <View style={styles.foodRow}>
              <View style={styles.foodColumn}>
                <SectionHeader title="Avoid These" icon="🚫" />
                <ListCard
                  items={summary?.foodsToAvoid || []}
                  icon="🍔"
                  showUrdu={showUrdu}
                />
              </View>
              <View style={styles.foodColumn}>
                <SectionHeader title="Eat These" icon="✅" />
                <ListCard
                  items={summary?.recommendedFoods || []}
                  icon="🥗"
                  showUrdu={showUrdu}
                />
              </View>
            </View>

            {/* Home Remedies */}
            {summary?.homeRemedies && summary.homeRemedies.length > 0 && (
              <>
                <SectionHeader title="Home Remedies" icon="🏠" />
                <ListCard
                  items={summary.homeRemedies}
                  icon="🌿"
                  showUrdu={showUrdu}
                />
              </>
            )}

            {/* User Notes */}
            {report.notes && (
              <>
                <SectionHeader title="Your Notes" icon="📝" />
                <View
                  style={[
                    styles.notesCard,
                    {
                      backgroundColor: colors.card,
                      borderRadius: 12,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.notesText, { color: colors.textSecondary }]}
                  >
                    {report.notes}
                  </Text>
                </View>
              </>
            )}

            {/* Disclaimer */}
            <View
              style={[
                styles.disclaimer,
                {
                  backgroundColor: colors.infoBg,
                  borderRadius: 12,
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>⚠️</Text>
              <Text
                style={[styles.disclaimerText, { color: colors.info, flex: 1 }]}
              >
                {summary?.disclaimer ||
                  'This information is for understanding only, not medical advice. Always consult your doctor.'}
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: fileUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============ Styles ============
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: { padding: 4 },

  content: { padding: 16 },

  // Image Styles
  imageContainer: {
    marginBottom: 20,
    borderWidth: 0.5,
    overflow: 'hidden',
    position: 'relative',
  },
  reportImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  imageOverlayText: {
    fontSize: 12,
    fontWeight: '500',
  },

  pendingCard: { alignItems: 'center', padding: 32, gap: 12 },
  pendingTitle: { fontSize: 18, fontWeight: '600' },
  pendingText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },

  summaryCard: { padding: 16, borderWidth: 0.5 },
  summaryText: { fontSize: 15, lineHeight: 24 },

  abnormalCard: { padding: 14, marginBottom: 10 },
  abnormalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  abnormalParameter: { fontSize: 16, fontWeight: '600' },
  abnormalValue: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  normalRange: { fontSize: 12 },

  listCard: {
    flexDirection: 'row',
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    gap: 12,
  },
  listIcon: { fontSize: 20 },
  listContent: { flex: 1, gap: 6 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { fontSize: 14, marginTop: 2 },
  listItemText: { flex: 1, fontSize: 14, lineHeight: 20 },

  foodRow: { flexDirection: 'row', gap: 12 },
  foodColumn: { flex: 1 },

  notesCard: { padding: 14, borderWidth: 0.5 },
  notesText: { fontSize: 14, lineHeight: 20 },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    marginTop: 20,
  },
  disclaimerText: { fontSize: 12, lineHeight: 18 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 14 },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 8,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});
