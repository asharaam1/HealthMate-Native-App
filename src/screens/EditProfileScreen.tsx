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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../api/api';
import type { User } from '../types';

export default function EditProfileScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation();
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null,
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          setProfileImage(asset.uri);
          uploadProfileImage(asset);
        }
      }
    });
  };
  const uploadProfileImage = async (asset: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName,
      } as any);

      const response = await api.put('/auth/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const updatedUser: User = {
          ...user!,
          profileImage: response.data.imageUrl,
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);
        Alert.alert('Success', 'Profile photo updated');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/auth/profile', { name, phone });
      if (response.data.success) {
        const updatedUser: User = {
          ...user!,
          name,
          phone,
        };

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);

        Alert.alert('Success', 'Profile updated', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
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
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={styles.saveButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.saveText, { color: colors.primary }]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            {profileImage ? (
              <Image
                source={{ uri: String(profileImage) }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={[styles.avatarText, { color: colors.primaryText }]}
                >
                  {getInitials(name || 'U')}
                </Text>
              </View>
            )}
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="white" />
              </View>
            )}
            <View
              style={[styles.cameraIcon, { backgroundColor: colors.primary }]}
            >
              <Icon name="camera" size={16} color={colors.primaryText} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoNote, { color: colors.textTertiary }]}>
            Tap to change photo
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Full Name
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
            placeholder="Enter your full name"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Email Address
          </Text>
          <View
            style={[
              styles.readOnlyField,
              {
                backgroundColor: colors.backgroundSecond,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text
              style={[styles.readOnlyText, { color: colors.textSecondary }]}
            >
              {user?.email}
            </Text>
            <Text
              style={[styles.disabledBadge, { color: colors.textTertiary }]}
            >
              Cannot change
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Phone Number
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
            placeholder="Enter your phone number"
            placeholderTextColor={colors.textTertiary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
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
  saveButton: { padding: 4 },
  saveText: { fontSize: 16, fontWeight: '600' },
  content: { padding: 20 },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 40, fontWeight: '600' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  uploadingOverlay: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNote: { fontSize: 12, marginTop: 8 },

  form: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 4,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  readOnlyText: { fontSize: 15 },
  disabledBadge: { fontSize: 11, fontStyle: 'italic' },
});
