import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Chat } from '@/types/props';

interface ChatListItemProps {
  chat: Chat;
  onPress: (chat: Chat) => void;
  selected: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onPress, selected }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(chat)}
      className={`flex-row p-3 border-b border-b-slate-100 ${selected ? 'bg-slate-100' : ''}`}
    >
      <View className="relative mr-3">
        <Avatar size="md">
            <AvatarImage
                source={{
                uri: chat.avatar || 'https://via.placeholder.com/150',}}
            />
        </Avatar>
        {chat.online && <View className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />}
      </View>
      <View className="flex-1">
        <HStack className="space-between">
          <Text className="font-medium" numberOfLines={1}>{chat.name}</Text>
          <Text className="text-xs text-gray-500">{chat.timestamp}</Text>
        </HStack>
        <HStack className="space-between mt-1">
          <Text
            className={`text-sm ${chat.blocked ? 'text-red-500 italic' : 'text-gray-500'}`}
            numberOfLines={1}
            style={{ width: '80%' }}
          >
            {chat.lastMessage}
          </Text>
          {chat.unread > 0 && (
            <View className="w-5 h-5 rounded-full bg-blue-500 justify-center items-center">
              <Text className="text-xs text-white font-bold">{chat.unread}</Text>
            </View>
          )}
        </HStack>
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;