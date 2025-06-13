import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  sent: boolean;
  delivered: boolean;
  viewed: boolean;
  messageType: 'text' | 'image' | 'file';
}

interface ChatDisplayProps {
  selectedContact: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
  } | null;
  onBack: () => void;
  currentUserId: string;
}

export default function ChatDisplay({ selectedContact, onBack, currentUserId }: ChatDisplayProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate chat ID from user IDs (consistent ordering)
  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('-');
  };

  // Generate Jitsi Meet room URL
  const generateMeetingUrl = (contactName: string, service: string = 'VideoCall') => {
    // Sanitize names for URL
    const sanitizedContact = contactName.replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedService = service.replace(/[^a-zA-Z0-9]/g, '');
    
    return `https://meet.jit.si/Switchera-${sanitizedContact}-${sanitizedService}`;
  };

  // Handle video call with Jitsi Meet
  const handleVideoCall = async () => {
    if (!selectedContact) return;

    const meetingUrl = generateMeetingUrl(selectedContact.name, 'VideoCall');
    
    try {
      if (Platform.OS === 'web') {
        // En web, abrir en nueva ventana
        window.open(meetingUrl, '_blank');
      } else {
        // En móvil, usar Linking para abrir en navegador o app de Jitsi
        const supported = await Linking.canOpenURL(meetingUrl);
        if (supported) {
          await Linking.openURL(meetingUrl);
        } else {
          Alert.alert('Error', 'No se puede abrir el enlace de videollamada');
        }
      }

      // Opcional: Enviar mensaje automático con el enlace
      const meetingMessage: Message = {
        id: Date.now().toString(),
        chatId: getChatId(currentUserId, selectedContact.id),
        senderId: currentUserId,
        receiverId: selectedContact.id,
        content: `📹 Videollamada iniciada: ${meetingUrl}`,
        timestamp: new Date().toISOString(),
        sent: true,
        delivered: true,
        viewed: false,
        messageType: 'text'
      };

      setMessages(prev => [...prev, meetingMessage]);

    } catch (error) {
      console.error('Error opening video call:', error);
      Alert.alert('Error', 'No se pudo iniciar la videollamada');
    }
  };

  // Handle audio call with Jitsi Meet (audio only)
  const handleAudioCall = async () => {
    if (!selectedContact) return;

    const meetingUrl = generateMeetingUrl(selectedContact.name, 'AudioCall');
    
    try {
      if (Platform.OS === 'web') {
        // En web, abrir en nueva ventana con parámetros para audio only
        window.open(`${meetingUrl}#config.startWithVideoMuted=true&config.startWithAudioMuted=false`, '_blank');
      } else {
        const supported = await Linking.canOpenURL(meetingUrl);
        if (supported) {
          await Linking.openURL(meetingUrl);
        } else {
          Alert.alert('Error', 'No se puede abrir el enlace de llamada');
        }
      }

      // Enviar mensaje automático
      const callMessage: Message = {
        id: Date.now().toString(),
        chatId: getChatId(currentUserId, selectedContact.id),
        senderId: currentUserId,
        receiverId: selectedContact.id,
        content: `📞 Llamada de audio iniciada: ${meetingUrl}`,
        timestamp: new Date().toISOString(),
        sent: true,
        delivered: true,
        viewed: false,
        messageType: 'text'
      };

      setMessages(prev => [...prev, callMessage]);

    } catch (error) {
      console.error('Error opening audio call:', error);
      Alert.alert('Error', 'No se pudo iniciar la llamada');
    }
  };

  // Fetch messages between current user and selected contact
  const fetchMessages = async () => {
    if (!selectedContact) return;
    
    setLoading(true);
    try {
      const chatId = getChatId(currentUserId, selectedContact.id);
      
      // Mock API call - replace with actual API
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const data = await response.json();
      
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Use mock data for now
      setMessages(getMockMessages());
    } finally {
      setLoading(false);
    }
  };

  // Mock messages for development
  const getMockMessages = (): Message[] => {
    if (!selectedContact) return [];
    
    const chatId = getChatId(currentUserId, selectedContact.id);
    return [
      {
        id: '1',
        chatId,
        senderId: selectedContact.id,
        receiverId: currentUserId,
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sent: true,
        delivered: true,
        viewed: true,
        messageType: 'text'
      },
      {
        id: '2',
        chatId,
        senderId: currentUserId,
        receiverId: selectedContact.id,
        content: 'I\'m doing great! Thanks for asking.',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        sent: true,
        delivered: true,
        viewed: false,
        messageType: 'text'
      },
    ];
  };

  // Send new message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedContact) return;

    const chatId = getChatId(currentUserId, selectedContact.id);
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId: currentUserId,
      receiverId: selectedContact.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      sent: true,
      delivered: false,
      viewed: false,
      messageType: 'text'
    };

    // Optimistically add message
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    try {
      // API call to send message
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        // Update message with server response
        setMessages(prev => 
          prev.map(msg => msg.id === newMessage.id ? savedMessage : msg)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  // Mark messages as viewed
  const markMessagesAsViewed = async () => {
    if (!selectedContact) return;

    const unviewedMessages = messages.filter(
      msg => msg.senderId === selectedContact.id && !msg.viewed
    );

    if (unviewedMessages.length === 0) return;

    try {
      await fetch('/api/messages/mark-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageIds: unviewedMessages.map(msg => msg.id),
          viewerId: currentUserId
        })
      });

      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          unviewedMessages.find(um => um.id === msg.id)
            ? { ...msg, viewed: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking messages as viewed:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedContact?.id]);

  useEffect(() => {
    markMessagesAsViewed();
  }, [messages, selectedContact]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatus = (message: Message) => {
    if (message.senderId !== currentUserId) return null;
    
    if (message.viewed) return 'viewed';
    if (message.delivered) return 'delivered';
    if (message.sent) return 'sent';
    return 'sending';
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'viewed': return <Ionicons name="checkmark-done" size={12} color="#4CAF50" />;
      case 'delivered': return <Ionicons name="checkmark-done" size={12} color="#666" />;
      case 'sent': return <Ionicons name="checkmark" size={12} color="#666" />;
      default: return <Ionicons name="time" size={12} color="#999" />;
    }
  };

  if (!selectedContact) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="chatbubbles-outline" size={64} color="#d1d1d1" />
        <Text style={styles.emptyTitle}>Choose a conversation</Text>
        <Text style={styles.emptyText}>Select a chat from the sidebar to start messaging</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#323130" />
        </TouchableOpacity>
        
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {selectedContact.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{selectedContact.name}</Text>
          {selectedContact.status && (
            <Text style={[styles.statusText, { color: getStatusColor(selectedContact.status) }]}>
              {selectedContact.status}
            </Text>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleVideoCall}
          >
            <Ionicons name="videocam" size={20} color="#323130" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleAudioCall}
          >
            <Ionicons name="call" size={20} color="#323130" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.loadingText}>Loading messages...</Text>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === currentUserId;
            const status = getMessageStatus(msg);
            
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isOwnMessage ? styles.ownMessageWrapper : styles.otherMessageWrapper
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.ownMessage : styles.otherMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                  ]}>
                    {msg.content}
                  </Text>
                </View>
                <View style={styles.messageFooter}>
                  <Text style={styles.timestamp}>{formatTime(msg.timestamp)}</Text>
                  {status && (
                    <View style={styles.statusIcon}>
                      {getStatusIcon(status)}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add" size={24} color="#605e5c" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          multiline
          maxLength={1000}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, message.trim() ? styles.sendButtonActive : null]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={18} 
            color={message.trim() ? '#fff' : '#a19f9d'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#6bb700';
    case 'away': return '#ffaa44';
    case 'offline': return '#a19f9d';
    default: return '#a19f9d';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf9f8',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#323130',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#605e5c',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1dfdd',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6264a7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#323130',
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#faf9f8',
  },
  loadingText: {
    textAlign: 'center',
    color: '#605e5c',
    marginTop: 32,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  ownMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 8,
  },
  ownMessage: {
    backgroundColor: '#6264a7',
  },
  otherMessage: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1dfdd',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#323130',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#a19f9d',
  },
  statusIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1dfdd',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1dfdd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#e1dfdd',
  },
  sendButtonActive: {
    backgroundColor: '#6264a7',
  },
});