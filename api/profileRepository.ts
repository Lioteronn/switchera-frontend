import {
  ApiResponse,
  ServiceRegistration,
  UserService
} from '../types/profile';
import axiosInstance from './axiosInstance';
import { BadgesRepository } from './badgeRepository';
import { REGISTRATION_ENDPOINTS, SERVICE_ENDPOINTS } from './endpoints';
import { FriendsRepository } from './friendsRepository';
import { ProfilesRepository } from './profilesRepository';
import { handleApiError } from './utils';

/**
 * Unified Profile API interface that combines profile, badge, friend, and service functionality
 */
export const profileApi = {
  // Re-export profile functions from ProfilesRepository
  getMyProfile: ProfilesRepository.getMyProfile,
  getProfileById: ProfilesRepository.getProfile,
  updateMyProfile: ProfilesRepository.updateProfile,
  createProfile: ProfilesRepository.createProfile,
  followUser: ProfilesRepository.followUser,
  
  // Re-export badge functions from BadgesRepository
  listBadges: BadgesRepository.listBadges,
  getBadge: BadgesRepository.getBadgeById,
  
  // Re-export friend functions from FriendsRepository
  // Service related functions
  /**
   * Get all available services
   * @returns Promise with array of Service objects or null if error
   */
  listServices: async (): Promise<ApiResponse<UserService[]> | null> => {
    return handleApiError(() =>
      axiosInstance.get<UserService[]>(SERVICE_ENDPOINTS.SERVICES)
    );
  },

  /**
   * Get a specific service by ID
   * @param serviceId - Service ID to fetch
   * @returns Promise with Service object or null if error
   */
  getService: async (serviceId: number): Promise<ApiResponse<UserService> | null> => {
    return handleApiError(() =>
      axiosInstance.get<UserService>(SERVICE_ENDPOINTS.SERVICE_BY_ID(serviceId))
    );
  },

  /**
   * Get services that the current user has registered for
   * @returns Promise with array of ServiceRegistration objects or null if error
   */
  getRegisteredServices: async (): Promise<ApiResponse<ServiceRegistration[]> | null> => {
    return handleApiError(() =>
      axiosInstance.get<ServiceRegistration[]>(REGISTRATION_ENDPOINTS.REGISTRATIONS)
    );
  },

  /**
   * Register the current user for a service
   * @param serviceId - Service ID to register for
   * @returns Promise with response or null if error
   */
  registerService: async (serviceId: number): Promise<ApiResponse<any> | null> => {
    return handleApiError(() =>
      axiosInstance.post(SERVICE_ENDPOINTS.SERVICE_REGISTER(serviceId), {})
    );
  },

  /**
   * Unregister the current user from a service
   * @param serviceId - Service ID to unregister from
   * @returns Promise with response or null if error
   */
  unregisterService: async (serviceId: number): Promise<ApiResponse<any> | null> => {
    return handleApiError(() =>
      axiosInstance.post(SERVICE_ENDPOINTS.SERVICE_UNREGISTER(serviceId), {})
    );
  },

  /**
   * Get user services by user ID
   * @param userId - User ID to get services for
   * @returns Promise with array of UserService objects or null if error
   */
  getUserServices: ProfilesRepository.getUserServices
};

// Export the individual repositories as well for more granular access
export {
  BadgesRepository,
  FriendsRepository, ProfilesRepository
};

// Default export for convenience
export default profileApi;

