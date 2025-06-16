import { profileApi } from '@/api/profile';
import { useRouter } from 'expo-router';
import { UserPlus, Users } from 'lucide-react-native';
import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AccessibilityProps,
} from 'react-native';
import { Friend } from '@/types/props';
import FriendCard from './FriendCard';
import PropTypes from 'prop-types';

interface FriendsListCompactProps {
  userId: string;
  isCurrentUser: boolean;
  showSuggested: boolean;
  maxVisibleFriends: number;
  friends: Friend[];
  onFriendRemoved?: (id: string) => void;
  onFriendBlocked?: (id: string) => void;
  onFriendUnblocked?: (id: string) => void;
  onMessagePress?: (friend: Friend) => void;
}
// Extracted styled components
const Container = ({ style, ...props }: React.ComponentProps<typeof View>) => (
  <View style={[styles.container, style]} {...props} />
);

const FriendsGrid = ({ style, ...props }: React.ComponentProps<typeof View>) => (
  <View style={[styles.friendsGrid, style]} {...props} />
);

const FriendCardWrapper = ({ style, ...props }: React.ComponentProps<typeof View>) => (
  <View style={[styles.friendCardWrapper, style]} {...props} />
);

const ViewAllButton = ({ 
  style, 
  children, 
  onPress, 
  ...props 
}: React.ComponentProps<typeof TouchableOpacity> & { onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.viewAllButton, style]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="View more friends"
    accessibilityHint="Navigate to the full friends list"
    {...props}
  >
    {children}
  </TouchableOpacity>
);

const EmptyState = ({ style, ...props }: React.ComponentProps<typeof View>) => (
  <View 
    style={[styles.emptyState, style]} 
    accessibilityLabel="No friends yet"
    {...props} 
  />
);

const FindFriendsButton = ({ 
  style, 
  children, 
  onPress, 
  ...props 
}: React.ComponentProps<typeof TouchableOpacity> & { onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.findFriendsButton, style]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Find Friends"
    accessibilityHint="Navigate to the friend suggestions page"
    {...props}
  >
    {children}
  </TouchableOpacity>
);

const LoadingOverlay = ({ style, ...props }: React.ComponentProps<typeof View>) => (
  <View 
    style={[styles.loadingOverlay, style]}
    accessibilityRole="progressbar"
    accessibilityLabel="Loading friends"
    {...props} 
  />
);

export default function FriendsListCompact({ 
  userId,
  isCurrentUser,
  showSuggested,
  maxVisibleFriends,
  friends,
  onFriendRemoved,
  onFriendBlocked,
  onFriendUnblocked,
  onMessagePress,
}: FriendsListCompactProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce utility function
  const useDebounce = (callback: Function, delay = 500) => {
    return useCallback((...args) => {
      if (loading) return; // Prevent action if already loading
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        callback(...args);
        debounceTimeoutRef.current = null;
      }, delay);
    }, [callback, loading, delay]);
  };

  const displayFriends = friends.slice(0, maxVisibleFriends);
  const remainingCount = Math.max(0, friends.length - maxVisibleFriends);
  
  // Handle API errors with proper state management
  const handleApiError = (error: any, message: string) => {
    console.error(`${message}:`, error);
    setError(message);
    setLoading(false);
  };

  const handleFriendRemoved = async (friendId: string) => {
    if (onFriendRemoved) {
      onFriendRemoved(friendId);
    }
  };

  const handleFriendBlocked = async (friendId: string) => {
    if (onFriendBlocked) {
      onFriendBlocked(friendId);
    }
  };

  const handleFriendUnblocked = async (friendId: string) => {
    if (onFriendUnblocked) {
      onFriendUnblocked(friendId);
    }
  };

  const navigateToChat = useCallback((friendId: string) => {
    setLoading(true);
    try {
      router.push(`/chats/${friendId}`);
    } catch (error) {
      console.error('Error navigating to chat:', error);
      setError('Failed to open the chat. Please try again.');
      Alert.alert(
        'Navigation Error',
        'Failed to open the chat. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Debounced version of navigation function
  const debouncedNavigateToChat = useDebounce(navigateToChat, 500);

  const handleMessagePress = (friend: Friend) => {
    if (onMessagePress) {
      onMessagePress(friend);
    } else {
      debouncedNavigateToChat(friend.id);
    }
  };

  const renderFriendCard = (friend: Friend) => (
    <FriendCardWrapper key={friend.id}>
      <FriendCard
        friend={friend}
        showActions={isCurrentUser}
        onFriendRemoved={handleFriendRemoved}
        onFriendBlocked={handleFriendBlocked}
        onFriendUnblocked={handleFriendUnblocked}
        onMessagePress={handleMessagePress}
        compact={true}
      />
    </FriendCardWrapper>
  );
  
  return (
    <Container accessible={true} accessibilityLabel="Friends list">
      {error && (
        <View 
          style={styles.errorContainer}
          accessibilityRole="alert"
          accessibilityLabel={`Error: ${error}`}
        >
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {friends.length > 0 ? (
        <>
          <FriendsGrid>
            {displayFriends.map((friend) => renderFriendCard(friend))}
          </FriendsGrid>

          {remainingCount > 0 && (
            <ViewAllButton
              onPress={useDebounce(() => {
                setLoading(true);
                try {
                  router.push('/friends');
                } catch (err) {
                  console.error('Error navigating to friends:', err);
                  setError('Failed to navigate to friends list');
                } finally {
                  setLoading(false);
                }
              }, 500)}
            >
              <Text style={styles.viewAllText}>
                View {remainingCount} more friends
              </Text>
            </ViewAllButton>
          )}
        </>
      ) : (
        <EmptyState>
          <Users size={32} color="#9CA3AF" />
          <Text style={styles.emptyText}>No friends yet</Text>
          {showSuggested && (
            <FindFriendsButton
              onPress={useDebounce(() => {
                setLoading(true);
                try {
                  router.push('/friends/suggested');
                } catch (err) {
                  console.error('Error navigating to suggested friends:', err);
                  setError('Failed to navigate to suggested friends');
                } finally {
                  setLoading(false);
                }
              }, 500)}
            >
              <UserPlus size={16} color="#3B82F6" />
              <Text style={styles.findFriendsText}>Find Friends</Text>
            </FindFriendsButton>
          )}
        </EmptyState>
      )}

      {loading && (
        <LoadingOverlay>
          <ActivityIndicator 
            size="large" 
            color="#3B82F6" 
            accessibilityLabel="Loading"
            accessibilityHint="Please wait while the content is loading"
          />
        </LoadingOverlay>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  friendCardWrapper: {
    width: '48%',
  },
  viewAllButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 12,
  },
  findFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  findFriendsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
});

// PropTypes validation
FriendsListCompact.propTypes = {
  userId: PropTypes.string.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  showSuggested: PropTypes.bool.isRequired,
  maxVisibleFriends: PropTypes.number.isRequired,
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      online: PropTypes.bool,
      blocked: PropTypes.bool,
    })
  ).isRequired,
  onFriendRemoved: PropTypes.func,
  onFriendBlocked: PropTypes.func,
  onFriendUnblocked: PropTypes.func,
  onMessagePress: PropTypes.func,
};

// Default props
FriendsListCompact.defaultProps = {
  isCurrentUser: false,
  showSuggested: true,
  maxVisibleFriends: 4,
  friends: [],
};

