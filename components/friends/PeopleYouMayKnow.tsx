import { supabaseFriendsRepository, UserWithProfile } from '@/api/supabaseFriendsRepository';
import { getUserAuthStatus } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface PeopleYouMayKnowProps {
  onUserSelected?: (user: UserWithProfile) => void;
  limit?: number;
}

export default function PeopleYouMayKnow({ onUserSelected, limit = 10 }: PeopleYouMayKnowProps) {
  const [suggestions, setSuggestions] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const getCurrentUser = useCallback(async () => {
    const authStatus = await getUserAuthStatus();
    setCurrentUserId(authStatus.userId);
  }, []);

  const fetchSuggestions = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      const suggestedUsers = await supabaseFriendsRepository.getSuggestedFriends(currentUserId, limit);
      setSuggestions(suggestedUsers);
    } catch (error) {
      console.error('Error fetching friend suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, limit]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSuggestions();
    setRefreshing(false);
  }, [fetchSuggestions]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (currentUserId) {
      fetchSuggestions();
    }
  }, [currentUserId, fetchSuggestions]);

  const handleAddFriend = async (user: UserWithProfile) => {
    if (!currentUserId) return;

    try {
      await supabaseFriendsRepository.addFriend(currentUserId, user.id);
      Alert.alert('Success', `Friend request sent to ${user.username}`);
      
      // Update the user's status in the list
      setSuggestions(prev => 
        prev.map(u => 
          u.id === user.id 
            ? { ...u, is_friend: true }
            : u
        )
      );
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const handleFollow = async (user: UserWithProfile) => {
    if (!currentUserId) return;

    try {
      if (user.is_following) {
        await supabaseFriendsRepository.unfollowUser(currentUserId, user.id);
      } else {
        await supabaseFriendsRepository.followUser(currentUserId, user.id);
      }
      
      // Update the user's status in the list
      setSuggestions(prev => 
        prev.map(u => 
          u.id === user.id 
            ? { ...u, is_following: !u.is_following }
            : u
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  const renderSuggestion = ({ item }: { item: UserWithProfile }) => (
    <TouchableOpacity 
      style={styles.suggestionCard}
      onPress={() => onUserSelected?.(item)}
    >
      <Image
        source={
          item.profile?.profile_picture
            ? { uri: item.profile.profile_picture }
            : require('@/assets/images/default-avatar.png')
        }
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.first_name && item.last_name
            ? `${item.first_name} ${item.last_name}`
            : item.username}
        </Text>
        <Text style={styles.userHandle}>@{item.username}</Text>
        
        {item.profile?.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#666" />
            <Text style={styles.location}>{item.profile.location}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        {!item.is_friend && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              handleAddFriend(item);
            }}
          >
            <Ionicons name="person-add" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.followButton,
            item.is_following && styles.followingButton
          ]}
          onPress={(e) => {
            e.stopPropagation();
            handleFollow(item);
          }}
        >
          <Ionicons 
            name={item.is_following ? "checkmark" : "add"} 
            size={14} 
            color={item.is_following ? "#28a745" : "#007AFF"} 
          />
          <Text style={[
            styles.followButtonText,
            item.is_following && styles.followingButtonText
          ]}>
            {item.is_following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding people you may know...</Text>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No suggestions</Text>
        <Text style={styles.emptySubtitle}>
          Check back later for new friend suggestions
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={20} color="#007AFF" />
        <Text style={styles.headerTitle}>People you may know</Text>
      </View>
      
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={(item) => `suggestion-${item.id}`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
  },
  followingButton: {
    backgroundColor: '#e8f5e8',
  },
  followButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  followingButtonText: {
    color: '#28a745',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
