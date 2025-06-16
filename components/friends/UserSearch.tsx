import { supabaseFriendsRepository, UserWithProfile } from '@/api/supabaseFriendsRepository';
import { getUserAuthStatus } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface UserSearchProps {
  onUserSelected?: (user: UserWithProfile) => void;
}

export default function UserSearch({ onUserSelected }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  React.useEffect(() => {
    // Get current user ID
    const getCurrentUser = async () => {
      const authStatus = await getUserAuthStatus();
      setCurrentUserId(authStatus.userId);
    };
    getCurrentUser();
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim() || !currentUserId) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await supabaseFriendsRepository.searchUsers(query, currentUserId);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(text);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleFollowToggle = async (user: UserWithProfile) => {
    if (!currentUserId) return;

    try {
      if (user.is_following) {
        await supabaseFriendsRepository.unfollowUser(currentUserId, user.id);
        user.is_following = false;
      } else {
        await supabaseFriendsRepository.followUser(currentUserId, user.id);
        user.is_following = true;
      }
      
      // Update the results
      setSearchResults(prev => 
        prev.map(u => u.id === user.id ? { ...u, is_following: user.is_following } : u)
      );
    } catch (error) {
      console.error('Follow toggle error:', error);
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  const handleAddFriend = async (user: UserWithProfile) => {
    if (!currentUserId) return;

    try {
      await supabaseFriendsRepository.addFriend(currentUserId, user.id);
      
      // Update the results
      setSearchResults(prev => 
        prev.map(u => u.id === user.id ? { ...u, is_friend: true } : u)
      );
      
      Alert.alert('Success', `You are now friends with ${user.first_name || user.username}!`);
    } catch (error) {
      console.error('Add friend error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add friend');
    }
  };

  const renderUserItem = ({ item: user }: { item: UserWithProfile }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => onUserSelected?.(user)}
    >
      <View style={styles.userInfo}>          <Image
            source={
              user.profile?.profile_picture 
                ? { uri: user.profile.profile_picture }
                : require('@/assets/images/default-avatar.png')
            }
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {user.first_name && user.last_name 
              ? `${user.first_name} ${user.last_name}`
              : user.username
            }
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
          {user.profile?.bio && (
            <Text style={styles.bio} numberOfLines={1}>
              {user.profile.bio}
            </Text>
          )}
          {user.profile?.location && (
            <Text style={styles.location}>📍 {user.profile.location}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        {!user.is_friend && (
          <TouchableOpacity
            style={[styles.actionButton, styles.addFriendButton]}
            onPress={() => handleAddFriend(user)}
          >
            <Ionicons name="person-add" size={16} color="white" />
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            user.is_following ? styles.unfollowButton : styles.followButton
          ]}
          onPress={() => handleFollowToggle(user)}
        >
          <Ionicons 
            name={user.is_following ? "person-remove" : "person-add-outline"} 
            size={16} 
            color={user.is_following ? "#666" : "white"} 
          />
          <Text style={[
            styles.buttonText,
            user.is_following && styles.unfollowButtonText
          ]}>
            {user.is_following ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Find People</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or username..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
          />
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          searchQuery.length > 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bio: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addFriendButton: {
    backgroundColor: '#007AFF',
  },
  followButton: {
    backgroundColor: '#34C759',
  },
  unfollowButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  unfollowButtonText: {
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
