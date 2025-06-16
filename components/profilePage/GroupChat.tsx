// components/profilePage/GroupChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, Image as ImageIcon, Paperclip, Smile, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as ImagePicker from 'expo-image-picker';
import MessageReactions from './MessageReactions';

interface Reaction {
  type: 'like' | 'love' | 'smile';
  count: number;
  userIds: string[];
}

interface Message {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  reactions: Reaction[];
  replyTo?: {
    id: string;
    content: string;
    username: string;
  };
  replyCount: number;
}

interface GroupChatProps {
  groupId: string;
  groupName: string;
  currentUserId: string;
  messages: Message[];
  onSendMessage: (content: string, type: Message['type'], file?: any) => Promise<void>;
  onLoadMore?: () => Promise<void>;
  hasMoreMessages?: boolean;
}

export default function GroupChat({
  groupId,
  groupName,
  currentUserId,
  messages,
  onSendMessage,
  onLoadMore,
  hasMoreMessages,
}: GroupChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    const handleTyping = () => {
      // Emit typing event to backend
      typingTimeout = setTimeout(() => {
        // Emit stopped typing event
      }, 1000);
    };

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() && !sending) return;

    setSending(true);
    try {
      await onSendMessage(newMessage.trim(), 'text');
      setNewMessage('');
      setReplyingTo(null);
      flatListRef.current?.scrollToEnd();
    } finally {
      setSending(false);
    }
  };

  const handleAddReaction = async (messageId: string, type: Reaction['type']) => {
    // Here you would call your API to add a reaction
    console.log(`Adding ${type} reaction to message ${messageId}`);
  };

  const handleRemoveReaction = async (messageId: string, type: Reaction['type']) => {
    // Here you would call your API to remove a reaction
    console.log(`Removing ${type} reaction from message ${messageId}`);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    // Focus the text input
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSending(true);
      try {
        await onSendMessage('', 'image', result.assets[0]);
        flatListRef.current?.scrollToEnd();
      } finally {
        setSending(false);
      }
    }
  };

  const handleLoadMore = async () => {
    if (!hasMoreMessages || loadingMore) return;
    setLoadingMore(true);
    try {
      await onLoadMore?.();
    } finally {
      setLoadingMore(false);
    }
  };

  const TypingIndicator = () => {
    if (typingUsers.size === 0) return null;

    const typingText = Array.from(typingUsers).join(', ') + 
      (typingUsers.size === 1 ? ' is ' : ' are ') + 
      'typing...';

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.typingContainer}
      >
        <Text style={styles.typingText}>{typingText}</Text>
      </MotiView>
    );
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isOwnMessage = message.userId === currentUserId;

    return (
      <View>
        {message.replyTo && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyUsername}>
              Replying to {message.replyTo.username}
            </Text>
            <Text style={styles.replyContent} numberOfLines={1}>
              {message.replyTo.content}
            </Text>
          </View>
        )}
        
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
          ]}
        >
          {!isOwnMessage && (
            message.userImage ? (
              <Image
                source={{ uri: message.userImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.defaultAvatar]}>
                <User size={18} color="#9CA3AF" />
              </View>
            )
          )}
          <View style={[
            styles.messageContent,
            isOwnMessage ? styles.ownMessageContent : styles.otherMessageContent
          ]}>
            {!isOwnMessage && (
              <Text style={styles.username}>{message.username}</Text>
            )}
            {message.type === 'text' ? (
              <Text style={styles.messageText}>{message.content}</Text>
            ) : message.type === 'image' ? (
              <Image
                source={{ uri: message.fileUrl }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </MotiView>
        
        <MessageReactions
          reactions={message.reactions || []}
          currentUserId={currentUserId}
          onAddReaction={(type) => handleAddReaction(message.id, type)}
          onRemoveReaction={(type) => handleRemoveReaction(message.id, type)}
          onReply={() => handleReply(message)}
          replyCount={message.replyCount || 0}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.groupName}>{groupName}</Text>
      </View>

      <TypingIndicator />

      {replyingTo && (
        <View style={styles.replyingContainer}>
          <View style={styles.replyingContent}>
            <Text style={styles.replyingText}>
              Replying to {replyingTo.username}
            </Text>
            <Text style={styles.replyingMessage} numberOfLines={1}>
              {replyingTo.content}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.cancelReplyButton}
            onPress={() => setReplyingTo(null)}
          >
            <Text style={styles.cancelReplyText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.loadingMore} color="#3B82F6" />
          ) : null
        }
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleImagePick}
        >
          <ImageIcon size={24} color="#6B7280" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          maxLength={1000}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendingButton]}
          onPress={handleSend}
          disabled={sending || !newMessage.trim()}
        >
          {sending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Send size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  typingContainer: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  replyContainer: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 2,
    borderLeftColor: '#3B82F6',
    paddingLeft: 8,
    paddingVertical: 4,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 4,
  },
  replyUsername: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  replyContent: {
    fontSize: 12,
    color: '#6B7280',
  },
  replyingContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBF5FF',
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#3B82F6',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyingContent: {
    flex: 1,
  },
  replyingText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  replyingMessage: {
    fontSize: 12,
    color: '#6B7280',
  },
  cancelReplyButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelReplyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  defaultAvatar: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    borderRadius: 12,
    padding: 12,
  },
  ownMessageContent: {
    backgroundColor: '#EBF5FF',
  },
  otherMessageContent: {
    backgroundColor: '#F3F4F6',
  },
  username: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingButton: {
    backgroundColor: '#93C5FD',
  },
  loadingMore: {
    padding: 16,
  },
});

