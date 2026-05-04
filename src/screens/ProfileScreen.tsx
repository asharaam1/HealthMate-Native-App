import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useFamilyMembers } from '../context/FamilyMemberContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FamilyMemberCard = ({
  member,
  onPress,
  onDelete,
}: {
  member: any;
  onPress: () => void;
  onDelete: () => void;
}) => {
  const { colors, radius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.memberCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.memberInfo}>
        <Text style={styles.memberAvatar}>
          {member.relationship === 'self' ? '👤' : '👨‍👩‍👧'}
        </Text>
        <View style={styles.memberDetails}>
          <Text style={[styles.memberName, { color: colors.textPrimary }]}>
            {member.name}
          </Text>
          <Text
            style={[styles.memberRelationship, { color: colors.textSecondary }]}
          >
            {member.relationship}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Icon name="delete-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const SettingsItem = ({
  icon,
  title,
  onPress,
  showArrow = true,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingsItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.settingsLeft}>
        <Icon name={icon} size={22} color={colors.primary} />
        <Text style={[styles.settingsTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      {showArrow && (
        <Icon name="chevron-right" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { members, fetchFamilyMembers, deleteFamilyMember } =
    useFamilyMembers();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout(), style: 'destructive' },
    ]);
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to remove ${memberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteFamilyMember(memberId);
            fetchFamilyMembers();
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Profile
          </Text>
        </View>

        {/* User Info Card */}
        <View
          style={[
            styles.userCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.userAvatar}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.userAvatarImage}
              />
            ) : (
              <Text style={styles.userAvatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            )}
          </View>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email}
          </Text>
          <TouchableOpacity
            style={[styles.editProfileBtn, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={[styles.editProfileText, { color: colors.primary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Family Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Family Members
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddFamilyMember')}
            >
              <Icon name="plus-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {members.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={styles.emptyIcon}>👨‍👩‍👧</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No family members added
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddFamilyMember')}
              >
                <Text style={[styles.addLink, { color: colors.primary }]}>
                  Add your first family member
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            members.map(member => (
              <FamilyMemberCard
                key={member._id}
                member={member}
                onPress={() =>
                  navigation.navigate('EditFamilyMember', {
                    memberId: member._id,
                  })
                }
                onDelete={() => handleDeleteMember(member._id, member.name)}
              />
            ))
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Settings
          </Text>

          {/* Theme Toggle */}
          <View
            style={[styles.themeToggle, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingsLeft}>
              <Icon name="theme-light-dark" size={22} color={colors.primary} />
              <Text
                style={[styles.settingsTitle, { color: colors.textPrimary }]}
              >
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>

          <SettingsItem
            icon="account-edit"
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingsItem
            icon="bell-outline"
            title="Notifications"
            onPress={() => {}}
          />
          <SettingsItem
            icon="information-outline"
            title="About"
            onPress={() => {}}
          />
          <SettingsItem
            icon="logout"
            title="Logout"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: colors.textTertiary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
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

  userCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0.5,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userAvatarText: { fontSize: 32, fontWeight: '600', color: '#fff' },
  userName: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 16 },
  editProfileBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileText: { fontSize: 13, fontWeight: '500' },

  section: { marginHorizontal: 16, marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600' },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  memberAvatar: { fontSize: 32 },
  memberDetails: { gap: 2 },
  memberName: { fontSize: 16, fontWeight: '500' },
  memberRelationship: { fontSize: 12, textTransform: 'capitalize' },
  deleteBtn: { padding: 8 },

  emptyState: {
    alignItems: 'center',
    padding: 30,
    borderWidth: 0.5,
    borderRadius: 12,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, marginBottom: 8 },
  addLink: { fontSize: 14, fontWeight: '500' },

  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsTitle: { fontSize: 15, fontWeight: '500' },

  version: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontSize: 12,
  },
});
