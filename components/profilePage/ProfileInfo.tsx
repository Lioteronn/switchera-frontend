import * as ImagePicker from 'expo-image-picker';
import { Camera, Edit2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileInfoProps {
  userId: string;
  currentUserId: string;
  profile: any;
  onProfileUpdate: (data: any) => Promise<void>;
}

export default function ProfileInfo({ 
  userId, 
  currentUserId, 
  profile, 
  onProfileUpdate 
}: ProfileInfoProps) {
  const [uploading, setUploading] = useState(false);
  const isOwnProfile = userId === currentUserId;

  const handleImagePick = async () => {
    if (!isOwnProfile) return;

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('image', {
            uri: result.assets[0].uri,
            type: 'image/jpeg',
            name: 'profile-image.jpg',
          } as any); // 'as any' is needed for React Native FormData compatibility

          await onProfileUpdate({ image: formData });
        } catch (error) {
          alert('Failed to upload image');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              profile?.image
                ? { uri: profile.image }
                : require('@/assets/images/default-avatar.png')
            }
            style={styles.profileImage}
          />
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.imageEditButton}
              onPress={handleImagePick}
              disabled={uploading}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{profile?.username}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          <Text style={styles.bio} numberOfLines={3}>
            {profile?.bio || 'No bio available'}
          </Text>
        </View>

        {/* Edit Button (only for own profile) */}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onProfileUpdate(profile)}
          >
            <Edit2 size={20} color="#4b5563" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.followers || '0'}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.following || '0'}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.services?.length || '0'}</Text>
          <Text style={styles.statLabel}>Services</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.posts?.length || '0'}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    lineHeight: 20,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
})
