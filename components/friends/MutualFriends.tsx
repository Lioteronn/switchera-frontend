import { FriendRequest, supabaseFriendsRepository } from '@/api/supabaseFriendsRepository';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface MutualFriendsProps {
  userId: number;
  currentUserId: number;
  onUserSelected?: (user: any) => void;
  showCount?: boolean;
}

export default function MutualFriends({ 
  userId, 
  currentUserId, 
  onUserSelected, 
  showCount = true 
}: MutualFriendsProps) {
  const [mutualFriends, setMutualFriends] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchMutualFriends = useCallback(async () => {
    try {
      setLoading(true);
      const friends = await supabaseFriendsRepository.getMutualFriends(currentUserId, userId, 10);
      setMutualFriends(friends);
    } catch (error) {
      console.error('Error fetching mutual friends:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    fetchMutualFriends();
  }, [fetchMutualFriends]);

  const renderMutualFriend = ({ item }: { item: FriendRequest }) => {
    const friend = item.friend_user;
    if (!friend) return null;

    return (
      <TouchableOpacity 
        style={styles.friendItem}
        onPress={() => onUserSelected?.(friend)}
      >
        <Image
          source={require('@/assets/images/default-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>
            {friend.first_name && friend.last_name
              ? `${friend.first_name} ${friend.last_name}`
              : friend.username}
          </Text>
          <Text style={styles.friendUsername}>@{friend.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading mutual friends...</Text>
      </View>
    );
  }

  if (mutualFriends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={24} color="#999" />
        <Text style={styles.emptyText}>No mutual friends</Text>
      </View>
    );
  }

  const displayCount = Math.min(mutualFriends.length, 3);
  const remainingCount = mutualFriends.length - displayCount;

  return (
    <View style={styles.container}>
      {showCount && (
        <View style={styles.header}>
          <Ionicons name="people" size={20} color="#007AFF" />
          <Text style={styles.headerText}>
            {mutualFriends.length} mutual friend{mutualFriends.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      <FlatList
        data={expanded ? mutualFriends : mutualFriends.slice(0, displayCount)}
        renderItem={renderMutualFriend}
        keyExtractor={(item) => `mutual-${item.friend_id}`}
        horizontal={!expanded}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={expanded ? styles.verticalList : styles.horizontalList}
      />
      
      {!expanded && remainingCount > 0 && (
        <TouchableOpacity 
          style={styles.seeMoreButton}
          onPress={() => setExpanded(true)}
        >
          <Text style={styles.seeMoreText}>+{remainingCount} more</Text>
        </TouchableOpacity>
      )}
      
      {expanded && (
        <TouchableOpacity 
          style={styles.collapseButton}
          onPress={() => setExpanded(false)}
        >
          <Text style={styles.collapseText}>Show less</Text>
          <Ionicons name="chevron-up" size={16} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    opacity: 0.7,
  },
  emptyText: {
    marginLeft: 8,
    color: '#999',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  horizontalList: {
    paddingRight: 16,
  },
  verticalList: {
    gap: 8,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    minWidth: 140,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  friendUsername: {
    fontSize: 12,
    color: '#666',
  },
  seeMoreButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  collapseText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});
