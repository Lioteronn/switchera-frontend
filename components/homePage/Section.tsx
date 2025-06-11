import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

type SectionProps = {
  children: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
};

export default function Section({ 
  children, 
  backgroundColor = 'bg-white',
  style = {}
}: SectionProps) {
  return (
    <View 
      className={`px-4 py-16 ${backgroundColor} mb-12`} 
      style={{
        paddingTop: 40, 
        paddingBottom: 40,
        ...style
      }}
    >
      {children}
    </View>
  );
}