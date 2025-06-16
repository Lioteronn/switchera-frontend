// components/profilePage/FriendRequests.tsx
import { Check, UserPlus, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  timestamp: string;
}

interface FriendRequestsProps {
  requests: FriendRequest[];
  onRequestHandled: () => void;
}

export default function FriendRequests({ requests, onRequestHandled }: FriendRequestsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRequest = async (requestId: string, accept: boolean) => {
    setLoading(requestId);
    try {

      // TODO: Implement accept/reject friend request in the API
      await new Promise((resolve) => setTimeout(resolve, 500));

      {/*if (accept) {
        await profileApi.acceptFriendRequest(requestId);
      } else {
        await profileApi.rejectFriendRequest(requestId);
      }*/}
      onRequestHandled();
    } catch (error) {
      console.error('Error handling friend request:', error);
    } finally {
      setLoading(null);
    }
  };

  if (requests.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friend Requests</Text>
        <UserPlus size={20} color="#3B82F6" />
      </View>

      {requests.map((request, index) => (
        <MotiView
          key={request.id}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: index * 100 }}
          style={styles.requestCard}
        >
          <View style={styles.userInfo}>
            <Image
              source={
                request.user.image
                  ? { uri: request.user.image }
                  : require('@/assets/images/default-avatar.png')
              }
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{request.user.name}</Text>
              <Text style={styles.timestamp}>
                {new Date(request.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            {loading === request.id ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleRequest(request.id, true)}
                >
                  <Check size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleRequest(request.id, false)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </MotiView>
      ))}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
});

