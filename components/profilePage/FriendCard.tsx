import { FriendsRepository } from '@/api/friendsRepository';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Friends as Friend } from '@/types/props';
import { useRouter } from 'expo-router';
import { Ban, MessageCircle, MoreVertical, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

interface FriendCardProps {
  friend: Friend;
  showActions?: boolean;
  onFriendRemoved?: (id: string) => void;
  onFriendBlocked?: (id: string) => void;
  onFriendUnblocked?: (id: string) => void;
  onMessagePress?: (friend: Friend) => void;
  compact?: boolean;
}

export default function FriendCard({
  friend,
  showActions = true,
  onFriendRemoved,
  onFriendBlocked,
  onFriendUnblocked,
  onMessagePress,
  compact = false,
}: FriendCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

  const handleNavigateToProfile = () => {
    router.push({ pathname: '/(tabs)/profile', params: { id: friend.id } });
  };

  async function handleDeleteFriend() {
    setShowOptionsModal(false);
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend.name} from your friends list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              const response = await FriendsRepository.deleteFriend(friend.id);
              if (response) {
                onFriendRemoved?.(friend.id);
              } else {
                throw new Error('Failed to remove friend');
              }
            } catch (err) {
              setError('Failed to remove friend. Please try again.');
              console.error('Error removing friend:', err);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  const handleToggleBlock = async () => {
    setShowOptionsModal(false);
    const action = friend.blocked ? 'unblock' : 'block';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Friend`,
      `Are you sure you want to ${action} ${friend.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: action === 'block' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              const response = await FriendsRepository.blockFriend(friend.id, {
                blocked: !friend.blocked,
              });
              if (response) {
                if (friend.blocked) {
                  onFriendUnblocked?.(friend.id);
                } else {
                  onFriendBlocked?.(friend.id);
                }
              } else {
                throw new Error(`Failed to ${action} friend`);
              }
            } catch (err) {
              setError(`Failed to ${action} friend. Please try again.`);
              console.error(`Error ${action}ing friend:`, err);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    setShowOptionsModal(false);
    if (onMessagePress) {
      onMessagePress(friend);
    } else {
    router.push({ pathname: '/(tabs)/profile', params: { id: friend.id } });
    }
  };

  return (
    <>
      <Card
        size={compact ? 'sm' : 'md'}
        className="mb-2"
      >
        <HStack space="md" className='items-center'>
          <TouchableOpacity onPress={handleNavigateToProfile}>
            <Avatar size={compact ? "md" : "lg"}>
              <AvatarImage
                source={
                  friend.image
                    ? { uri: friend.image }
                    : require('@/assets/images/default-avatar.png')
                }
              />
              {friend.online && (
                <View
                  style={[
                    styles.onlineIndicator,
                    compact && styles.compactOnlineIndicator,
                  ]}
                />
              )}
            </Avatar>
          </TouchableOpacity>

          <VStack className='flex-1' space="xs">
            <TouchableOpacity onPress={handleNavigateToProfile}>
              <Text bold numberOfLines={1}>
                {friend.name}
              </Text>
            </TouchableOpacity>
            {friend.blocked && (
              <Text size="xs" style={styles.blockedText}>
                Blocked
              </Text>
            )}
          </VStack>

          {showActions && !loading && (
            <TouchableOpacity
              onPress={() => setShowOptionsModal(true)}
              style={styles.moreButton}
            >
              <MoreVertical size={20} color="#6B7280" />
            </TouchableOpacity>
          )}

          {loading && <ActivityIndicator size="small" color="#3B82F6" />}
        </HStack>

        {error && (
          <Text size="xs" style={styles.errorText} className="mt-2">
            {error}
          </Text>
        )}
      </Card>

      {/* Friend Options Modal */}
      <Modal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        size="sm"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalCloseButton>
            <X size={24} color="#000" />
          </ModalCloseButton>
          <ModalHeader>
            <Text bold size="lg">Friend Options</Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleMessage}
              >
                <MessageCircle size={20} color="#3B82F6" />
                <Text style={styles.modalOptionText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleToggleBlock}
              >
                <Ban size={20} color={friend.blocked ? "#10B981" : "#EF4444"} />
                <Text
                  style={[
                    styles.modalOptionText,
                    { color: friend.blocked ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {friend.blocked ? "Unblock Friend" : "Block Friend"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDeleteFriend}
              >
                <Trash2 size={20} color="#EF4444" />
                <Text style={[styles.modalOptionText, { color: "#EF4444" }]}>
                  Remove Friend
                </Text>
              </TouchableOpacity>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onPress={() => setShowOptionsModal(false)}
            >
              <Text>Cancel</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  compactOnlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  blockedText: {
    color: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
  },
  moreButton: {
    padding: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

