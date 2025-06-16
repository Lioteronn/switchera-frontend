import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwupxparsnbzubtdjcwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dXB4cGFyc25ienVidGRqY3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjgyMDEsImV4cCI6MjA1OTg0NDIwMX0.wFhQhS7xN9naPQqkJgE5ATtTp8bSsp_HqFPUQSD57rA';

// Single Supabase client instance to avoid multiple GoTrueClient instances
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cached authenticated client to prevent multiple instances
let authenticatedClientCache: SupabaseClient | null = null;

// Simple JWT decoder to extract user ID
const decodeJWT = (token: string): { user_id?: number; userId?: number; sub?: string } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    console.log('🔍 Decoded JWT payload:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return null;
  }
};

// Get user authentication status
export const getUserAuthStatus = async (): Promise<{ isAuthenticated: boolean; userId: number | null; token: string | null }> => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const userData = await AsyncStorage.getItem('userData');
    
    if (!accessToken) {
      return { isAuthenticated: false, userId: null, token: null };
    }
    
    let userId = null;
    
    // First try to decode the JWT token to get user ID
    const decodedToken = decodeJWT(accessToken);
    if (decodedToken) {
      userId = decodedToken.user_id || decodedToken.userId || (decodedToken.sub ? parseInt(decodedToken.sub) : null);
      console.log('✅ User ID from JWT token:', userId);
    }
    
    // Fallback to stored user data if JWT doesn't have user ID
    if (!userId && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser.id;
        console.log('✅ User ID from stored data:', userId);
      } catch (parseError) {
        console.warn('Could not parse user data:', parseError);
      }
    }
    
    return { isAuthenticated: true, userId, token: accessToken };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false, userId: null, token: null };
  }
};

// Create or return cached authenticated Supabase client
export const createAuthenticatedSupabaseClient = async (): Promise<SupabaseClient> => {
  // Return cached client if available
  if (authenticatedClientCache) {
    console.log('🔄 Using cached authenticated Supabase client');
    return authenticatedClientCache;
  }
  
  try {
    console.log('🔐 Creating new authenticated Supabase client...');
    
    const authStatus = await getUserAuthStatus();
    
    if (!authStatus.isAuthenticated || !authStatus.token) {
      console.warn('⚠️ User not authenticated');
      throw new Error('User not authenticated');
    }
    
    console.log('✅ User is authenticated, creating client with Django JWT');
    console.log('🔑 Token preview:', authStatus.token.substring(0, 20) + '...');
    console.log('👤 User ID:', authStatus.userId);
    
    // Create client with only the Authorization header (standard JWT approach)
    authenticatedClientCache = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Authorization': `Bearer ${authStatus.token}`,
        },
      },
    });
    
    console.log('✅ Authenticated Supabase client created successfully');
    return authenticatedClientCache;
    
  } catch (error) {
    console.error('❌ Error creating authenticated Supabase client:', error);
    throw error;
  }
};

// Clear the cached client (call this on logout)
export const clearAuthenticatedClient = () => {
  console.log('🧹 Clearing authenticated client cache');
  authenticatedClientCache = null;
};

// Database types
export interface Profile {
  id: number;
  bio: string;
  birth_date: string;
  location: string;
  interests: string;
  speciality: string;
  profile_picture: string | null;
  rating: number | null;
  voxel_space_id: string;
  user_id: number;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  profile?: {
    id: number;
    bio: string;
    location: string;
    interests: any;
    speciality: any;
    profile_picture: string | null;
    rating: number | null;
  };
}
