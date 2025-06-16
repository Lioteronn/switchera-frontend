
import { router, Tabs } from 'expo-router';
import { BookText, Heart, Home, Plus, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) =>
            <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ color, focused }) =>
            <Heart color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: ({ color, focused }) =>
            <Plus color={color} size={24} />,
        }}
        listeners={{
          tabPress: (e) => {
            console.log(e);
            router.push('/post');
          }
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) =>
            <User color={color} size={24} />,        }}
      />
      <Tabs.Screen
        name="Services"
        options={{
          tabBarIcon: ({ color, focused }) =>
            <BookText color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
