import { Search, User, UserPlus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


// Types for the component
interface Friend {
  id: string;
  name: string;
  username: string;
  photo: string | null;
  mutualFriends?: number;
  isFollowing: boolean;
}

interface FriendsListProps {
  userId: string;
  isCurrentUser: boolean;
  showSuggested?: boolean;
  maxVisibleFriends?: number;
}

const FriendsList: React.FC<FriendsListProps> = ({ 
  userId, 
  isCurrentUser, 
  showSuggested = true, 
  maxVisibleFriends = 6 
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetchFriends();
    if (showSuggested) {
      fetchSuggestedFriends();
    }
  }, [userId, showSuggested]);

  useEffect(() => {
    if (friends.length > 0) {
      setFilteredFriends(
        friends.filter(friend => 
          friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          friend.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, friends]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await fetch(`/api/users/${userId}/friends`);
      // const data = await response.json();
      
      // Using mock data
      const mockFriends = await mockFetchFriends(userId);
      setFriends(mockFriends);
      setFilteredFriends(mockFriends);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      // In a real app, fetch from API
      // const response = await fetch(`/api/users/${userId}/suggested-friends`);
      // const data = await response.json();
      
      // Using mock data
      const mockSuggested = await mockFetchSuggestedFriends(userId);
      setSuggestedFriends(mockSuggested);
    } catch (err) {
      console.error('Error fetching suggested friends:', err);
      // We don't set main error for suggested friends as it's not critical
    }
  };

  const toggleFollowFriend = async (friendId: string) => {
    // Optimistic update for UI
    const updatedFriends = friends.map(friend => {
      if (friend.id === friendId) {
        return { ...friend, isFollowing: !friend.isFollowing };
      }
      return friend;
    });
    
    setFriends(updatedFriends);
    setFilteredFriends(
      updatedFriends.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // In a real app, send update to API
    // try {
    //   await fetch(`/api/users/${userId}/friends/${friendId}/follow`, {
    //     method: 'POST',
    //     body: JSON.stringify({ follow: !isFollowing }),
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // } catch (error) {
    //   console.error('Error toggling friend follow status:', error);
    //   // Revert on error
    //   setFriends(friends);
    // }
  };

  const renderFriendItem = (friend: Friend) => (
    <TouchableOpacity 
      style={styles.friendItem}
      onPress={() => {
        // Navigate to friend profile
        console.log(`Navigate to profile of ${friend.username}`);
      }}
    >
      {friend.photo ? (
        <Image source={{ uri: friend.photo }} style={styles.friendPhoto} />
      ) : (
        <View style={styles.friendPhotoPlaceholder}>
          <User size={20} color="#9CA3AF" />
        </View>
      )}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
        <Text style={styles.friendUsername} numberOfLines={1}>@{friend.username}</Text>
      </View>
      
      {isCurrentUser && (
        <TouchableOpacity 
          style={[
            styles.followButton,
            friend.isFollowing ? styles.followingButton : {}
          ]}
          onPress={() => toggleFollowFriend(friend.id)}
        >
          <Text style={[
            styles.followButtonText,
            friend.isFollowing ? styles.followingButtonText : {}
          ]}>
            {friend.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderSuggestedFriend = (friend: Friend) => (
    <TouchableOpacity 
      style={styles.suggestedItem}
      onPress={() => {
        // Navigate to friend profile
        console.log(`Navigate to profile of ${friend.username}`);
      }}
    >
      {friend.photo ? (
        <Image source={{ uri: friend.photo }} style={styles.suggestedPhoto} />
      ) : (
        <View style={styles.suggestedPhotoPlaceholder}>
          <User size={16} color="#9CA3AF" />
        </View>
      )}
      <Text style={styles.suggestedName} numberOfLines={1}>{friend.name}</Text>
      
      {friend.mutualFriends && friend.mutualFriends > 0 && (
        <Text style={styles.mutualFriends}>{friend.mutualFriends} mutual</Text>
      )}
      
      <TouchableOpacity 
        style={styles.suggestedFollowButton}
        onPress={() => toggleFollowFriend(friend.id)}
      >
        <UserPlus size={14} color="#3B82F6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && friends.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading friends...</Text>
      </View>
    );
  }

  if (error && friends.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchFriends}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const visibleFriends = friends.slice(0, maxVisibleFriends);
  const hasFriendsToShow = visibleFriends.length > 0;
  const hasMoreFriends = friends.length > maxVisibleFriends;

  return (
    <View style={styles.container}>
      {/* Regular friends list */}
      {hasFriendsToShow ? (
        <View style={styles.friendsContainer}>
          {visibleFriends.map(friend => (
            <View key={friend.id} style={styles.friendWrapper}>
              {renderFriendItem(friend)}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No connections yet</Text>
        </View>
      )}
      
      {/* View all button */}
      {hasMoreFriends && (
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.viewAllText}>View all friends</Text>
        </TouchableOpacity>
      )}
      
      {/* Suggested friends section */}
      {isCurrentUser && showSuggested && suggestedFriends.length > 0 && (
        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedTitle}>Suggested Connections</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedList}
          >
            {suggestedFriends.map(friend => (
              <View key={friend.id} style={styles.suggestedWrapper}>
                {renderSuggestedFriend(friend)}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Friends List Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connections</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[
                  styles.tab,
                  activeTab === 'following' ? styles.activeTab : {}
                ]}
                onPress={() => setActiveTab('following')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'following' ? styles.activeTabText : {}
                ]}>Following</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tab,
                  activeTab === 'followers' ? styles.activeTab : {}
                ]}
                onPress={() => setActiveTab('followers')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'followers' ? styles.activeTabText : {}
                ]}>Followers</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={18} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <FlatList
              data={filteredFriends}
              renderItem={({ item }) => renderFriendItem(item)}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.modalList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchTerm ? 'No matches found' : 'No connections yet'}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Mock data functions
const mockFetchFriends = async (userId: string): Promise<Friend[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'friend1',
      name: 'Alex Johnson',
      username: 'alexj',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      isFollowing: true
    },
    {
      id: 'friend2',
      name: 'Samantha Williams',
      username: 'samw',
      photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      isFollowing: true
    },
    {
      id: 'friend3',
      name: 'Michael Davis',
      username: 'miked',
      photo: null,
      isFollowing: true
    },
    {
      id: 'friend4',
      name: 'Emma Wilson',
      username: 'emmaw',
      photo: 'https://randomuser.me/api/portraits/women/22.jpg',
      isFollowing: false
    },
    {
      id: 'friend5',
      name: 'James Miller',
      username: 'jamesm',
      photo: 'https://randomuser.me/api/portraits/men/45.jpg',
      isFollowing: true
    },
    {
      id: 'friend6',
      name: 'Olivia Taylor',
      username: 'oliviat',
      photo: 'https://randomuser.me/api/portraits/women/32.jpg',
      isFollowing: false
    },
    {
      id: 'friend7',
      name: 'Daniel Martinez',
      username: 'danielm',
      photo: 'https://randomuser.me/api/portraits/men/57.jpg',
      isFollowing: true
    },
    {
      id: 'friend8',
      name: 'Sophia Anderson',
      username: 'sophiaa',
      photo: null,
      isFollowing: true
    }
  ];
};

const mockFetchSuggestedFriends = async (userId: string): Promise<Friend[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      id: 'suggested1',
      name: 'Thomas Wright',
      username: 'thomasw',
      photo: 'https://randomuser.me/api/portraits/men/67.jpg',
      mutualFriends: 3,
      isFollowing: false
    },
    {
      id: 'suggested2',
      name: 'Isabella Lopez',
      username: 'isabellal',
      photo: 'https://randomuser.me/api/portraits/women/42.jpg',
      mutualFriends: 5,
      isFollowing: false
    },
    {
      id: 'suggested3',
      name: 'Noah Harris',
      username: 'noahh',
      photo: null,
      mutualFriends: 2,
      isFollowing: false
    },
    {
      id: 'suggested4',
      name: 'Ava Clark',
      username: 'avac',
      photo: 'https://randomuser.me/api/portraits/women/33.jpg',
      mutualFriends: 4,
      isFollowing: false
    }
  ];
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
  },
  retryText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  friendsContainer: {
    paddingHorizontal: 16,
  },
  friendWrapper: {
    marginBottom: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  friendPhotoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
  },
  friendUsername: {
    fontSize: 14,
    color: '#6B7280',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
  },
  followingButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  followButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 13,
  },
  followingButtonText: {
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  viewAllText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  suggestedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  suggestedList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  suggestedWrapper: {
    marginRight: 8,
    width: 90,
  },
  suggestedItem: {
    alignItems: 'center',
  },
  suggestedPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  suggestedPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestedName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  suggestedFollowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default FriendsList;