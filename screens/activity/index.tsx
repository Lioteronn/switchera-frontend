import { useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatListItem from '@/components/activityPage/ChatListItem';
import ChatUI from '@/components/activityPage/ChatUI';
import EmptyStateView from '@/components/activityPage/EmptyStateView';
import UpcomingClassCard from '@/components/activityPage/UpcomingClassCard';
import VideoCallUI from '@/components/activityPage/VideoCallUI';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { MOCK_CHATS, MOCK_MESSAGES, MOCK_UPCOMING_CLASSES } from '@/types/mockdata';
import { Chat, Message } from '@/types/props';

// Constantes para mejorar la responsividad
const MAX_CONTENT_WIDTH = 1200;
const CHAT_LIST_WIDTH = 300;
const MOBILE_BREAKPOINT = 768;

export default function ActivityScreen() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isInCall, setIsInCall] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Para responsividad en pantallas pequeñas
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < MOBILE_BREAKPOINT;
  const [showChatList, setShowChatList] = useState(!isSmallScreen);
  
  // Animación para el panel lateral
  const slideAnim = useRef(new Animated.Value(isSmallScreen ? -CHAT_LIST_WIDTH : 0)).current;
  
  useEffect(() => {
    if (isSmallScreen && selectedChat) {
      setShowChatList(false);
    }
  }, [selectedChat, isSmallScreen]);
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showChatList ? 0 : -CHAT_LIST_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showChatList]);

  // Efecto para ajustar el estado cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleDimensionsChange = ({ window }: { window: { width: number; height: number } }) => {
      const newIsSmallScreen = window.width < MOBILE_BREAKPOINT;
      if (!newIsSmallScreen && !showChatList) {
        setShowChatList(true);
      }
    };

    // Solo para web, establecer un listener para cambios de tamaño
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === 'web') {
      subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    }

    return () => {
      if (Platform.OS === 'web' && subscription) {
        // Eliminar el listener al desmontar
        subscription.remove();
      }
    };
  }, [showChatList]);
  
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    if (isSmallScreen) {
      setShowChatList(false);
    }
  };
  
  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user1',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
    };
    
    setMessages([...messages, newMsg]);
    
    // Simulate response for demo
    if (selectedChat?.id === '1') {
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: '1',
          text: 'Perfecto, nos vemos en la videollamada en unos minutos.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };
  
  const handleStartCall = () => {
    setIsInCall(true);
  };
  
  const handleEndCall = () => {
    setIsInCall(false);
  };
  
  const handleBackToList = () => {
    if (isSmallScreen) {
      setShowChatList(true);
    }
    setSelectedChat(null);
    setIsInCall(false);
  };
  
  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };
  
  const handleJoinClass = (classInfo: any) => {
    // Find the corresponding chat
    const chat = MOCK_CHATS.find(c => c.name === classInfo.instructor);
    if (chat) {
      setSelectedChat(chat);
      setIsInCall(true);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxWidth: MAX_CONTENT_WIDTH,
      alignSelf: 'center',
      width: '100%',
    },
    chatListContainer: {
      width: CHAT_LIST_WIDTH,
      borderRightWidth: 1,
      borderRightColor: '#e2e8f0',
      backgroundColor: '#fff',
    },
    chatListMobile: {
      position: 'absolute',
      zIndex: 10,
      left: 0,
      top: 0,
      bottom: 0,
      width: CHAT_LIST_WIDTH,
      transform: [{ translateX: slideAnim }],
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
    },
    mobileChatHeader: {
      padding: 12,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9,
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ 
      paddingTop: Platform.OS === 'android' ? insets.top : 0 
    }}>
      <View className="flex-1 flex-row" style={styles.container}>
        {/* Overlay para móvil cuando el chat list está abierto */}
        {isSmallScreen && showChatList && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setShowChatList(false)}
          />
        )}
        
        {/* Panel Izquierdo - Lista de Chats */}
        <Animated.View 
          style={[
            styles.chatListContainer,
            isSmallScreen && styles.chatListMobile
          ]}
        >
          <HStack className="px-4 py-3 items-center justify-between border-b border-slate-100">
            <Heading size="lg">Mensajes</Heading>
            {isSmallScreen && (
              <TouchableOpacity 
                onPress={() => setShowChatList(false)}
                className="p-2"
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </HStack>
          
          <Divider />
          
          <FlatList
            data={MOCK_CHATS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ChatListItem 
                chat={item} 
                onPress={handleSelectChat} 
                selected={selectedChat?.id === item.id}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </Animated.View>
        
        {/* Panel Derecho - Interfaz de Chat/Video */}
        <View className="flex-1">
          {isSmallScreen && !showChatList && (
            <TouchableOpacity 
              style={styles.mobileChatHeader}
              onPress={toggleChatList}
            >
              <HStack className="items-center">
                {selectedChat ? (
                  <>
                    <TouchableOpacity onPress={handleBackToList} className="p-1.5 mr-3 rounded-full bg-slate-100">
                      <ArrowLeft size={20} color="#64748b" />
                    </TouchableOpacity>
                    <Avatar size="sm" >
                      <AvatarImage
                        source={{
                          uri: selectedChat.avatar,
                        }}
                      />                  
                    </Avatar>
                    <Text className="ml-2 font-medium">{selectedChat.name}</Text>
                  </>
                ) : (
                  <>
                    <Avatar size="sm" >
                      <AvatarImage
                        source={{
                          uri: 'https://via.placeholder.com/150',
                        }}
                      />                  
                    </Avatar>
                    <Text className="ml-2 font-medium">Mensajes</Text>
                  </>
                )}
              </HStack>
            </TouchableOpacity>
          )}
          
          {/* Contenido basado en selección y estado de llamada */}
          {selectedChat ? (
            // Interfaz de Chat/Llamada
            isInCall ? (
              // Interfaz de Videollamada
              <VideoCallUI 
                selectedChat={selectedChat}
                onEndCall={handleEndCall}
              />
            ) : (
              // Interfaz de Chat
              <ChatUI
                selectedChat={selectedChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                onStartCall={handleStartCall}
                onBack={handleBackToList}
              />
            )
          ) : (
            // Sin chat seleccionado - Vista de panel
            <View className="flex-1 p-5">
              <EmptyStateView />
              
              {/* Sección de próximas clases */}
              <View className="absolute bottom-5 left-5 right-5">
                <Heading size="md" className="mb-4">Próximas Clases</Heading>
                
                {MOCK_UPCOMING_CLASSES.map(classItem => (
                  <UpcomingClassCard
                    key={classItem.id}
                    classInfo={classItem}
                    onJoin={handleJoinClass}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}