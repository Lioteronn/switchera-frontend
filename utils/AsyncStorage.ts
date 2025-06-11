import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing tokens
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Store access token
export const setAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving access token:', error);
  }
};

// Get access token
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Store refresh token
export const setRefreshToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
  }
};

// Get refresh token
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Remove all tokens (for logout)
export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Store both tokens at once (for login)
export const storeAuthTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken]
    ]);
  } catch (error) {
    console.error('Error storing auth tokens:', error);
  }
};