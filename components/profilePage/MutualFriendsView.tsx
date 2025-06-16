// components/profilePage/MutualFriendsView.tsx
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

interface MutualFriend {
  id: string;
  username: string;
  image: string;
  mutualCount: number;
}

interface MutualFriendsViewProps {
  userId: string;
  mutualFriends: MutualFriend[];
  maxDisplay?: number;
  onViewAll?: () => void;
}

export default function MutualFriendsView({ 
  userId, 
  mutualFriends,
  maxDisplay = 5,
  onViewAll 
}: MutualFriendsViewProps) {
  const router = useRouter();
  const displayFriends = mutualFriends.slice(0, maxDisplay);
  const remainingCount = mutualFriends.length - maxDisplay;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Users size={20} color="#3B82F6" />
          <Text style={styles.title}>Mutual Friends</Text>
        </View>
        {mutualFriends.length > maxDisplay && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.friendsContainer}
      >
        {displayFriends.map((friend, index) => (
          <MotiView
            key={friend.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 300,
              delay: index * 100,
            }}
          >
            <TouchableOpacity
              style={styles.friendCard}
              onPress={() => router.push(`/profile/${friend.id}`)}
            >
              <Image
                source={
                  friend.image
                    ? { uri: friend.image }
                    : require('@/assets/images/default-avatar.png')
                }
                style={styles.avatar}
              />
              <Text style={styles.username} numberOfLines={1}>
                {friend.username}
              </Text>
              <Text style={styles.mutualCount}>
                {friend.mutualCount} mutual
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}

        {remainingCount > 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: displayFriends.length * 100 }}
          >
            <TouchableOpacity 
              style={styles.remainingCard}
              onPress={onViewAll}
            >
              <View style={styles.remainingCircle}>
                <Text style={styles.remainingText}>+{remainingCount}</Text>
              </View>
              <Text style={styles.remainingLabel}>More</Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  friendsContainer: {
    gap: 12,
  },
  friendCard: {
    alignItems: 'center',
    width: 80,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  username: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    textAlign: 'center',
  },
  mutualCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  remainingCard: {
    alignItems: 'center',
    width: 80,
  },
  remainingCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  remainingLabel: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

