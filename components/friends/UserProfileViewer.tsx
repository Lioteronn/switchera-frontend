import { supabaseFriendsRepository, UserWithProfile } from '@/api/supabaseFriendsRepository';
import { getUserAuthStatus } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MutualFriends from './MutualFriends';

interface UserProfileViewerProps {
  userId: number;
  onClose: () => void;
}

export default function UserProfileViewer({ userId, onClose }: UserProfileViewerProps) {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [userStats, setUserStats] = useState({ friends_count: 0, followers_count: 0, following_count: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchUserProfile = React.useCallback(async (currentUserId: number) => {
    try {
      const profile = await supabaseFriendsRepository.getUserProfile(userId, currentUserId);
      setUser(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserStats = React.useCallback(async () => {
    try {
      const stats = await supabaseFriendsRepository.getUserStats(userId);
      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, [userId]);

  useEffect(() => {
    const initialize = async () => {
      const authStatus = await getUserAuthStatus();
      setCurrentUserId(authStatus.userId);
      if (authStatus.userId) {
        await Promise.all([
          fetchUserProfile(authStatus.userId),
          fetchUserStats()
        ]);
      }
    };
    initialize();
  }, [fetchUserProfile, fetchUserStats]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !user || updating) return;

    setUpdating(true);
    try {
      if (user.is_following) {
        await supabaseFriendsRepository.unfollowUser(currentUserId, userId);
        setUser(prev => prev ? { ...prev, is_following: false } : null);
        setUserStats(prev => ({ ...prev, followers_count: prev.followers_count - 1 }));
      } else {
        await supabaseFriendsRepository.followUser(currentUserId, userId);
        setUser(prev => prev ? { ...prev, is_following: true } : null);
        setUserStats(prev => ({ ...prev, followers_count: prev.followers_count + 1 }));
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update follow status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddFriend = async () => {
    if (!currentUserId || !user || updating) return;

    setUpdating(true);
    try {
      await supabaseFriendsRepository.addFriend(currentUserId, userId);
      setUser(prev => prev ? { ...prev, is_friend: true } : null);
      setUserStats(prev => ({ ...prev, friends_count: prev.friends_count + 1 }));
      Alert.alert('Success', `You are now friends with ${user.first_name || user.username}!`);
    } catch (error) {
      console.error('Add friend error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add friend');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!currentUserId || !user) return;

    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${user.first_name || user.username} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setUpdating(true);
            try {
              await supabaseFriendsRepository.removeFriend(currentUserId, userId);
              setUser(prev => prev ? { ...prev, is_friend: false } : null);
              setUserStats(prev => ({ ...prev, friends_count: prev.friends_count - 1 }));
            } catch (error) {
              console.error('Remove friend error:', error);
              Alert.alert('Error', 'Failed to remove friend');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const getFullName = () => {
    if (!user) return '';
    return user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.username;
  };

  const formatInterests = (interests: any) => {
    if (!interests) return [];
    if (typeof interests === 'string') {
      try {
        return JSON.parse(interests);
      } catch {
        return [interests];
      }
    }
    return Array.isArray(interests) ? interests : [];
  };

  const formatSpecialities = (speciality: any) => {
    if (!speciality) return [];
    if (typeof speciality === 'string') {
      try {
        return JSON.parse(speciality);
      } catch {
        return [speciality];
      }
    }
    return Array.isArray(speciality) ? speciality : [];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnProfile = currentUserId === userId;
  const interests = formatInterests(user.profile?.interests);
  const specialities = formatSpecialities(user.profile?.speciality);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>            <Image
              source={
                user.profile?.profile_picture 
                  ? { uri: user.profile.profile_picture }
                  : require('@/assets/images/default-avatar.png')
              }
            style={styles.profileImage}
          />
          <Text style={styles.fullName}>{getFullName()}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          
          {user.profile?.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.location}>{user.profile.location}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.friends_count}</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.followers_count}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <View style={styles.actionButtonsContainer}>
              {!user.is_friend ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.addFriendButton]}
                  onPress={handleAddFriend}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="person-add" size={16} color="white" />
                      <Text style={styles.actionButtonText}>Add Friend</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeFriendButton]}
                  onPress={handleRemoveFriend}
                  disabled={updating}
                >
                  <Ionicons name="person-remove" size={16} color="#666" />
                  <Text style={[styles.actionButtonText, { color: '#666' }]}>Remove Friend</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  user.is_following ? styles.unfollowButton : styles.followButton
                ]}
                onPress={handleFollowToggle}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color={user.is_following ? "#666" : "white"} />
                ) : (
                  <>
                    <Ionicons 
                      name={user.is_following ? "person-remove-outline" : "person-add-outline"} 
                      size={16} 
                      color={user.is_following ? "#666" : "white"} 
                    />
                    <Text style={[
                      styles.actionButtonText,
                      user.is_following && { color: '#666' }
                    ]}>
                      {user.is_following ? 'Unfollow' : 'Follow'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bio Section */}
        {user.profile?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{user.profile.bio}</Text>
          </View>
        )}

        {/* Interests Section */}
        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tagsContainer}>
              {interests.map((interest: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Specialities Section */}
        {specialities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialities</Text>
            <View style={styles.tagsContainer}>
              {specialities.map((speciality: string, index: number) => (
                <View key={index} style={[styles.tag, styles.specialityTag]}>
                  <Text style={[styles.tagText, styles.specialityTagText]}>{speciality}</Text>
                </View>
              ))}
            </View>
          </View>
        )}        {/* Rating */}
        {user.profile?.rating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{user.profile.rating.toFixed(1)}</Text>
            </View>
          </View>
        )}

        {/* Mutual Friends */}
        {!isOwnProfile && currentUserId && (
          <MutualFriends 
            userId={userId}
            currentUserId={currentUserId}
            onUserSelected={(friend) => {
              // You could implement navigation to that friend's profile here
              console.log('Selected mutual friend:', friend);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e1e5e9',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    minWidth: 120,
    justifyContent: 'center',
  },
  addFriendButton: {
    backgroundColor: '#007AFF',
  },
  removeFriendButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  followButton: {
    backgroundColor: '#34C759',
  },
  unfollowButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialityTag: {
    backgroundColor: '#e8f5e8',
  },
  tagText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  specialityTagText: {
    color: '#2e7d32',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
