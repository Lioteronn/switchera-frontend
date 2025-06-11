import React from 'react';
import { View } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Message as MessageType } from '@/types/props';

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  return (
    <View
      className={`max-w-[80%] p-3 rounded-2xl mb-2 ${isCurrentUser ? 'self-end bg-blue-500 rounded-br-md' : 'self-start bg-slate-100 rounded-bl-md'}`}
    >
      <Text className={isCurrentUser ? 'text-white' : 'text-slate-800'}>
        {message.text}
      </Text>
      <HStack className="mt-1 justify-between">
        <Text className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {message.timestamp}
        </Text>
      </HStack>
    </View>
  );
};

export default Message;