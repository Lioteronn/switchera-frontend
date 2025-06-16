// components/common/NotificationBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

export default function NotificationBadge({ 
  count, 
  size = 'medium' 
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  const badgeSize = {
    small: { width: 16, height: 16, fontSize: 10 },
    medium: { width: 20, height: 20, fontSize: 12 },
    large: { width: 24, height: 24, fontSize: 14 },
  }[size];

  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 200,
      }}
      style={[
        styles.badge,
        {
          width: badgeSize.width,
          height: badgeSize.height,
        },
      ]}
    >
      <Text 
        style={[
          styles.count,
          { fontSize: badgeSize.fontSize }
        ]}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  count: {
    color: 'white',
    fontWeight: 'bold',
  },
});

