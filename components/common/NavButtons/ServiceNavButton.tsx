import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ServiceNavButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={{
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
        backgroundColor: '#EFF6FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => router.push('/(tabs)/Services')}
    >
      <Text className="text-blue-700 font-medium mr-2">Ver más servicios</Text>
      <ChevronRight size={16} color="#1D4ED8" />
    </TouchableOpacity>
  );
};

export default ServiceNavButton;