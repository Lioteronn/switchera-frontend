import { ProfileWithUser } from '@/api/supabaseProfileRepository';
import * as ImagePicker from 'expo-image-picker';
import { Briefcase, Calendar, Camera, Edit2, Heart, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileEditModal from './ProfileEditModal';

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
  const [editModalVisible, setEditModalVisible] = useState(false);
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
        } catch (uploadError) {
          alert('Failed to upload image');
          console.error('Upload error:', uploadError);
        } finally {
          setUploading(false);
        }
      }
    } catch (pickError) {
      console.error('Error picking image:', pickError);
    }
  };
  const handleProfileUpdated = async (updatedProfile: ProfileWithUser) => {
    await onProfileUpdate(updatedProfile);
  };
  // Debug logging
  console.log('ProfileInfo Debug:', { 
    userId, 
    currentUserId, 
    userIdParsed: parseInt(userId),
    profile,
    profileUserId: profile?.user_id,
    profileId: profile?.id
  });

  // Try multiple sources for user ID
  const extractUserId = () => {
    // First try the passed userId
    if (userId && !isNaN(parseInt(userId))) {
      return parseInt(userId);
    }
    
    // Then try from profile data
    if (profile?.user_id && !isNaN(parseInt(profile.user_id))) {
      return parseInt(profile.user_id);
    }
    
    // Then try the profile id itself
    if (profile?.id && !isNaN(parseInt(profile.id))) {
      return parseInt(profile.id);
    }
    
    return null;
  };
  const numericUserId = extractUserId();

  // Helper function to get full name
  const getFullName = () => {
    const firstName = profile?.auth_user?.first_name || profile?.first_name || '';
    const lastName = profile?.auth_user?.last_name || profile?.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    return profile?.auth_user?.username || profile?.username || 'Unknown User';
  };

  // Helper function to format birth date
  const formatBirthDate = () => {
    if (!profile?.birth_date) return null;
    try {
      const date = new Date(profile.birth_date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return profile.birth_date;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              profile?.profile_picture || profile?.image
                ? { uri: profile.profile_picture || profile.image }
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
          {/* Full Name */}
          <Text style={styles.fullName}>{getFullName()}</Text>
          
          {/* Username */}
          <Text style={styles.username}>@{profile?.auth_user?.username || profile?.username || 'username'}</Text>
          
          {/* Bio */}
          {profile?.bio && (
            <Text style={styles.bio} numberOfLines={3}>
              {profile.bio}
            </Text>
          )}
        </View>

        {/* Edit Button (only for own profile) */}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              console.log('Edit button clicked, numericUserId:', numericUserId);
              if (numericUserId) {
                setEditModalVisible(true);
              } else {
                // Show modal anyway with a warning, let the modal handle the error
                console.warn('No valid user ID found, but showing modal anyway');
                setEditModalVisible(true);
              }
            }}
          >
            <Edit2 size={20} color="#4b5563" />
          </TouchableOpacity>
        )}
      </View>

      {/* Detailed Info Section */}
      <View style={styles.detailsSection}>
        {/* Location */}
        {profile?.location && (
          <View style={styles.detailItem}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.detailText}>{profile.location}</Text>
          </View>
        )}

        {/* Speciality */}
        {profile?.speciality && (
          <View style={styles.detailItem}>
            <Briefcase size={16} color="#6b7280" />
            <Text style={styles.detailText}>{profile.speciality}</Text>
          </View>
        )}

        {/* Interests */}
        {profile?.interests && (
          <View style={styles.detailItem}>
            <Heart size={16} color="#6b7280" />
            <Text style={styles.detailText}>{profile.interests}</Text>
          </View>
        )}

        {/* Birth Date */}
        {formatBirthDate() && (
          <View style={styles.detailItem}>
            <Calendar size={16} color="#6b7280" />
            <Text style={styles.detailText}>{formatBirthDate()}</Text>
          </View>
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
          <Text style={styles.statValue}>{profile?.servicesCount || '0'}</Text>
          <Text style={styles.statLabel}>Services</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.posts?.length || '0'}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>{/* Profile Edit Modal */}
      <ProfileEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
        userId={numericUserId || 0}
        onProfileUpdated={handleProfileUpdated}
      />
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
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  detailsSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
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
