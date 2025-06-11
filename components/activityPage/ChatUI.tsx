import { ArrowLeft, Phone, PlusCircle, SendHorizontal, UserLock } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

import Message from '@/components/activityPage/Message';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Chat, Message as MessageType } from '@/types/props';

interface ChatUIProps {
  selectedChat: Chat;
  messages: MessageType[];
  onSendMessage: (text: string) => void;
  onStartCall: () => void;
  onBack: () => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ 
  selectedChat, 
  messages, 
  onSendMessage,
  onStartCall,
  onBack 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View className="flex-1">
      {/* Chat Header */}
      <HStack className="px-4 py-3 justify-between items-center border-b border-slate-100">
        <HStack space="sm" className="items-center">
          <TouchableOpacity onPress={onBack} className="p-1.5 mr-1.5 rounded-full bg-slate-100">
            <ArrowLeft size={20} color="#64748b" />
          </TouchableOpacity>
          <Avatar size="sm">
                <AvatarImage
                    source={{
                    uri: selectedChat.avatar || 'https://via.placeholder.com/150',
                    }}
                />
          </Avatar>
          <VStack>
            <Text className="font-medium">{selectedChat.name}</Text>
            <HStack className="items-center">
              {selectedChat.online ? (
                <>
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                  <Text className="text-xs text-gray-500">En línea</Text>
                </>
              ) : (
                <Text className="text-xs text-gray-500">Desconectado</Text>
              )}
            </HStack>
          </VStack>
        </HStack>
        
        {!selectedChat.blocked && (
          <TouchableOpacity 
            className="w-9 h-9 rounded-full bg-blue-500 justify-center items-center"
            onPress={onStartCall}
          >
            <Phone size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </HStack>
      
      <Divider />
      
      {selectedChat.blocked ? (
        // Blocked user message
        <View className="flex-1 justify-center items-center p-5">
          <View className="w-[80px] h-[80px] rounded-full bg-slate-200 justify-center items-center opacity-70">
            <UserLock size={48} color="#64748b" />
          </View>
          <Text className="text-lg font-bold text-gray-800 mt-4">
            Usuario bloqueado
          </Text>
          <Text className="text-gray-600 text-center mt-2 max-w-xs">
            Has bloqueado a este usuario. No puedes enviar ni recibir mensajes.
          </Text>
          <Button 
            variant="outline"
            className="mt-6"
          >
            Desbloquear usuario
          </Button>
        </View>
      ) : (
        // Chat messages
        <>
          <ScrollView 
            className="flex-1"
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* Service info card */}
            <View className="bg-slate-50 p-3 rounded-xl mb-4">
              <Text className="text-xs text-gray-500 mb-1">Servicio contratado:</Text>
              <Text className="text-sm font-medium text-gray-800">{selectedChat.service}</Text>
            </View>
            
            {messages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                isCurrentUser={msg.senderId === 'user1'}
              />
            ))}
          </ScrollView>
          
          {/* Message input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <HStack className="p-2 border-t border-slate-100 bg-white items-center">
              <TouchableOpacity className="p-2">
                <PlusCircle size={24} color="#94a3b8" />
              </TouchableOpacity>
              
              <TextInput
                className="flex-1 bg-slate-100 rounded-3xl px-4 py-2.5 max-h-[100px] text-slate-800"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              
              <TouchableOpacity 
                className={`w-10 h-10 rounded-full ml-2 justify-center items-center ${newMessage.trim() ? 'bg-blue-500' : 'bg-slate-200'}`}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <SendHorizontal size={22} color={newMessage.trim() ? "#fff" : "#94a3b8"} />
              </TouchableOpacity>
            </HStack>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};

export default ChatUI;