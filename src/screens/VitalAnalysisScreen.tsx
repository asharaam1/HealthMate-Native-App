import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useVitals } from '../context/VitalsContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VitalAnalysisScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { getVitalById, loading, deleteVital } = useVitals();
  const [vital, setVital] = useState<any>(null);
  const [showUrdu, setShowUrdu] = useState(false);

  const vitalId = route.params?.vitalId;

  useEffect(() => {
    if (vitalId) {
      fetchVital();
    }
  }, [vitalId]);

  const fetchVital = async () => {
    try {
      const data = await getVitalById(vitalId);
      setVital(data);
    } catch (error) {
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Vital',
      'Are you sure you want to delete this vital record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteVital(vitalId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    if (!vital) return;
    try {
      await Share.share({
        title: 'Health Vitals Analysis',
        message: vital.aiAnalysis?.englishSummary || 'No analysis available',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  if (loading || !vital) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading analysis...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAnalyzed = vital.isAnalyzed && vital.aiAnalysis;
  const analysis = isAnalyzed ? vital.aiAnalysis : null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          Vital Analysis
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Icon name="share-variant" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Icon name="delete-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Meta Info */}
        <View
          style={[
            styles.metaCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.metaRow}>
            <Icon name="calendar" size={18} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {new Date(vital.recordedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Icon
              name="robot"
              size={18}
              color={isAnalyzed ? colors.success : colors.warning}
            />
            <Text
              style={[
                styles.metaText,
                { color: isAnalyzed ? colors.success : colors.warning },
              ]}
            >
              {isAnalyzed ? 'AI Analysis Complete' : 'Analysis Pending'}
            </Text>
          </View>
        </View>

        {/* Vitals Summary */}
        <View
          style={[
            styles.vitalsSummary,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
            Recorded Vitals
          </Text>
          <View style={styles.vitalsGrid}>
            {vital.bloodPressure?.systolic && (
              <View style={styles.vitalBox}>
                <Text
                  style={[
                    styles.vitalBoxLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  BP
                </Text>
                <Text
                  style={[styles.vitalBoxValue, { color: colors.textPrimary }]}
                >
                  {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                </Text>
              </View>
            )}
            {vital.bloodSugar?.value && (
              <View style={styles.vitalBox}>
                <Text
                  style={[
                    styles.vitalBoxLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Sugar
                </Text>
                <Text
                  style={[styles.vitalBoxValue, { color: colors.textPrimary }]}
                >
                  {vital.bloodSugar.value} mg/dL
                </Text>
                <Text
                  style={[styles.vitalBoxSub, { color: colors.textTertiary }]}
                >
                  {vital.bloodSugar.type}
                </Text>
              </View>
            )}
            {vital.weight?.value && (
              <View style={styles.vitalBox}>
                <Text
                  style={[
                    styles.vitalBoxLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Weight
                </Text>
                <Text
                  style={[styles.vitalBoxValue, { color: colors.textPrimary }]}
                >
                  {vital.weight.value} kg
                </Text>
              </View>
            )}
            {vital.heartRate?.value && (
              <View style={styles.vitalBox}>
                <Text
                  style={[
                    styles.vitalBoxLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Heart Rate
                </Text>
                <Text
                  style={[styles.vitalBoxValue, { color: colors.textPrimary }]}
                >
                  {vital.heartRate.value} bpm
                </Text>
              </View>
            )}
            {vital.oxygenLevel?.value && (
              <View style={styles.vitalBox}>
                <Text
                  style={[
                    styles.vitalBoxLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Oxygen
                </Text>
                <Text
                  style={[styles.vitalBoxValue, { color: colors.textPrimary }]}
                >
                  {vital.oxygenLevel.value}%
                </Text>
              </View>
            )}
          </View>
          {vital.bmi && (
            <View
              style={[
                styles.bmiContainer,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text style={[styles.bmiLabel, { color: colors.primary }]}>
                BMI: {vital.bmi}
              </Text>
              <Text style={[styles.bmiStatus, { color: colors.primary }]}>
                {vital.bmi < 18.5 && 'Underweight'}
                {vital.bmi >= 18.5 && vital.bmi < 25 && 'Normal Weight'}
                {vital.bmi >= 25 && vital.bmi < 30 && 'Overweight'}
                {vital.bmi >= 30 && 'Obese'}
              </Text>
            </View>
          )}
        </View>

        {!isAnalyzed ? (
          <View
            style={[styles.pendingCard, { backgroundColor: colors.warningBg }]}
          >
            <Icon name="clock-outline" size={32} color={colors.warning} />
            <Text style={[styles.pendingTitle, { color: colors.warning }]}>
              AI Analysis in Progress
            </Text>
            <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
              Our AI is analyzing your vitals. This may take a few moments.
              Please check back soon.
            </Text>
          </View>
        ) : (
          <>
            {/* Language Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  !showUrdu && { backgroundColor: colors.primary },
                ]}
                onPress={() => setShowUrdu(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !showUrdu && { color: colors.white },
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  showUrdu && { backgroundColor: colors.primary },
                ]}
                onPress={() => setShowUrdu(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    showUrdu && { color: colors.white },
                  ]}
                >
                  Roman Urdu
                </Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
                {showUrdu
                  ? analysis?.romanUrduSummary
                  : analysis?.englishSummary}
              </Text>
            </View>

            {/* Abnormal Values */}
            {analysis?.abnormalValues && analysis.abnormalValues.length > 0 && (
              <>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  ⚠️ Abnormal Values
                </Text>
                {analysis.abnormalValues.map((item: any, idx: number) => (
                  <View
                    key={idx}
                    style={[
                      styles.abnormalCard,
                      { backgroundColor: colors.dangerBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.abnormalParam,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {item.parameter}
                    </Text>
                    <Text
                      style={[
                        styles.abnormalDetail,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Value: {item.value} | Normal: {item.normalRange}
                    </Text>
                    <View
                      style={[
                        styles.abnormalStatus,
                        { backgroundColor: colors.danger },
                      ]}
                    >
                      <Text style={styles.abnormalStatusText}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* Doctor Questions */}
            {analysis?.doctorQuestions &&
              analysis.doctorQuestions.length > 0 && (
                <>
                  <Text
                    style={[styles.sectionTitle, { color: colors.textPrimary }]}
                  >
                    ❓ Ask Your Doctor
                  </Text>
                  <View
                    style={[
                      styles.listCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {analysis.doctorQuestions.map((q: string, idx: number) => (
                      <Text
                        key={idx}
                        style={[styles.listText, { color: colors.textPrimary }]}
                      >
                        • {q}
                      </Text>
                    ))}
                  </View>
                </>
              )}

            {/* Foods */}
            <View style={styles.row}>
              <View style={styles.halfColumn}>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  🚫 Avoid
                </Text>
                <View
                  style={[
                    styles.listCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {analysis?.foodsToAvoid?.map((f: string, idx: number) => (
                    <Text
                      key={idx}
                      style={[styles.listText, { color: colors.textPrimary }]}
                    >
                      • {f}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.halfColumn}>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  ✅ Recommended
                </Text>
                <View
                  style={[
                    styles.listCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {analysis?.recommendedFoods?.map((f: string, idx: number) => (
                    <Text
                      key={idx}
                      style={[styles.listText, { color: colors.textPrimary }]}
                    >
                      • {f}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Home Remedies */}
            {analysis?.homeRemedies && analysis.homeRemedies.length > 0 && (
              <>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  🏠 Home Remedies
                </Text>
                <View
                  style={[
                    styles.listCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {analysis.homeRemedies.map((r: string, idx: number) => (
                    <Text
                      key={idx}
                      style={[styles.listText, { color: colors.textPrimary }]}
                    >
                      • {r}
                    </Text>
                  ))}
                </View>
              </>
            )}

            {/* Notes */}
            {vital.notes && (
              <>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  📝 Your Notes
                </Text>
                <View
                  style={[
                    styles.notesCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.notesText, { color: colors.textSecondary }]}
                  >
                    {vital.notes}
                  </Text>
                </View>
              </>
            )}

            {/* Disclaimer */}
            <View
              style={[styles.disclaimer, { backgroundColor: colors.infoBg }]}
            >
              <Text style={{ fontSize: 20 }}>⚠️</Text>
              <Text style={[styles.disclaimerText, { color: colors.info }]}>
                {analysis?.disclaimer}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  deleteButton: { padding: 4 },
  content: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 14 },

  metaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 0.5,
    borderRadius: 12,
    marginBottom: 16,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12 },

  vitalsSummary: {
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  vitalBox: { flex: 1, minWidth: 80, alignItems: 'center', padding: 8 },
  vitalBoxLabel: { fontSize: 10, textTransform: 'uppercase' },
  vitalBoxValue: { fontSize: 16, fontWeight: '600' },
  vitalBoxSub: { fontSize: 9 },
  bmiContainer: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  bmiLabel: { fontSize: 14, fontWeight: '600' },
  bmiStatus: { fontSize: 12 },

  pendingCard: { alignItems: 'center', padding: 32, gap: 12, borderRadius: 12 },
  pendingTitle: { fontSize: 18, fontWeight: '600' },
  pendingText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },

  toggleContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  toggleText: { fontSize: 14, fontWeight: '600' },

  summaryCard: {
    padding: 16,
    borderWidth: 0.5,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryText: { fontSize: 14, lineHeight: 22 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
  },

  abnormalCard: { padding: 12, borderRadius: 10, marginBottom: 8 },
  abnormalParam: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  abnormalDetail: { fontSize: 12, marginBottom: 6 },
  abnormalStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  abnormalStatusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  listCard: { padding: 14, borderWidth: 0.5, borderRadius: 12, gap: 6 },
  listText: { fontSize: 13, lineHeight: 18 },

  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  halfColumn: { flex: 1 },

  notesCard: { padding: 14, borderWidth: 0.5, borderRadius: 12 },
  notesText: { fontSize: 14, lineHeight: 20 },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16 },
});
