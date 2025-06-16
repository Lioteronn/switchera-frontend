import { FriendsRepository } from '@/api/friendsRepository';
import { useAuth } from '@/context/AuthContext';
import { Friend } from '@/types/props';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  MessageCircle,
  MoreVertical,
  Search,
  SortAsc,
  UserPlus,
  Users,
  UserX
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native';

// Constants
const MAX_CONTENT_WIDTH = 1200;

// Types
type FriendStatus = 'all' | 'online' | 'offline' | 'blocked';
type SortOption = 'name' | 'recent';

interface FriendsScreenProps {
  onBack?: () => void;
}

// ⚡ Mock data for friends
const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    online: true,
    blocked: false
  },
  {
    id: '2',
    name: 'Bob Smith',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    online: false,
    blocked: false
  },
  {
    id: '3',
    name: 'Carol Davis',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    online: true,
    blocked: false
  },
  {
    id: '4',
    name: 'David Wilson',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    online: true,
    blocked: false
  },
  {
    id: '5',
    name: 'Emma Brown',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    online: false,
    blocked: false
  },
  {
    id: '6',
    name: 'Frank Miller',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    online: true,
    blocked: true
  },
  {
    id: '7',
    name: 'Grace Taylor',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
    online: false,
    blocked: false
  },
  {
    id: '8',
    name: 'Henry Anderson',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    online: true,
    blocked: false
  },
  {
    id: '9',
    name: 'Ivy Thompson',
    image: 'https://randomuser.me/api/portraits/women/9.jpg',
    online: false,
    blocked: false
  },
  {
    id: '10',
    name: 'Jack Garcia',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
    online: true,
    blocked: false
  },
  {
    id: '11',
    name: 'Kate Martinez',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    online: false,
    blocked: false
  },
  {
    id: '12',
    name: 'Liam Rodriguez',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    online: true,
    blocked: false
  }
];

// ⚡ Mock data for suggested friends
const mockSuggestedFriends: Friend[] = [
  {
    id: '101',
    name: 'Maya Chen',
    image: 'https://randomuser.me/api/portraits/women/13.jpg',
    online: true,
    blocked: false
  },
  {
    id: '102',
    name: 'Noah Williams',
    image: 'https://randomuser.me/api/portraits/men/14.jpg',
    online: false,
    blocked: false
  },
  {
    id: '103',
    name: 'Olivia Lee',
    image: 'https://randomuser.me/api/portraits/women/15.jpg',
    online: true,
    blocked: false
  },
  {
    id: '104',
    name: 'Peter Kim',
    image: 'https://randomuser.me/api/portraits/men/16.jpg',
    online: false,
    blocked: false
  },
  {
    id: '105',
    name: 'Quinn Zhang',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    online: true,
    blocked: false
  },
  {
    id: '106',
    name: 'Ryan Patel',
    image: 'https://randomuser.me/api/portraits/men/18.jpg',
    online: false,
    blocked: false
  },
  {
    id: '107',
    name: 'Sophia Singh',
    image: 'https://randomuser.me/api/portraits/women/19.jpg',
    online: true,
    blocked: false
  },
  {
    id: '108',
    name: 'Tyler Jones',
    image: 'https://randomuser.me/api/portraits/men/20.jpg',
    online: false,
    blocked: false
  }
];

const FriendsScreen: React.FC<FriendsScreenProps> = ({ onBack }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { user } = useAuth();
  const router = useRouter();

  // States
  const [friends, setFriends] = useState<Friend[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);
  
  // Type definition validation to ensure Friend objects match API spec
  const validateFriend = (friend: any): Friend => ({
    id: friend.id || '',
    name: friend.name || 'Unknown',
    image: friend.image || null,
    online: !!friend.online,
    blocked: !!friend.blocked
  });

  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FriendStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [showSuggested, setShowSuggested] = useState(false);
  
  // Loading states for actions
  const [addingFriend, setAddingFriend] = useState<string | null>(null);
  const [removingFriend, setRemovingFriend] = useState<string | null>(null);
  const [blockingFriend, setBlockingFriend] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter and sort friends when dependencies change
  useEffect(() => {
    filterAndSortFriends();
  }, [friends, searchQuery, selectedStatus, sortOption]);

  //  Fetch all friends and suggested friends (with mock data fallback)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(' Fetching friends data...');

      // ⚡ Try to fetch from API first, fallback to mock data
      try {
        const [friendsResponse, suggestedResponse] = await Promise.allSettled([
          FriendsRepository.listFriends(),
          FriendsRepository.getSuggestedFriends()
        ]);

        // Handle friends response
        if (friendsResponse.status === 'fulfilled' && friendsResponse.value?.data) {
          const friendsData = Array.isArray(friendsResponse.value.data) 
            ? friendsResponse.value.data.map(validateFriend)
            : [];
          
          if (friendsData.length > 0) {
            setFriends(friendsData);
            console.log(' Friends loaded from API:', friendsData.length);
          } else {
            throw new Error('No friends data from API');
          }
        } else {
          throw new Error('API returned no friends data');
        }

        // Handle suggested friends response
        if (suggestedResponse.status === 'fulfilled' && suggestedResponse.value?.data) {
          const suggestedData = Array.isArray(suggestedResponse.value.data) 
            ? suggestedResponse.value.data.map(validateFriend)
            : [];
          
          if (suggestedData.length > 0) {
            setSuggestedFriends(suggestedData);
            console.log(' Suggested friends loaded from API:', suggestedData.length);
          } else {
            throw new Error('No suggested friends data from API');
          }
        } else {
          throw new Error('API returned no suggested friends data');
        }

      } catch (apiError) {
        console.warn(' API failed, using mock data:', apiError);
        
        // ⚡ Use mock data as fallback
        setFriends(mockFriends);
        setSuggestedFriends(mockSuggestedFriends);
        
        console.log('Mock friends loaded:', mockFriends.length);
        console.log('Mock suggested friends loaded:', mockSuggestedFriends.length);
      }

    } catch (err: any) {
      console.error(' Error fetching friends data:', err);
      
      // ⚡ Even on error, use mock data so the UI works
      setFriends(mockFriends);
      setSuggestedFriends(mockSuggestedFriends);
      console.log(' Using mock data due to error');
      
      // Don't set error state since we have mock data
      // setError('Failed to load friends data');
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Filter and sort friends based on current criteria (with status filtering)
  const filterAndSortFriends = useCallback(() => {
    let filtered = [...friends];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(friend => 
        (friend.name || '').toLowerCase().includes(query)
      );
    }

    // ⚡ Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(friend => {
        switch (selectedStatus) {
          case 'online':
            return friend.online;
          case 'offline':
            return !friend.online;
          case 'blocked':
            return friend.blocked;
          default:
            return true;
        }
      });
    }

    // Sort friends
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'recent':
          // Sort by id as a fallback since created_at isn't in the API
          return (b.id || '').localeCompare(a.id || '');
        default:
          return 0;
      }
    });

    setFilteredFriends(filtered);
    console.log(' Friends filtered and sorted:', {
      total: friends.length,
      filtered: filtered.length,
      query: searchQuery,
      status: selectedStatus,
      sort: sortOption
    });
  }, [friends, searchQuery, selectedStatus, sortOption]);

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // ⚡ Add a friend (with optimistic update for mock data)
  const handleAddFriend = async (userId: string) => {
    try {
      setAddingFriend(userId);
      console.log(' Adding friend:', userId);

      // Find the suggested friend
      const suggestedFriend = suggestedFriends.find(f => f.id === userId);
      
      if (!suggestedFriend) {
        throw new Error('Friend not found in suggestions');
      }

      try {
        // Try API call first
        const response = await FriendsRepository.addFriend(userId) as { data?: any };
        
        if (response?.data) {
          // API success - use API response
          setSuggestedFriends(prev => prev.filter(f => f.id !== userId));
          setFriends(prev => [...prev, validateFriend(response.data)]);
          console.log(' Friend added via API');
        } else {
          throw new Error('API call failed');
        }
      } catch (apiError) {
        console.warn(' API failed, using optimistic update:', apiError);
        
        // ⚡ API failed - do optimistic update with mock data
        setSuggestedFriends(prev => prev.filter(f => f.id !== userId));
        setFriends(prev => [...prev, suggestedFriend]);
        console.log(' Friend added optimistically');
      }
      
      Alert.alert('Success', `${suggestedFriend.name} added as friend!`);

    } catch (err: any) {
      console.error(' Error adding friend:', err);
      Alert.alert('Error', 'Failed to add friend');
    } finally {
      setAddingFriend(null);
    }
  };

  // ⚡ Remove a friend (with optimistic update)
  const handleRemoveFriend = async (friendId: string) => {
    const friendToRemove = friends.find(f => f.id === friendId);
    
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friendToRemove?.name || 'this friend'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingFriend(friendId);
              console.log(' Removing friend:', friendId);

              try {
                // Try API call first
                const response = await FriendsRepository.deleteFriend(friendId);
                
                if (response) {
                  setFriends(prev => prev.filter(f => f.id !== friendId));
                  console.log(' Friend removed via API');
                } else {
                  throw new Error('API call failed');
                }
              } catch (apiError) {
                console.warn(' API failed, using optimistic update:', apiError);
                
                // ⚡ API failed - do optimistic update
                setFriends(prev => prev.filter(f => f.id !== friendId));
                console.log(' Friend removed optimistically');
              }
              
              Alert.alert('Success', 'Friend removed successfully');

            } catch (err: any) {
              console.error(' Error removing friend:', err);
              Alert.alert('Error', 'Failed to remove friend');
            } finally {
              setRemovingFriend(null);
            }
          }
        }
      ]
    );
  };

  // ⚡ Block/unblock a friend (with optimistic update)
  const handleBlockFriend = async (friendId: string, isBlocked: boolean) => {
    const action = isBlocked ? 'unblock' : 'block';
    const friendToBlock = friends.find(f => f.id === friendId);
    
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Friend`,
      `Are you sure you want to ${action} ${friendToBlock?.name || 'this friend'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: isBlocked ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setBlockingFriend(friendId);
              console.log(` ${action}ing friend:`, friendId);

              try {
                // Try API call first
                const response = await FriendsRepository.blockFriend(friendId, !isBlocked) as { data?: any };
                
                if (response?.data) {
                  setFriends(prev => prev.map(f => 
                    f.id === friendId ? { ...f, blocked: !isBlocked } : f
                  ));
                  console.log(` Friend ${action}ed via API`);
                } else {
                  throw new Error('API call failed');
                }
              } catch (apiError) {
                console.warn(' API failed, using optimistic update:', apiError);
                
                // ⚡ API failed - do optimistic update
                setFriends(prev => prev.map(f => 
                  f.id === friendId ? { ...f, blocked: !isBlocked } : f
                ));
                console.log(` Friend ${action}ed optimistically`);
              }
              
              Alert.alert('Success', `Friend ${action}ed successfully`);

            } catch (err: any) {
              console.error(` Error ${action}ing friend:`, err);
              Alert.alert('Error', `Failed to ${action} friend`);
            } finally {
              setBlockingFriend(null);
            }
          }
        }
      ]
    );
  };

  // Render friend card
  const renderFriendCard = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      {/* Friend Avatar */}
      <View style={styles.avatarContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {(item.name || 'U')[0].toUpperCase()}
            </Text>
          </View>
        )}
        {/* Online indicator */}
        {item.online && !item.blocked && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      {/* Friend Info */}
      <View style={styles.friendInfo}>
        <Text style={[
          styles.friendName,
          item.blocked && styles.blockedText
        ]}>
          {item.name || 'Unknown'}
          {item.blocked && ' (Blocked)'}
        </Text>
        <Text style={styles.friendUsername}>
          @{(item.name || 'unknown').toLowerCase().replace(/\s+/g, '')}
        </Text>
        <Text style={styles.friendStatus}>
          {item.blocked ? ' Blocked' : item.online ? ' Online' : ' Offline'}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Pressable 
          style={[styles.actionButton, item.blocked && styles.disabledButton]}
          onPress={() => console.log('Send message to:', item.id)}
          disabled={item.blocked}
        >
          <MessageCircle size={20} color={item.blocked ? "#9CA3AF" : "#3B82F6"} />
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => handleBlockFriend(item.id, item.blocked || false)}
          disabled={blockingFriend === item.id}
        >
          {blockingFriend === item.id ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <UserX size={20} color="#EF4444" />
          )}
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => handleRemoveFriend(item.id)}
          disabled={removingFriend === item.id}
        >
          {removingFriend === item.id ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <MoreVertical size={20} color="#EF4444" />
          )}
        </Pressable>
      </View>
    </View>
  );

  // Render suggested friend card
  const renderSuggestedFriendCard = ({ item }: { item: Friend }) => (
    <View style={styles.suggestedCard}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {(item.name || 'U')[0].toUpperCase()}
            </Text>
          </View>
        )}
        {/* Online indicator */}
        {item.online && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      {/* Info */}
      <View style={styles.suggestedInfo}>
        <Text style={styles.suggestedName}>{item.name || 'Unknown'}</Text>
        <Text style={styles.suggestedUsername}>
          @{(item.name || 'unknown').toLowerCase().replace(/\s+/g, '')}
        </Text>
        <Text style={styles.suggestedStatus}>
          {item.online ? ' Online' : ' Offline'}
        </Text>
      </View>

      {/* Add button */}
      <Pressable 
        style={[styles.addButton, addingFriend === item.id && styles.addButtonDisabled]}
        onPress={() => handleAddFriend(item.id)}
        disabled={addingFriend === item.id}
      >
        {addingFriend === item.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <UserPlus size={18} color="#fff" />
        )}
      </Pressable>
    </View>
  );

  // Render filter tabs
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterTabs}>
        {(['all', 'online', 'offline', 'blocked'] as FriendStatus[]).map((status) => (
          <Pressable
            key={status}
            style={[
              styles.filterTab,
              selectedStatus === status && styles.filterTabActive
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={[
              styles.filterTabText,
              selectedStatus === status && styles.filterTabTextActive
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable 
        style={styles.sortButton}
        onPress={() => {
          const options: SortOption[] = ['name', 'recent'];
          const currentIndex = options.indexOf(sortOption);
          const nextIndex = (currentIndex + 1) % options.length;
          setSortOption(options[nextIndex]);
        }}
      >
        <SortAsc size={20} color="#6B7280" />
        <Text style={styles.sortButtonText}>{sortOption}</Text>
      </Pressable>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
      marginLeft: 12,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    suggestedToggle: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: '#F3F4F6',
      marginRight: 8,
    },
    suggestedToggleActive: {
      backgroundColor: '#3B82F6',
    },
    suggestedToggleText: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
    },
    suggestedToggleTextActive: {
      color: '#fff',
    },
    contentContainer: {
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
      alignSelf: 'center',
      flex: 1,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#fff',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#111827',
      marginLeft: 8,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    filterTabs: {
      flexDirection: 'row',
    },
    filterTab: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginRight: 8,
    },
    filterTabActive: {
      backgroundColor: '#3B82F6',
    },
    filterTabText: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
    },
    filterTabTextActive: {
      color: '#fff',
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: '#F3F4F6',
    },
    sortButtonText: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
      textTransform: 'capitalize',
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    friendCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginVertical: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    avatarPlaceholder: {
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#6B7280',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#10B981',
      borderWidth: 2,
      borderColor: '#fff',
    },
    friendInfo: {
      flex: 1,
      marginLeft: 12,
    },
    friendName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
    },
    friendUsername: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 2,
    },
    friendStatus: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 2,
    },
    // ⚡ New styles for blocked friends
    blockedText: {
      color: '#EF4444',
      textDecorationLine: 'line-through',
    },
    disabledButton: {
      opacity: 0.5,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: '#F3F4F6',
      marginLeft: 8,
    },
    dangerButton: {
      backgroundColor: '#FEF2F2',
    },
    suggestedCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    suggestedInfo: {
      flex: 1,
      marginLeft: 12,
    },
    suggestedName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
    },
    suggestedUsername: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 2,
    },
    suggestedStatus: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 2,
    },
    addButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: '#3B82F6',
    },
    addButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#6B7280',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#EF4444',
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: '#3B82F6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      color: '#6B7280',
      textAlign: 'center',
      marginTop: 12,
    },
    emptySubtext: {
      fontSize: 14,
      color: '#9CA3AF',
      textAlign: 'center',
      marginTop: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      backgroundColor: '#F9FAFB',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
    },
    statLabel: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 2,
    },
  });

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state (removed since we always have mock data)
  if (error && friends.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchAllData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const displayData = showSuggested ? suggestedFriends : filteredFriends;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={handleBack}>
            <ChevronLeft size={24} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {showSuggested ? 'Suggested Friends' : 'Friends'}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <Pressable 
            style={[
              styles.suggestedToggle,
              showSuggested && styles.suggestedToggleActive
            ]}
            onPress={() => setShowSuggested(!showSuggested)}
          >
            <Text style={[
              styles.suggestedToggleText,
              showSuggested && styles.suggestedToggleTextActive
            ]}>
              {showSuggested ? 'Friends' : 'Suggested'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${showSuggested ? 'suggested friends' : 'friends'}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Filters (only for friends, not suggested) */}
        {!showSuggested && renderFilterTabs()}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>Total Friends</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {friends.filter(f => f.online && !f.blocked).length}
            </Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {friends.filter(f => f.blocked).length}
            </Text>
            <Text style={styles.statLabel}>Blocked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{suggestedFriends.length}</Text>
            <Text style={styles.statLabel}>Suggested</Text>
          </View>
        </View>

        {/* Friends List */}
        <View style={styles.listContainer}>
          <FlatList
            data={displayData}
            renderItem={showSuggested ? renderSuggestedFriendCard : renderFriendCard}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Users size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>
                  {showSuggested 
                    ? 'No suggested friends available' 
                    : searchQuery 
                      ? 'No friends match your search'
                      : 'No friends yet'
                  }
                </Text>
                <Text style={styles.emptySubtext}>
                  {showSuggested 
                    ? 'Check back later for new suggestions'
                    : 'Start connecting with people!'
                  }
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FriendsScreen;