import FriendsList from '@/components/friends/FriendsList';
import PeopleYouMayKnow from '@/components/friends/PeopleYouMayKnow';
import RecentActivity from '@/components/friends/RecentActivity';
import UserProfileViewer from '@/components/friends/UserProfileViewer';
import UserSearch from '@/components/friends/UserSearch';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert // Ensure Alert is imported
    ,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type TabType = 'friends' | 'search' | 'suggestions' | 'activity';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserSelected = (user: any) => {
    let numericId: number | null = null;

    if (user.friend_user && typeof user.friend_user.id === 'number') {
      numericId = user.friend_user.id;
    } else if (user.hasOwnProperty('friend_id') && typeof user.friend_id === 'number') {
      numericId = user.friend_id;
    } else if (user.hasOwnProperty('id') && typeof user.id === 'number') {
      numericId = user.id;
    } else if (user.hasOwnProperty('id') && typeof user.id === 'string') {
      const parsedId = parseInt(user.id, 10);
      if (!isNaN(parsedId)) {
        numericId = parsedId;
      } else {
        console.error(`User ID '${user.id}' is a non-numeric string. Cannot use for UserProfileViewer.`);
        Alert.alert("Error", `Invalid user identifier provided: ${user.id}.`);
        return;
      }
    }

    if (numericId !== null) {
      setSelectedUserId(numericId);
      setShowProfileModal(true);
    } else {
      console.error("Could not extract a valid numeric user ID for profile view from object:", user);
      Alert.alert("Error", "Could not open user profile due to invalid user data.");
    }
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedUserId(null);
    // Refresh friends list in case relationships changed
    setRefreshTrigger(prev => prev + 1);
  };  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return (
          <FriendsList 
            onFriendSelected={handleUserSelected}
            refreshTrigger={refreshTrigger}
          />
        );
      case 'search':
        return (
          <UserSearch 
            onUserSelected={handleUserSelected}
          />
        );
      case 'suggestions':
        return (
          <PeopleYouMayKnow 
            onUserSelected={handleUserSelected}
          />
        );
      case 'activity':
        return <RecentActivity />;
      default:
        return null;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'friends' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'friends' && styles.activeTabText
          ]}>
            Friends
          </Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={activeTab === 'search' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'search' && styles.activeTabText
          ]}>
            Find People
          </Text>
        </TouchableOpacity>        <TouchableOpacity
          style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
          onPress={() => setActiveTab('suggestions')}
        >
          <Ionicons 
            name="bulb" 
            size={20} 
            color={activeTab === 'suggestions' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'suggestions' && styles.activeTabText
          ]}>
            Suggestions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Ionicons 
            name="time" 
            size={20} 
            color={activeTab === 'activity' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'activity' && styles.activeTabText
          ]}>
            Activity
          </Text>        </TouchableOpacity>
      </ScrollView>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseProfile}
      >
        {selectedUserId && (
          <UserProfileViewer
            userId={selectedUserId}
            onClose={handleCloseProfile}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  tabContent: {
    flexDirection: 'row',
  },
  tab: {
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
