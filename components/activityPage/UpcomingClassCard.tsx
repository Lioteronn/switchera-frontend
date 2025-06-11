import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { UpcomingClass } from '@/types/props';

interface UpcomingClassCardProps {
  classInfo: UpcomingClass;
  onJoin: (classInfo: UpcomingClass) => void;
}

const UpcomingClassCard: React.FC<UpcomingClassCardProps> = ({ classInfo, onJoin }) => {
  const isToday = classInfo.date === '10 Jun 2025'; // Normalmente esto debería ser calculado dinámicamente

  return (
    <Card className="mb-3 p-3">
      <HStack space="md">
        <Avatar size="lg" >
            <AvatarImage
                source={{
                uri: classInfo.avatar || 'https://via.placeholder.com/150',
                }}
            />
        </Avatar>    

        <VStack className="flex-1">
          <Text className="font-bold" numberOfLines={1}>{classInfo.title}</Text>
          <HStack space="xs" className="mt-1 items-center">
            <Text className="text-sm text-gray-600">con</Text>
            <Text className="text-sm text-gray-800 font-medium">{classInfo.instructor}</Text>
          </HStack>
          <HStack space="xs" className="mt-2 items-center">
            <Text className="text-xs text-gray-500">{classInfo.date}</Text>
            <Text className="text-xs text-gray-500">•</Text>
            <Text className="text-xs text-gray-500">{classInfo.time}</Text>
          </HStack>
        </VStack>
        <TouchableOpacity
          className={`py-1 px-3 rounded-lg border ${isToday ? 'border-blue-500' : 'border-slate-200'} justify-center`}
          disabled={!isToday}
          onPress={() => onJoin(classInfo)}
        >
          <Text className={`${isToday ? 'text-blue-600' : 'text-gray-400'} font-medium`}>
            {isToday ? 'Unirse' : 'Próximamente'}
          </Text>
        </TouchableOpacity>
      </HStack>
    </Card>
  );
};

export default UpcomingClassCard;