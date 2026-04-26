import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/theme';
import { useFamilyMembers } from '../context/FamilyMemberContext';

interface FamilyMemberSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const FamilyMemberSelector: React.FC<FamilyMemberSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  const { colors, radius } = useTheme();
  const { members, fetchFamilyMembers, loading } = useFamilyMembers();

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View
        style={[
          styles.empty,
          { backgroundColor: colors.infoBg, borderRadius: radius.md },
        ]}
      >
        <Text style={{ fontSize: 24 }}>👤</Text>
        <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
          No family members added
        </Text>
        <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
          Add a family member first in Profile tab
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        For Whom?
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.chipContainer}>
          {members.map(member => (
            <TouchableOpacity
              key={member._id}
              style={[
                styles.memberChip,
                {
                  backgroundColor:
                    selectedId === member._id ? colors.primary : colors.card,
                  borderColor:
                    selectedId === member._id ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
              onPress={() => onSelect(member._id)}
            >
              <Text style={{ fontSize: 16 }}>
                {member.relationship === 'self' ? '👤' : '👨‍👩‍👧'}
              </Text>
              <Text
                style={[
                  styles.memberName,
                  {
                    color:
                      selectedId === member._id
                        ? colors.primaryText
                        : colors.textPrimary,
                  },
                ]}
              >
                {member.name} ({member.relationship})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scroll: {
    flexDirection: 'row',
  },
  chipContainer: {
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
    marginRight: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  empty: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
