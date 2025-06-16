import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';
import { 
  Profile, 
  ProfileUpdateData, 
  UserService, 
  ApiResponse, 
  FollowResponse 
} from '../types/profile';

/**
 * Type guard to check if response has the expected ApiResponse structure
 * @param response - The response to validate
 * @returns True if the response has the expected structure
 */
function isValidApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && 
         response.data !== undefined && 
         response.status !== undefined;
}

/**
 * Repository for profile-related API operations
 */
export const ProfilesRepository = {
  /**
   * Get a list of all user profiles
   * @returns Promise with array of Profile objects or null if error
   */
  listProfiles: async (): Promise<ApiResponse<Profile[]> | null> => {
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<ApiResponse<Profile[]>>('/users/profiles/')
      );
      
      if (!isValidApiResponse<Profile[]>(response)) {
        console.error('Failed to fetch profiles: Invalid response format');
        return null;
      }
      
      if (!Array.isArray(response.data)) {
        console.error('Failed to fetch profiles: Expected array of profiles in response');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error in listProfiles:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Get a specific user profile by ID
   * @param id - User ID to fetch the profile for
   * @returns Promise with Profile object or null if error/not found
   */
  getProfile: async (id: number): Promise<ApiResponse<Profile> | null> => {
    if (!id || isNaN(id) || id <= 0) {
      console.error('Invalid user ID provided to getProfile:', id);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<ApiResponse<Profile>>(`/users/profiles/${id}/`)
      );
      
      if (!isValidApiResponse<Profile>(response)) {
        console.error(`Failed to fetch profile with ID ${id}: Invalid response format`);
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error(`Failed to fetch profile with ID ${id}: Invalid profile data`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in getProfile for ID ${id}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Get the current user's profile
   * @returns Promise with Profile object or null if error/not authenticated
   */
  getMyProfile: async (): Promise<ApiResponse<Profile> | null> => {
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<ApiResponse<Profile>>('/users/profiles/me/')
      );
      
      if (!isValidApiResponse<Profile>(response)) {
        console.error('Failed to fetch current user profile: Invalid response format');
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error('Failed to fetch current user profile: Invalid profile data');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error in getMyProfile:', error instanceof Error ? error.message : 'Not authenticated or server error');
      return null;
    }
  },

  /**
   * Follow or unfollow a user
   * @param id - User ID to follow/unfollow
   * @param data - Optional data for the request
   * @returns Promise with follow status or null if error
   */
  followUser: async (id: number, data: Record<string, unknown> = {}): Promise<ApiResponse<FollowResponse> | null> => {
    if (!id || isNaN(id) || id <= 0) {
      console.error('Invalid user ID provided to followUser:', id);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.post<ApiResponse<FollowResponse>>(`/users/profiles/${id}/follow/`, data)
      );
      
      if (!isValidApiResponse<FollowResponse>(response)) {
        console.error(`Failed to follow/unfollow user with ID ${id}: Invalid response format`);
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error(`Failed to follow/unfollow user with ID ${id}: Invalid response data`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in followUser for ID ${id}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Get services owned by a specific user
   * @param id - User ID to fetch services for
   * @returns Promise with array of UserService objects or null if error
   */
  getUserServices: async (id: number): Promise<ApiResponse<UserService[]> | null> => {
    if (!id || isNaN(id) || id <= 0) {
      console.error('Invalid user ID provided to getUserServices:', id);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<ApiResponse<UserService[]>>(`/users/profiles/${id}/services/`)
      );
      
      if (!isValidApiResponse<UserService[]>(response)) {
        console.error(`Failed to fetch services for user with ID ${id}: Invalid response format`);
        return null;
      }
      
      if (!Array.isArray(response.data)) {
        console.error(`Failed to fetch services for user with ID ${id}: Expected array of services in response`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in getUserServices for ID ${id}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Update the current user's profile
   * @param data - Profile data to update
   * @returns Promise with updated Profile object or null if error
   */
  updateProfile: async (data: ProfileUpdateData): Promise<ApiResponse<Profile> | null> => {
    if (!data || Object.keys(data).length === 0) {
      console.error('No data or empty data object provided to updateProfile');
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.patch<ApiResponse<Profile>>('/users/profiles/me/', data)
      );
      
      if (!isValidApiResponse<Profile>(response)) {
        console.error('Failed to update profile: Invalid response format');
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error('Failed to update profile: Invalid profile data in response');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error in updateProfile:', error instanceof Error ? error.message : 'Server error or not authenticated');
      return null;
    }
  },
  
  /**
   * Create a new user profile
   * @param data - Complete profile data
   * @returns Promise with created Profile object or null if error
   */
  createProfile: async (data: ProfileUpdateData): Promise<ApiResponse<Profile> | null> => {
    if (!data || Object.keys(data).length === 0) {
      console.error('No data or empty data object provided to createProfile');
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.post<ApiResponse<Profile>>('/users/profiles/', data)
      );
      
      if (!isValidApiResponse<Profile>(response)) {
        console.error('Failed to create profile: Invalid response format');
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error('Failed to create profile: Invalid profile data in response');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error in createProfile:', error instanceof Error ? error.message : 'Server error or validation failed');
      return null;
    }
  }
};
