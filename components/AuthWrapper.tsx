import { useAuth } from '@/context/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AuthHeader from './AuthHeader';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    console.log(' AuthWrapper state:', {
        isAuthenticated,
        isLoading,
        segments: segments.join('/'),
    });

    useEffect(() => {
        console.log(' useEffect AuthWrapper ejecutado:', {
            isAuthenticated,
            isLoading,
            segments: segments.join('/'),
            timestamp: new Date().toISOString()
        });

        // Si aún está cargando, no hacer nada
        if (isLoading) {
            console.log(' Auth aún cargando, esperando...');
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        
        console.log(' Decisión de navegación:', {
            inAuthGroup,
            isAuthenticated,
            shouldRedirectToLogin: !isAuthenticated && !inAuthGroup,
            shouldRedirectToTabs: isAuthenticated && inAuthGroup,
            currentPath: segments.join('/')
        });

        // Lógica de navegación simplificada
        if (!isAuthenticated && !inAuthGroup) {
            console.log(' Usuario NO autenticado fuera de auth - Redirigiendo a login...');
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            console.log(' Usuario autenticado en auth - Redirigiendo a tabs...');
            router.replace('/(tabs)');
        } else {
            console.log(' No se requiere redirección, manteniendo en:', segments.join('/'));
        }

    }, [isAuthenticated, segments, isLoading, router]);

    // Determinar si mostrar el header
    const shouldShowHeader = isAuthenticated && segments[0] !== '(auth)';
    
    console.log(' Header decision:', {
        shouldShowHeader,
        isAuthenticated,
        notInAuthGroup: segments[0] !== '(auth)',
        currentSegment: segments[0]
    });

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Verificando sesión...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header condicional */}
            {shouldShowHeader && <AuthHeader />}
            
            {/* Contenido principal */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
});

export default AuthWrapper;