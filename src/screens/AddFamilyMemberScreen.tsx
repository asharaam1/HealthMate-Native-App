import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useFamilyMembers } from '../context/FamilyMemberContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const RELATIONSHIPS = [
  'self',
  'spouse',
  'son',
  'daughter',
  'father',
  'mother',
  'brother',
  'sister',
  'other',
];

export default function AddFamilyMemberScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation();
  const { createFamilyMember, loading } = useFamilyMembers();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('self');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter name');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('relationship', relationship);
    formData.append('dateOfBirth', dateOfBirth.toISOString().split('T')[0]);
    formData.append('gender', gender);
    if (phone) formData.append('phone', phone);

    try {
      await createFamilyMember(formData);
      Alert.alert('Success', 'Family member added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add family member');
    }
  };

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
          Add Family Member
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Name */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Full Name *
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
          placeholder="Enter name"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        {/* Relationship */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Relationship *
        </Text>
        <View style={styles.relationshipContainer}>
          {RELATIONSHIPS.map(rel => (
            <TouchableOpacity
              key={rel}
              style={[
                styles.relChip,
                {
                  backgroundColor:
                    relationship === rel ? colors.primary : colors.card,
                  borderColor:
                    relationship === rel ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
              onPress={() => setRelationship(rel)}
            >
              <Text
                style={[
                  styles.relText,
                  {
                    color:
                      relationship === rel
                        ? colors.primaryText
                        : colors.textPrimary,
                  },
                ]}
              >
                {rel.charAt(0).toUpperCase() + rel.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date of Birth */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Date of Birth
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
            {dateOfBirth.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            maximumDate={new Date()}
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setDateOfBirth(date);
            }}
          />
        )}

        {/* Gender */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Gender
        </Text>
        <View style={styles.genderContainer}>
          {['male', 'female', 'other'].map(gen => (
            <TouchableOpacity
              key={gen}
              style={[
                styles.genderBtn,
                {
                  backgroundColor:
                    gender === gen ? colors.primary : colors.card,
                  borderColor: gender === gen ? colors.primary : colors.border,
                  borderRadius: radius.md,
                },
              ]}
              onPress={() => setGender(gen)}
            >
              <Text
                style={[
                  styles.genderText,
                  {
                    color:
                      gender === gen ? colors.primaryText : colors.textPrimary,
                  },
                ]}
              >
                {gen.charAt(0).toUpperCase() + gen.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phone (Optional) */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Phone (Optional)
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
          placeholder="Enter phone number"
          placeholderTextColor={colors.textTertiary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: loading ? colors.textTertiary : colors.primary,
              borderRadius: radius.lg,
            },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={[styles.submitText, { color: colors.primaryText }]}>
              Add Family Member
            </Text>
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
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  relChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  relText: { fontSize: 13, fontWeight: '500' },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dateText: { fontSize: 14, flex: 1 },
  genderContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  genderText: { fontSize: 14, fontWeight: '500' },
  submitBtn: { paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  submitText: { fontSize: 16, fontWeight: '700' },
});
