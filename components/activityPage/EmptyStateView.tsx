import { MessageSquare } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

const EmptyStateView = () => {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <MessageSquare size={64} color="#94a3b8" />
      <Text className="text-xl text-gray-500 font-medium mt-4">
        Selecciona una conversación
      </Text>
      <Text className="text-gray-400 text-center mt-2 max-w-sm">
        Chatea con tus profesores o compañeros, y coordina tus próximas clases
      </Text>
    </View>
  );
};

export default EmptyStateView;