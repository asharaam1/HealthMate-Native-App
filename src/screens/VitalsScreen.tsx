import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useVitals } from '../context/VitalsContext';
import { useFamilyMembers } from '../context/FamilyMemberContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SkeletonLoader } from '../components/SkeletonLoader';

// Vital Card with Delete Button
const VitalCard = ({
  vital,
  onPress,
  onDelete,
}: {
  vital: any;
  onPress: () => void;
  onDelete: () => void;
}) => {
  const { colors, radius } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.vitalCard,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.vitalHeader}>
        <View style={styles.vitalHeaderLeft}>
          <Icon name="heart-pulse" size={22} color={colors.primary} />
          <Text style={[styles.vitalDate, { color: colors.textSecondary }]}>
            {formatDate(vital.recordDate || vital.recordedAt)}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Icon name="delete-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.vitalValues}>
        {vital.bloodPressure?.systolic && (
          <View style={styles.vitalItem}>
            <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
              BP
            </Text>
            <Text style={[styles.vitalValue, { color: colors.textPrimary }]}>
              {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
            </Text>
          </View>
        )}
        {vital.bloodSugar?.value && (
          <View style={styles.vitalItem}>
            <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
              Sugar
            </Text>
            <Text style={[styles.vitalValue, { color: colors.textPrimary }]}>
              {vital.bloodSugar.value} {vital.bloodSugar.unit || 'mg/dL'}
            </Text>
          </View>
        )}
        {vital.weight?.value && (
          <View style={styles.vitalItem}>
            <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
              Weight
            </Text>
            <Text style={[styles.vitalValue, { color: colors.textPrimary }]}>
              {vital.weight.value} {vital.weight.unit || 'kg'}
            </Text>
          </View>
        )}
        {vital.heartRate?.value && (
          <View style={styles.vitalItem}>
            <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
              HR
            </Text>
            <Text style={[styles.vitalValue, { color: colors.textPrimary }]}>
              {vital.heartRate.value} bpm
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({
  members,
  selectedMemberId,
  onSelect,
}: {
  members: any[];
  selectedMemberId: string | null;
  onSelect: (id: string | null) => void;
}) => {
  const { colors } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedMember = members.find(m => m._id === selectedMemberId);

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Icon name="account-filter" size={20} color={colors.primary} />
        <Text style={[styles.filterButtonText, { color: colors.textPrimary }]}>
          {selectedMemberId
            ? selectedMember?.name || 'Select'
            : 'All Family Members'}
        </Text>
        <Icon
          name={showDropdown ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {showDropdown && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.dropdownItem,
              !selectedMemberId && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => {
              onSelect(null);
              setShowDropdown(false);
            }}
          >
            <Icon name="account-group" size={18} color={colors.primary} />
            <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
              All Family Members
            </Text>
          </TouchableOpacity>
          {members.map(member => (
            <TouchableOpacity
              key={member._id}
              style={[
                styles.dropdownItem,
                selectedMemberId === member._id && {
                  backgroundColor: colors.primaryLight,
                },
              ]}
              onPress={() => {
                onSelect(member._id);
                setShowDropdown(false);
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {member.relationship === 'self' ? '👤' : '👨‍👩‍👧'}
              </Text>
              <Text
                style={[styles.dropdownText, { color: colors.textPrimary }]}
              >
                {member.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function VitalsTab() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { vitals, getVitals, deleteVital, loading } = useVitals();
  const { members, fetchFamilyMembers } = useFamilyMembers();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);
  useEffect(() => {
    fetchVitals();
  }, [selectedMemberId]);
  useFocusEffect(
    useCallback(() => {
      fetchVitals();
    }, [selectedMemberId]),
  );

  const fetchVitals = async () => {
    const params: any = {};
    if (selectedMemberId) params.familyMemberId = selectedMemberId;
    await getVitals(params);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVitals();
    setRefreshing(false);
  }, [selectedMemberId]);

  const handleDelete = (vitalId: string) => {
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
            fetchVitals();
          },
        },
      ],
    );
  };

  if (loading && !refreshing && vitals.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Vitals
          </Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            Track your health metrics
          </Text>
        </View>
        <SkeletonLoader count={3} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Vitals
        </Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
          Track your health metrics
        </Text>
      </View>

      {members.length > 0 && (
        <FilterDropdown
          members={members}
          selectedMemberId={selectedMemberId}
          onSelect={setSelectedMemberId}
        />
      )}

      <FlatList
        data={vitals}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <VitalCard
            vital={item}
            onPress={() =>
              navigation.navigate('VitalAnalysis', { vitalId: item._id })
            }
            onDelete={() => handleDelete(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Vitals Yet
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Tap + to add your first vital
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddVitals')}
      >
        <Icon name="plus" size={28} color={colors.primaryText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  filterContainer: { paddingHorizontal: 16, marginVertical: 12, zIndex: 10 },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  filterButtonText: { flex: 1, fontSize: 14, fontWeight: '500', marginLeft: 8 },
  dropdown: {
    position: 'absolute',
    top: 55,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 20,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: { fontSize: 14, fontWeight: '500' },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 80 },
  vitalCard: { marginBottom: 12, padding: 16, borderWidth: 0.5 },
  vitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vitalDate: { fontSize: 12 },
  deleteBtn: { padding: 4 },
  vitalValues: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  vitalItem: { alignItems: 'center', gap: 4 },
  vitalLabel: { fontSize: 11, textTransform: 'uppercase' },
  vitalValue: { fontSize: 15, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center' },
});
