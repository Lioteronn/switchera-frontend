// api/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';

interface RegistrationData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface VerificationData {
  email: string;
  code: string;
}

interface PasswordResetRequestData {
  email: string;
}

interface PasswordResetConfirmData {
  email: string;
  code: string;
  new_password: string;
}

export const authApi = {
  login: async (username: string, password: string) => {
    console.log(' Attempting login for user:', username);
    try {
      const response = await axiosInstance.post('/token/', { username, password });
      console.log(' Login successful');
      return {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      };
    } catch (error) {
      console.error(' Login failed:', error);
      throw new Error('Invalid credentials');
    }
  },

  refreshToken: async (refreshToken: string) => {
    console.log(' Refreshing access token');
    try {
      const response = await axiosInstance.post('/token/refresh/', {
        refresh: refreshToken,
      });
      console.log(' Token refresh successful');
      return response.data.access;
    } catch (error) {
      console.error(' Token refresh failed:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    console.log(' Fetching user profile');
    try {
      const response = await axiosInstance.get('/users/profiles/me/');
      console.log(' User profile fetched successfully');
      return response.data;
    } catch (error) {
      console.error(' Failed to fetch user profile:', error);
      throw error;
    }
  },

  register: async (data: RegistrationData) => {
    console.log(' Attempting registration for user:', data.username);
    try {
      const response = await axiosInstance.post('/users/register/', data);
      console.log(' Registration successful');
      
      // Store email temporarily for verification
      await AsyncStorage.setItem('pendingVerificationEmail', data.email);
      
      // Return registration data
      return {
        message: 'Registration successful. Please check your email for verification code.',
        email: data.email,
      };
    } catch (error: any) {
      console.error(' Registration failed:', error.response?.data || error.message);
    
      // Handle specific API error messages
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.username) {
          throw new Error('Username is already taken');
        }
        if (errorData.email) {
          throw new Error('Email is already registered');
        }
        if (errorData.password) {
          throw new Error(errorData.password[0]);
        }
        throw new Error(Object.values(errorData)[0] as string);
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  },


};

