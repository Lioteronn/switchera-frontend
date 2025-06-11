import { PlusIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface SquareAddButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
  iconSize?: number;
}

const SquareAddButton = ({ 
  onPress, 
  color = '#84cc16',
  size = 60,
  iconSize = 32
}: SquareAddButtonProps) => {
  return (
    <View style={[styles.container, { right: 24, bottom: 24 }]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: color, width: size, height: size, borderRadius: size / 1.5 },
          pressed && styles.pressed
        ]}
        onPress={onPress}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)', borderless: true }}
      >
        <PlusIcon size={iconSize} color="white" strokeWidth={3} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
});

export default SquareAddButton;