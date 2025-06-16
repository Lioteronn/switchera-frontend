import { FriendRequest, supabaseFriendsRepository } from '@/api/supabaseFriendsRepository';
import { getUserAuthStatus } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface FriendsListProps {
  onFriendSelected?: (friend: FriendRequest) => void;
  refreshTrigger?: number;
}

export default function FriendsList({ onFriendSelected, refreshTrigger }: FriendsListProps) {
  const [friends, setFriends] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchFriends = React.useCallback(async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const friendsList = await supabaseFriendsRepository.getFriends(currentUserId);
      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to load friends list');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    // Get current user ID
    const getCurrentUser = async () => {
      const authStatus = await getUserAuthStatus();
      setCurrentUserId(authStatus.userId);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchFriends();
    }
  }, [currentUserId, refreshTrigger, fetchFriends]);

  const handleRemoveFriend = async (friend: FriendRequest) => {
    if (!currentUserId) return;

    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend.friend_user?.first_name || friend.friend_user?.username} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabaseFriendsRepository.removeFriend(currentUserId, friend.friend_id);
              setFriends(prev => prev.filter(f => f.id !== friend.id));
              Alert.alert('Success', 'Friend removed successfully');
            } catch (error) {
              console.error('Error removing friend:', error);
              Alert.alert('Error', 'Failed to remove friend');
            }
          }
        }
      ]
    );
  };

  const handleBlockFriend = async (friend: FriendRequest) => {
    if (!currentUserId) return;

    Alert.alert(
      'Block Friend',
      `Are you sure you want to block ${friend.friend_user?.first_name || friend.friend_user?.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabaseFriendsRepository.blockFriend(currentUserId, friend.friend_id);
              setFriends(prev => prev.filter(f => f.id !== friend.id));
              Alert.alert('Success', 'Friend blocked successfully');
            } catch (error) {
              console.error('Error blocking friend:', error);
              Alert.alert('Error', 'Failed to block friend');
            }
          }
        }
      ]
    );
  };

  const renderFriendItem = ({ item: friend }: { item: FriendRequest }) => (
    <TouchableOpacity 
      style={styles.friendItem}
      onPress={() => onFriendSelected?.(friend)}
    >
      <View style={styles.friendInfo}>        <View style={styles.avatarContainer}>
          <Image
            source={
              friend.friend_user?.profile?.profile_picture 
                ? { uri: friend.friend_user.profile.profile_picture }
                : require('@/assets/images/default-avatar.png')
            }
            style={styles.avatar}
            onError={() => {
              console.log('Failed to load profile picture for:', friend.friend_user?.username);
            }}
          />
          {friend.online && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>
            {friend.friend_user?.first_name && friend.friend_user?.last_name 
              ? `${friend.friend_user.first_name} ${friend.friend_user.last_name}`
              : friend.friend_user?.username
            }
          </Text>
          <Text style={styles.username}>@{friend.friend_user?.username}</Text>
          <Text style={styles.friendSince}>
            Friends since {new Date(friend.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => {
            // TODO: Navigate to chat with this friend
            console.log('Message friend:', friend.friend_id);
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.moreButton]}
          onPress={() => {
            Alert.alert(
              'Friend Options',
              `Choose an action for ${friend.friend_user?.first_name || friend.friend_user?.username}`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'View Profile', onPress: () => onFriendSelected?.(friend) },
                { text: 'Remove Friend', onPress: () => handleRemoveFriend(friend), style: 'destructive' },
                { text: 'Block', onPress: () => handleBlockFriend(friend), style: 'destructive' }
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading friends...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends ({friends.length})</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchFriends}
        >
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Friends Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start connecting with people to build your friend network!
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  refreshButton: {
    padding: 8,
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
  listContainer: {
    padding: 16,
  },
  friendItem: {
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
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: 'white',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
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
  friendSince: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
  },
  messageButton: {
    backgroundColor: '#e3f2fd',
  },
  moreButton: {
    backgroundColor: '#f1f3f4',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
