import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { Home, Briefcase, MessageSquare, Settings, User } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

// Colores para las pestañas
const COLORS = {
    light: {
        tint: '#2563eb',
        tabIconDefault: '#6b7280'
    },
    dark: {
        tint: '#3b82f6',
        tabIconDefault: '#a1a1aa'
    }
};

export default function Layout() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.tabIconDefault,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard General',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                    href: '/',
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Servicios',
                    tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
                    href: '/services',
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Mensajes',
                    tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
                    href: '/messages',
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                    href: '/settings',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                    href: '/profile',
                }}
            />
            <Tabs.Screen
                name="posts"
                options={{
                    title: 'Publicaciones',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                    href: '/posts',
                }}
            />

            {/* Ocultar las rutas no deseadas */}
            <Tabs.Screen name="login" options={{ href: null }} />
            <Tabs.Screen name="register" options={{ href: null }} />
            <Tabs.Screen name="not-found" options={{ href: null }} />
        </Tabs>
    );
}