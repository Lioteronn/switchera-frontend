// api/profile.ts
import axiosInstance from './axiosInstance';
import { ProfileUpdateData, supabaseProfileRepository } from './supabaseProfileRepository';

export const profileApi = {
  // Get current user's profile with all data (try Supabase first, fallback to Django)
  getMyProfile: async () => {
    try {
      // Try Supabase first
      const supabaseProfile = await supabaseProfileRepository.getMyProfile();
      if (supabaseProfile) {
        return {
          ...supabaseProfile,
          username: supabaseProfile.auth_user?.username,
          email: supabaseProfile.auth_user?.email,
          first_name: supabaseProfile.auth_user?.first_name,
          last_name: supabaseProfile.auth_user?.last_name,
          image: supabaseProfile.profile_picture,
        };
      }
    } catch (supabaseError) {
      console.log('Supabase profile fetch failed, trying Django API:', supabaseError);
    }
    
    try {
      // Fallback to Django API
      const response = await axiosInstance.get('/users/profiles/me/');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update profile using Supabase
  updateProfileSupabase: async (userId: number, data: ProfileUpdateData) => {
    try {
      await supabaseProfileRepository.updateProfile(userId, data);
      return await supabaseProfileRepository.getProfileByUserId(userId);
    } catch (error) {
      console.error('Error updating profile with Supabase:', error);
      throw error;
    }
  },

  // Get user's badges
  getBadges: async () => {
    try {
      const response = await axiosInstance.get('/users/badges/');
      return response.data;
    } catch (error) {
      console.error('Error fetching badges:', error);
      throw error;
    }
  },

  // Get user's services
  getServices: async () => {
    try {
      const response = await axiosInstance.get('/users/services/');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get user's friends
  getFriends: async () => {
    try {
      const response = await axiosInstance.get('/users/friends/');
      return response.data;
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data: any) => {
    try {
      const response = await axiosInstance.patch(`/users/profiles/me/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Create initial profile (onboarding)
  createProfile: async (data: any) => {
    try {
      const response = await axiosInstance.post(`/users/profiles/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  // Get registered services
  getRegisteredServices: async () => {
    try {
      const response = await axiosInstance.get('/users/registrations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching registered services:', error);
      throw error;
    }
  },

  // Follow/unfollow user
  toggleFollow: async (userId: number) => {
    try {
      const response = await axiosInstance.post(`/users/profiles/${userId}/follow/`);
      return response.data;
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  },

  // Get friend requests
  acceptFriendRequest: async (requestId: string) => {
    // TODO: Replace with your actual API call
    return fetch(`/users/friends/requests/${requestId}/accept`, { method: 'POST' });
  },
  rejectFriendRequest: async (requestId: string) => {
    // TODO: Replace with your actual API call
    return fetch(`/api/friends/requests/${requestId}/reject`, { method: 'POST' });
  },

  // Book a service using Supabase
  bookService: async ({ serviceId }: { serviceId: string }) => {
    try {
      return await supabaseProfileRepository.bookService(serviceId);
    } catch (error) {
      console.error('Error booking service (Supabase):', error);
      throw error;
    }
  },

  // Propose an exchange using Supabase
  proposeExchange: async ({
    serviceId,
    offeredServiceId,
  }: {
    serviceId: string;
    offeredServiceId: string;
  }) => {
    try {
      return await supabaseProfileRepository.proposeExchange(serviceId, offeredServiceId);
    } catch (error) {
      console.error('Error proposing exchange (Supabase):', error);
      throw error;
    }
  },

};

