import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const ACCENT_COLOR = '#84cc16';

interface MembershipPlanCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  color: string;
  accentColor: string;
  buttonLabel: string;
  isPopular?: boolean;
  isPrimary?: boolean;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({
  title,
  price,
  period,
  features,
  color,
  accentColor,
  buttonLabel,
  isPopular = false,
  isPrimary = false,
  borderWidth = 2,
  style,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const styles = StyleSheet.create({
    popularTag: {
      position: 'absolute',
      top: 12,
      right: -30,
      backgroundColor: ACCENT_COLOR,
      paddingVertical: 5,
      paddingHorizontal: 30,
      zIndex: 10,
    },
    primaryButton: {
      backgroundColor: ACCENT_COLOR,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    primaryButtonPressed: {
      backgroundColor: '#ffffff',
    },
    outlineButton: {
      borderColor: ACCENT_COLOR,
      borderWidth: 2,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
    },
    outlineButtonPressed: {
      backgroundColor: ACCENT_COLOR,
    },
    card: {
      borderWidth: borderWidth,
      borderColor: color,
      width: '100%', // This will be overridden by parent style
      marginBottom: 16,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    },
    cardContainer: {
      transform: isPopular ? [{ scale: 1.05 }] : undefined,
    }
  });

  return (
    <Card
      style={[styles.card, styles.cardContainer, style]}
      className="bg-white p-0"
    >
      {isPopular && (
        <View style={styles.popularTag}>
          <Text className="text-white font-bold">POPULAR</Text>
        </View>
      )}
      
      <View className={`${accentColor} p-4 items-center`}>
        <Heading size="lg" className="text-gray-800">{title}</Heading>
      </View>
      
      <View className="p-6">
        {price === 'Free' ? (
          <Text className="text-3xl font-bold text-center mb-4">{price}</Text>
        ) : (
          <>
            <Text className="text-3xl font-bold text-center mb-1">${price}</Text>
            <Text className="text-gray-500 text-center mb-4">{period}</Text>
          </>
        )}
        
        <VStack space="sm" className="mb-6">
          {features.map((feature, index) => (
            <HStack key={index} space="sm" className="mb-2 items-center">
              <Check size={18} color="#10b981" />
              <Text className="text-gray-700">{feature}</Text>
            </HStack>
          ))}
        </VStack>
        
        <Pressable 
          onPress={() => {}}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          style={[
            isPrimary ? styles.primaryButton : styles.outlineButton,
            isPressed && (
              isPrimary ? styles.primaryButtonPressed : styles.outlineButtonPressed
            )
          ]}
        >
          <Text className={`${isPrimary ? "text-white" : "text-gray-700"} font-bold text-center`}>
            {buttonLabel}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
};