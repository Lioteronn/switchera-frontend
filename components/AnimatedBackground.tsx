import React, { useEffect, useState, ReactNode } from 'react';
        import { View, StyleSheet, Dimensions, Platform } from 'react-native';
        import Animated, {
          useSharedValue,
          useAnimatedStyle,
          withRepeat,
          withTiming,
          Easing,
          withDelay
        } from 'react-native-reanimated';

        const { width, height } = Dimensions.get('window');

        interface BubbleProps {
          size: number;
          position: number;
          duration: number;
          delay: number;
        }

        const Bubble = ({ size, position, duration, delay }: BubbleProps) => {
          const translateY = useSharedValue(height);

          useEffect(() => {
            // Asegurarnos que la animación se inicie correctamente
            setTimeout(() => {
              translateY.value = withDelay(
                delay,
                withRepeat(
                  withTiming(-size, {
                    duration: duration,
                    easing: Easing.linear
                  }),
                  -1
                )
              );
            }, 100);
          }, []);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: translateY.value }],
          }));

          return (
            <Animated.View
              style={[
                styles.bubble,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  // Usar valor numérico en lugar de porcentaje para mejor compatibilidad
                  left: (position / 100) * width,
                  backgroundColor: `rgba(59, 130, 246, 0.5)`,
                },
                animatedStyle
              ]}
            />
          );
        };

        interface AnimatedBackgroundProps {
          children: ReactNode;
        }

        export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
          const [bubbles] = useState(
            Array.from({ length: 25 }).map((_, i) => ({
              id: i,
              size: Math.random() * 80 + 40, // Burbujas más grandes
              position: Math.random() * 100,
              duration: Math.random() * 5000 + 5000,
              delay: Math.random() * 2000,
            }))
          );

          return (
            <View style={styles.container}>
              <View style={styles.backgroundLayer} />
              <View style={styles.bubblesContainer} pointerEvents="none">
                {bubbles.map((bubble) => (
                  <Bubble
                    key={bubble.id}
                    size={bubble.size}
                    position={bubble.position}
                    duration={bubble.duration}
                    delay={bubble.delay}
                  />
                ))}
              </View>
              {children}
            </View>
          );
        }

        const styles = StyleSheet.create({
          container: {
            flex: 1,
            position: 'relative',
          },
          backgroundLayer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#EFF6FF', // bg-blue-50
          },
          bubblesContainer: {
            ...StyleSheet.absoluteFillObject,
            overflow: 'hidden',
            zIndex: 0,
          },
          bubble: {
            position: 'absolute',
            bottom: -150,
            // Usar propiedades de sombra compatibles con web
            ...(Platform.OS === 'web'
              ? { boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }
              : {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                  elevation: 2,
                }
            ),
          },
        });