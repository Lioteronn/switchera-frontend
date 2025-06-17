import { ProfileWithUser, supabaseProfileRepository } from '@/api/supabaseProfileRepository';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Briefcase, Calendar, Camera, Edit2, Heart, MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileEditModal from './ProfileEditModal';

interface UserMetadata {
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface ExtendedUser {
  user_metadata: UserMetadata;
}

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
  const [supabaseUserId, setSupabaseUserId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
    services: 0
  });
  const { user } = useAuth();
  const isOwnProfile = userId === currentUserId;

  // Get user ID from Supabase using username from auth context
  useEffect(() => {
    const getUserIdFromUsername = async () => {
      try {
        // First try to get the user ID from the profile
        if (profile?.user_id) {
          console.log('Found user ID in profile:', profile.user_id);
          setSupabaseUserId(Number(profile.user_id));
          return;
        }

        // If not in profile, try to get from auth_user table
        const { data: authUser, error } = await supabase
          .from('auth_user')
          .select('id')
          .eq('username', profile?.username)
          .single();

        if (error) {
          console.error('Error fetching user ID:', error);
          return;
        }

        if (authUser?.id) {
          console.log('Found user ID from auth_user:', authUser.id);
          setSupabaseUserId(authUser.id);
        } else {
          console.error('No user ID found for username:', profile?.username);
        }
      } catch (err) {
        console.error('Error in getUserIdFromUsername:', err);
      }
    };

    if (profile) {
      getUserIdFromUsername();
    }
  }, [profile]);

  // Fetch profile stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!supabaseUserId) return;

      try {
        // Fetch followers count
        const { count: followersCount } = await supabase
          .from('users_userfollow')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', supabaseUserId);

        // Fetch following count
        const { count: followingCount } = await supabase
          .from('users_userfollow')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', supabaseUserId);

        // Fetch posts count
        const { count: postsCount } = await supabase
          .from('users_post')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', supabaseUserId);

        // Fetch services count
        const { count: servicesCount } = await supabase
          .from('users_service')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', supabaseUserId);

        setStats({
          followers: followersCount || 0,
          following: followingCount || 0,
          posts: postsCount || 0,
          services: servicesCount || 0
        });

        console.log('Profile stats fetched:', {
          followers: followersCount,
          following: followingCount,
          posts: postsCount,
          services: servicesCount
        });
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      }
    };

    fetchStats();
  }, [supabaseUserId]);

  const handleImagePick = async () => {
    if (!isOwnProfile) return;

    if (!supabaseUserId) {
      Alert.alert(
        'Error',
        'Could not determine user ID. Please try refreshing the page.',
        [{ text: 'OK' }]
      );
      return;
    }

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
          // Convert URI to blob for upload
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();

          const fileName = `profile-${Date.now()}.jpg`;
          const imageUrl = await supabaseProfileRepository.uploadProfilePicture(
            supabaseUserId,
            blob,
            fileName
          );

          // Update profile with new picture URL
          await onProfileUpdate({ profile_picture: imageUrl });
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          Alert.alert(
            'Error',
            'Failed to upload image. Please try again.',
            [{ text: 'OK' }]
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (pickError) {
      console.error('Error picking image:', pickError);
      Alert.alert(
        'Error',
        'Failed to pick image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleProfileUpdated = async (updatedProfile: ProfileWithUser) => {
    await onProfileUpdate(updatedProfile);
  };

  // Debug logging
  console.log('ProfileInfo Debug:', { 
    userId, 
    currentUserId, 
    supabaseUserId,
    profile,
    profileUserId: profile?.user_id,
    profileId: profile?.id,
    profileUsername: profile?.username
  });

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

  // Stats Overview
  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.followers}</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.following}</Text>
        <Text style={styles.statLabel}>Following</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.posts}</Text>
        <Text style={styles.statLabel}>Posts</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.services}</Text>
        <Text style={styles.statLabel}>Services</Text>
      </View>
    </View>
  );

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
              const userIdToUse = supabaseUserId || profile?.user_id;
              if (!userIdToUse) {
                Alert.alert(
                  'Error',
                  'Could not determine user ID. Please try refreshing the page.',
                  [{ text: 'OK' }]
                );
                return;
              }
              console.log('Edit button clicked, userId:', userIdToUse);
              setEditModalVisible(true);
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
      {renderStats()}

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
        userId={supabaseUserId || Number(profile?.user_id) || 0}
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
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
})
