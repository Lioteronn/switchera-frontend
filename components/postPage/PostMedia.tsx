import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

interface PostMediaProps {
  imageUrl: string;
}

export default function PostMedia({ imageUrl }: PostMediaProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth - 32; // Account for padding

  useEffect(() => {
    const loadImageDimensions = async () => {
      try {
        // Add Supabase URL prefix if not present
        const fullImageUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${imageUrl}`;

        console.log('Loading image from URL:', fullImageUrl);
        
        Image.getSize(
          fullImageUrl,
          (width, height) => {
            console.log('Image dimensions loaded:', { width, height });
            setDimensions({ width, height });
            setAspectRatio(width / height);
          },
          (error) => {
            console.error('❌ PostMedia - Error loading image dimensions:', error);
            // Set default dimensions if image fails to load
            setDimensions({ width: containerWidth, height: containerWidth });
            setAspectRatio(1);
          }
        );
      } catch (error) {
        console.error('❌ PostMedia - Error in loadImageDimensions:', error);
        // Set default dimensions if there's an error
        setDimensions({ width: containerWidth, height: containerWidth });
        setAspectRatio(1);
      }
    };

    if (imageUrl) {
      loadImageDimensions();
    }
  }, [imageUrl, containerWidth]);

  if (!imageUrl) return null;

  // Add Supabase URL prefix if not present
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${imageUrl}`;

  // Calculate image dimensions to fit container while maintaining aspect ratio
  const imageHeight = Math.min(
    containerWidth / aspectRatio, // Height based on aspect ratio
    containerWidth * 1.5 // Maximum height (1.5x container width)
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: fullImageUrl }}
        style={[
          styles.image,
          {
            width: containerWidth,
            height: imageHeight,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    borderRadius: 8,
  },
});