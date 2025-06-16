import { supabaseFriendsRepository } from '@/api/supabaseFriendsRepository';
import { getUserAuthStatus } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface ActivityItem {
  type: 'new_friend' | 'new_follower';
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const getCurrentUser = useCallback(async () => {
    const authStatus = await getUserAuthStatus();
    setCurrentUserId(authStatus.userId);
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      const activity = await supabaseFriendsRepository.getRecentActivity(currentUserId, 20);
      
      // Combine and sort activities
      const allActivities: ActivityItem[] = [
        ...activity.new_friends.map(friend => ({
          type: 'new_friend' as const,
          user: {
            id: friend.friend_user?.id || 0,
            username: friend.friend_user?.username || '',
            first_name: friend.friend_user?.first_name || '',
            last_name: friend.friend_user?.last_name || '',
          },
          created_at: friend.created_at
        })),
        ...activity.new_followers.map(follower => ({
          type: 'new_follower' as const,
          user: {
            id: follower.follower_user?.id || 0,
            username: follower.follower_user?.username || '',
            first_name: follower.follower_user?.first_name || '',
            last_name: follower.follower_user?.last_name || '',
          },
          created_at: follower.created_at
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRecentActivity();
    setRefreshing(false);
  }, [fetchRecentActivity]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (currentUserId) {
      fetchRecentActivity();
    }
  }, [currentUserId, fetchRecentActivity]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  const renderActivityItem = ({ item }: { item: ActivityItem }) => {
    const displayName = item.user.first_name && item.user.last_name
      ? `${item.user.first_name} ${item.user.last_name}`
      : item.user.username;

    const getActivityText = () => {
      switch (item.type) {
        case 'new_friend':
          return `You became friends with ${displayName}`;
        case 'new_follower':
          return `${displayName} started following you`;
        default:
          return '';
      }
    };

    const getActivityIcon = () => {
      switch (item.type) {
        case 'new_friend':
          return 'people';
        case 'new_follower':
          return 'person-add';
        default:
          return 'notifications';
      }
    };

    return (
      <View style={styles.activityItem}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getActivityIcon()} 
            size={20} 
            color={item.type === 'new_friend' ? '#007AFF' : '#28a745'} 
          />
        </View>
        
        <Image
          source={require('@/assets/images/default-avatar.png')}
          style={styles.avatar}
        />
        
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>{getActivityText()}</Text>
          <Text style={styles.timeText}>{formatTimeAgo(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading recent activity...</Text>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No recent activity</Text>
        <Text style={styles.emptySubtitle}>
          Your recent friends and followers will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time" size={20} color="#007AFF" />
        <Text style={styles.headerTitle}>Recent Activity</Text>
      </View>
      
      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={(item, index) => `activity-${index}-${item.created_at}`}
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
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
  },
});
