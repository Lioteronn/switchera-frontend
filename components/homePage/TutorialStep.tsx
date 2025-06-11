import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TutorialStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
  iconColor: string;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  description,
  icon,
  bgColor,
  textColor,
  iconBgColor,
  iconColor,
}) => {
  return (
    <Card className={`p-0 mx-2 mb-6`} style={styles.card}>
      <View className={`${bgColor} px-8 py-12 h-full`}>
        <Text
          style={{
            position: 'absolute',
            right: -20,
            top: -40,
            fontSize: 220,
            fontWeight: 'bold',
            opacity: 0.08,
            zIndex: 0,
          }}
        >
        </Text>
        <View className={`${iconBgColor} p-4 rounded-2xl self-start mb-6`}>
          {icon}
        </View>
        <Heading size="xl" className={`${textColor} mb-6`}>
          {title}
        </Heading>
        <Text className={`${textColor} text-lg mb-4`}>{description}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 24,
    minHeight: 320,
    overflow: 'hidden',
  },
});

export default TutorialStep;