import { router } from 'expo-router';
import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

interface LoginNavButtonProps {
    
    text?: string;
}

const LoginNavButton = ({ text = 'Iniciar sesion' }: LoginNavButtonProps) => {
    const { width } = useWindowDimensions();

    // Ruta fija para login
    const route = '/(auth)/login';

    return (
        <View className="flex max-w-32 p-4 items-center justify-center border border-gray-300 rounded-lg bg-blue-600">
            <Text 
                className="text-white font-bold text-center text-lg"
                onPress={() => router.push(route)}
                style={{ width: width * 0.8}}
            >
                {text}
            </Text>
        </View>
    );
};

export default LoginNavButton;