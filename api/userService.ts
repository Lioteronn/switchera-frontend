import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UserRepository } from "./userRepository";

async function save(key: string, value: string) {
    try {  // Add space after 'try'
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
        throw error;
    }
}

async function get(key: string): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
}

async function remove(key: string) {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error(`Error removing ${key}:`, error);
        throw error;
    }
}

async function saveTokens(response: any) {
    if (response && response.data) {
        const { access, refresh } = response.data;

        if (access) {
            await save('accessToken', access);
        }

        if (refresh) {
            await save('refreshToken', refresh);
        }
    }

    return response;
}

export const UserService = {
    register: async (username: string, first_name: string, last_name: string, email: string, password: string) => {
        try {
            const response = await UserRepository.register(username, first_name, last_name, email, password);
            return await saveTokens(response);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    login: async (username: string, password: string) => {
        try {
            const response = await UserRepository.login(username, password);
            return await saveTokens(response);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    refreshToken: async (refreshToken: string) => {
        try {
            const response = await UserRepository.refresh(refreshToken);
            return await saveTokens(response);
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await remove('accessToken');
            await remove('refreshToken');
            console.log('Tokens cleared successfully');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    getToken: async (): Promise<string | null> => {
        return await get('accessToken');
    },

    getRefreshToken: async (): Promise<string | null> => {
        return await get('refreshToken');
    },

    isLoggedIn: async (): Promise<boolean> => {
        try {
            const token = await get('accessToken');
            return !!token;
        } catch (error) {
            console.error('Check login status error:', error);
            return false;
        }
    }
};
