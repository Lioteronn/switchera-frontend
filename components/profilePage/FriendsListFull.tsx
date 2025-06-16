import { FriendsRepository } from '@/api/friendsRepository';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { RefreshControl } from '@/components/ui/refresh-control';
import { SectionList } from '@/components/ui/section-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Friend } from '@/types/props';
import { AlertCircle, UserX } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SectionListData, SectionListRenderItem, StyleSheet, View } from 'react-native';
import FriendCard from './FriendCard';

interface FriendsListFullProps {
  showSuggested?: boolean; // Añadir esta línea
  userId: string;
  maxVisibleFriends?: number;
  friends: Friend[];
  onFriendRemoved?: (id: string) => void;
  onFriendBlocked?: (id: string) => void;
  onFriendUnblocked?: (id: string) => void;
  onMessagePress?: (friend: Friend) => void;
  showActions?: boolean;
  compact?: boolean;
}

type FriendSection = {
  title: string;
  data: Friend[];
};

export default function FriendsListFull({
  onFriendRemoved,
  onFriendBlocked,
  onFriendUnblocked,
  onMessagePress,
  showActions = true,
  compact = false,
}: FriendsListFullProps) {
  // State management
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sections, setSections] = useState<FriendSection[]>([]);

  /**
   * Fetch friends from the API
   */
  const fetchFriends = useCallback(async (isRefreshing: boolean = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await FriendsRepository.listFriends();
      
      if (response && response.data) {
        setFriends(response.data as Friend[]);
      } else {
        throw new Error('Failed to fetch friends');
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Unable to load friends. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Group friends by online status
   */
  const groupFriendsByStatus = useCallback((friendsList: Friend[]) => {
    const onlineFriends = friendsList.filter(friend => friend.online);
    const offlineFriends = friendsList.filter(friend => !friend.online);

    const newSections: FriendSection[] = [
      { title: 'Online', data: onlineFriends },
      { title: 'Offline', data: offlineFriends },
    ];

    // Remove empty sections
    return newSections.filter(section => section.data.length > 0);
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    fetchFriends(true);
  }, [fetchFriends]);

  /**
   * Handle friend removal
   */
  const handleFriendRemoved = useCallback((id: string) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.id !== id));
    if (onFriendRemoved) {
      onFriendRemoved(id);
    }
  }, [onFriendRemoved]);

  /**
   * Handle friend blocked
   */
  const handleFriendBlocked = useCallback((id: string) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === id 
          ? { ...friend, blocked: true } 
          : friend
      )
    );
    if (onFriendBlocked) {
      onFriendBlocked(id);
    }
  }, [onFriendBlocked]);

  /**
   * Handle friend unblocked
   */
  const handleFriendUnblocked = useCallback((id: string) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === id 
          ? { ...friend, blocked: false } 
          : friend
      )
    );
    if (onFriendUnblocked) {
      onFriendUnblocked(id);
    }
  }, [onFriendUnblocked]);

  /**
   * Effect to fetch friends on component mount
   */
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  /**
   * Effect to update sections when friends change
   */
  useEffect(() => {
    setSections(groupFriendsByStatus(friends));
  }, [friends, groupFriendsByStatus]);

  /**
   * Render a section header
   */
  const renderSectionHeader = ({ section }: { section: SectionListData<Friend, FriendSection> }) => (
    <View style={styles.sectionHeader}>
      <Text bold size="sm" style={styles.sectionHeaderText}>
        {section.title} ({section.data.length})
      </Text>
    </View>
  );

  /**
   * Render an individual friend item
   */
  const renderItem: SectionListRenderItem<Friend, FriendSection> = ({ item }) => (
    <FriendCard
      friend={item}
      showActions={showActions}
      onFriendRemoved={handleFriendRemoved}
      onFriendBlocked={handleFriendBlocked}
      onFriendUnblocked={handleFriendUnblocked}
      onMessagePress={onMessagePress}
      compact={compact}
    />
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <Card style={styles.emptyStateContainer}>
        <VStack space="md" className='items-center' style={styles.emptyStateContent}>
          <UserX size={50} color="#94a3b8" />
          <Text bold size="lg" style={styles.emptyStateTitle}>
            No Friends Found 
          </Text>
          <Button title="Ir a amigos" onPress={goToFriends} />
          <Text style={styles.emptyStateDescription}>
            You don&apos;t have any friends yet. Add friends to see them here.
          </Text>
        </VStack>
      </Card>
    );
  };

  /**
   * Render loading state
   */
  const renderLoadingState = () => {
    if (!loading || refreshing) return null;
    
    return (
      <HStack style={styles.loadingContainer} space="sm" className='items-center justify-center'>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Loading friends...</Text>
      </HStack>
    );
  };

  /**
   * Render error state
   */
  const renderErrorState = () => {
    if (!error) return null;
    
    return (
      <Card style={styles.errorContainer}>
        <HStack space="sm" className='items-center'>
          <AlertCircle size={24} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </HStack>
      </Card>
    );
  };

  // If loading, show loading state
  if (loading && !refreshing) {
    return renderLoadingState();
  }

  // If error, show error state
  if (error) {
    return renderErrorState();
  }

  return (
    <View style={styles.container}>
      {renderErrorState()}
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={friends.length === 0 ? styles.emptyListContent : styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionHeader: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeaderText: {
    color: '#6B7280',
  },
  emptyStateContainer: {
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    marginTop: 16,
    color: '#4B5563',
  },
  emptyStateDescription: {
    textAlign: 'center',
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    flex: 1,
  },
});

