import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL constant for API requests
const BASE_URL = 'http://localhost:8000/api'; // Using IP instead of localhost for mobile devices

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}); 

// Agregar el token a las solicitudes.
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log(' Preparing request:', {
      url: config.url,
      method: config.method,
    });
    
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(' Added auth token to request');
    }
    
    return config;
  },
  (error) => {
    console.error(' Request interceptor error:', error);
    return Promise.reject(error);
  }
);
//Manejar respuestas y refresco de token.
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(' Response received:', {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log(' Attempting token refresh...');
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log(' No refresh token found, skipping refresh');
          return Promise.reject(error); // Don't throw error, just reject with original error
        }
        
        // Use the baseURL from the instance configuration
        const response = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken
        });

        const { access: newAccessToken } = response.data;
        await AsyncStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log(' Token refreshed, retrying request');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error(' Token refresh failed:', refreshError);
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
        // Don't throw new error, this might be preventing login flow
        return Promise.reject(error); // Reject with original error instead
      }
    }
    
    console.error(' API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);


export default axiosInstance;