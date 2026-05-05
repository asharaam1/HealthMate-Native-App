import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useVitals } from '../context/VitalsContext';
import { useFamilyMembers } from '../context/FamilyMemberContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddVitalsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { addVitals, loading } = useVitals();
  const { members, fetchFamilyMembers } = useFamilyMembers();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    recordDate: new Date(),
    familyMemberId: '',
    bpSystolic: '',
    bpDiastolic: '',
    bloodSugar: '',
    bloodSugarType: 'random' as 'fasting' | 'random' | 'post-meal' | 'hba1c',
    weight: '',
    height: '',
    heartRate: '',
    temperature: '',
    oxygenLevel: '',
    notes: '',
  });

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const handleSubmit = async () => {
    if (!formData.familyMemberId) {
      Alert.alert('Error', 'Please select a family member');
      return;
    }

    const hasAnyVital =
      formData.bpSystolic ||
      formData.bpDiastolic ||
      formData.bloodSugar ||
      formData.weight ||
      formData.height ||
      formData.heartRate ||
      formData.temperature ||
      formData.oxygenLevel;

    if (!hasAnyVital) {
      Alert.alert('Error', 'Please fill at least one vital sign');
      return;
    }

    setSubmitting(true);

    const vitalData: any = {
      recordDate: formData.recordDate.toISOString().split('T')[0],
      familyMemberId: formData.familyMemberId,
      notes: formData.notes,
    };

    if (formData.bpSystolic && formData.bpDiastolic) {
      vitalData.bloodPressure = {
        systolic: parseInt(formData.bpSystolic),
        diastolic: parseInt(formData.bpDiastolic),
      };
    }
    if (formData.bloodSugar) {
      vitalData.bloodSugar = {
        value: parseFloat(formData.bloodSugar),
        type: formData.bloodSugarType,
      };
    }
    if (formData.weight)
      vitalData.weight = { value: parseFloat(formData.weight) };
    if (formData.height)
      vitalData.height = { value: parseFloat(formData.height) };
    if (formData.heartRate)
      vitalData.heartRate = { value: parseInt(formData.heartRate) };
    if (formData.temperature)
      vitalData.temperature = { value: parseFloat(formData.temperature) };
    if (formData.oxygenLevel)
      vitalData.oxygenLevel = { value: parseInt(formData.oxygenLevel) };

    try {
      await addVitals(vitalData);
      Alert.alert('Success', 'Vitals added! AI analysis in progress...');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add vitals');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMember = members.find(m => m._id === formData.familyMemberId);

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Add Vitals
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Family Member Dropdown */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Select Family Member *
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setShowMemberDropdown(!showMemberDropdown)}
        >
          <Text
            style={[
              styles.dropdownButtonText,
              {
                color: selectedMember
                  ? colors.textPrimary
                  : colors.textTertiary,
              },
            ]}
          >
            {selectedMember
              ? `${selectedMember.name} (${selectedMember.relationship})`
              : 'Choose a family member'}
          </Text>
          <Icon
            name={showMemberDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {showMemberDropdown && (
          <View
            style={[
              styles.dropdownList,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {members.map(member => (
              <TouchableOpacity
                key={member._id}
                style={[
                  styles.dropdownItem,
                  formData.familyMemberId === member._id && {
                    backgroundColor: colors.primaryLight,
                  },
                ]}
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    familyMemberId: member._id,
                  }));
                  setShowMemberDropdown(false);
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {member.relationship === 'self' ? '👤' : '👨‍👩‍👧'}
                </Text>
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {member.name} ({member.relationship})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Record Date */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Record Date *
        </Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar" size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>
            {formData.recordDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.recordDate}
            mode="date"
            maximumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setFormData(prev => ({ ...prev, recordDate: date }));
            }}
          />
        )}

        {/* Blood Pressure */}
        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
          Blood Pressure
        </Text>
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Systolic"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={formData.bpSystolic}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, bpSystolic: text }))
            }
          />
          <Text style={[styles.separator, { color: colors.textPrimary }]}>
            /
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Diastolic"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={formData.bpDiastolic}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, bpDiastolic: text }))
            }
          />
        </View>

        {/* Blood Sugar */}
        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
          Blood Sugar
        </Text>
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Value (mg/dL)"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={formData.bloodSugar}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, bloodSugar: text }))
            }
          />
          <View style={styles.sugarTypeContainer}>
            {(['fasting', 'random', 'post-meal'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.sugarTypeBtn,
                  {
                    backgroundColor:
                      formData.bloodSugarType === type
                        ? colors.primary
                        : colors.card,
                    borderColor:
                      formData.bloodSugarType === type
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() =>
                  setFormData(prev => ({ ...prev, bloodSugarType: type }))
                }
              >
                <Text
                  style={[
                    styles.sugarTypeText,
                    {
                      color:
                        formData.bloodSugarType === type
                          ? colors.white
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {type === 'fasting'
                    ? 'Fasting'
                    : type === 'random'
                    ? 'Random'
                    : 'Post-Meal'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight & Height */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Weight (kg)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="70"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={formData.weight}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, weight: text }))
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Height (cm)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="170"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={formData.height}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, height: text }))
              }
            />
          </View>
        </View>

        {/* Heart Rate, Temperature, Oxygen */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Heart Rate (bpm)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="72"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={formData.heartRate}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, heartRate: text }))
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Temp (°C)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="37.0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={formData.temperature}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, temperature: text }))
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              O₂ (%)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="98"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={formData.oxygenLevel}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, oxygenLevel: text }))
              }
            />
          </View>
        </View>

        {/* Notes */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Notes (Optional)
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.textPrimary,
            },
          ]}
          placeholder="E.g., Feeling tired today / Aaj thakan mehsoos ho rahi hai..."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={formData.notes}
          onChangeText={text => setFormData(prev => ({ ...prev, notes: text }))}
        />

        {/* Tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.infoBg }]}>
          <Text style={[styles.tipText, { color: colors.info }]}>
            💡 Tip: Fill in at least one vital sign. You don't need to fill all
            fields.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Icon name="content-save" size={20} color={colors.white} />
              <Text style={[styles.submitBtnText, { color: colors.white }]}>
                Save Vitals
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { padding: 16 },
  label: { fontSize: 12, fontWeight: '500', marginBottom: 6, marginTop: 12 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  dropdownButtonText: { fontSize: 14, flex: 1 },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemText: { fontSize: 14 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  dateText: { fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  separator: { fontSize: 20, fontWeight: '600' },
  sugarTypeContainer: { flexDirection: 'row', gap: 6 },
  sugarTypeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  sugarTypeText: { fontSize: 11, fontWeight: '500' },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  tipCard: { padding: 12, borderRadius: 8, marginTop: 16, marginBottom: 24 },
  tipText: { fontSize: 12, lineHeight: 18 },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 40,
  },
  submitBtnText: { fontSize: 16, fontWeight: '600' },
});
