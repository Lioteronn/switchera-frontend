import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface SectionTeamProps {
  name: string;
  role: string;
  quote: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBackground?: string;
  style?: StyleProp<ViewStyle>;
}

export const SectionTeam: React.FC<SectionTeamProps> = ({
  name,
  role,
  quote,
  icon,
  iconColor,
  iconBackground = '#e0f2fe',
  style,
}) => {
  return (
    <Card style={style} className="bg-white p-6">
      <VStack space="md" className="items-center">
        <View 
          style={{ 
            width: 64, 
            height: 64, 
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: iconBackground,
          }}
        >
          {icon}
        </View>
        <Heading size="md">{name}</Heading>
        <Text className="text-gray-600 text-center">{role}</Text>
        <Divider />
        <Text className="text-gray-600 text-center italic">
          &quot;{quote}&quot;
        </Text>
      </VStack>
    </Card>
  );
};