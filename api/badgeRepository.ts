import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';
import { Badge, ApiResponse } from '../types/profile';

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
 * Repository for badge-related API operations
 */
export const BadgesRepository = {
  /**
   * Get a list of all available badges
   * @returns Promise with array of Badge objects or null if error
   */
  listBadges: async (): Promise<ApiResponse<Badge[]> | null> => {
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<Badge[]>('/users/badges/')
      );
      
      if (!isValidApiResponse<Badge[]>(response)) {
        console.error('Failed to fetch badges: Invalid response format');
        return null;
      }
      
      if (!Array.isArray(response.data)) {
        console.error('Failed to fetch badges: Expected array of badges in response');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error in listBadges:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Get a specific badge by its medal ID
   * @param medalId - The unique identifier for the badge
   * @returns Promise with Badge object or null if error/not found
   */
  getBadgeById: async (medalId: string): Promise<ApiResponse<Badge> | null> => {
    if (!medalId || typeof medalId !== 'string' || medalId.trim() === '') {
      console.error('Invalid medal ID provided to getBadgeById:', medalId);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<Badge>(`/users/badges/${medalId}/`)
      );
      
      if (!isValidApiResponse<Badge>(response)) {
        console.error(`Failed to fetch badge with ID ${medalId}: Invalid response format`);
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error(`Failed to fetch badge with ID ${medalId}: Invalid badge data`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in getBadgeById for ID ${medalId}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Get all badges earned by the current user
   * @returns Promise with array of Badge objects or null if error
   */
  getUserBadges: async (): Promise<ApiResponse<Badge[]> | null> => {
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<Badge[]>('/users/badges/my_badges/')
      );
      
      if (!isValidApiResponse<Badge[]>(response)) {
        console.error('Failed to fetch user badges: Invalid response format');
        return null;
      }
      
      if (!Array.isArray(response.data)) {
        console.error('Failed to fetch user badges: Expected array of badges in response');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error in getUserBadges:', error instanceof Error ? error.message : 'Not authenticated or server error');
      return null;
    }
  },

  /**
   * Get badges earned by a specific user
   * @param userId - User ID to fetch badges for
   * @returns Promise with array of Badge objects or null if error
   */
  getUserBadgesById: async (userId: number): Promise<ApiResponse<Badge[]> | null> => {
    if (!userId || isNaN(userId) || userId <= 0) {
      console.error('Invalid user ID provided to getUserBadgesById:', userId);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<Badge[]>(`/users/badges/user/${userId}/`)
      );
      
      if (!isValidApiResponse<Badge[]>(response)) {
        console.error(`Failed to fetch badges for user with ID ${userId}: Invalid response format`);
        return null;
      }
      
      if (!Array.isArray(response.data)) {
        console.error(`Failed to fetch badges for user with ID ${userId}: Expected array of badges in response`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in getUserBadgesById for ID ${userId}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Get progress information for a specific badge
   * @param medalId - The unique identifier for the badge
   * @returns Promise with badge progress information or null if error
   */
  getBadgeProgress: async (medalId: string): Promise<ApiResponse<{ progress: number, total: number }> | null> => {
    if (!medalId || typeof medalId !== 'string' || medalId.trim() === '') {
      console.error('Invalid medal ID provided to getBadgeProgress:', medalId);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.get<{ progress: number, total: number }>(`/users/badges/${medalId}/progress/`)
      );
      
      if (!isValidApiResponse<{ progress: number, total: number }>(response)) {
        console.error(`Failed to fetch progress for badge with ID ${medalId}: Invalid response format`);
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error(`Failed to fetch progress for badge with ID ${medalId}: Invalid progress data`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in getBadgeProgress for ID ${medalId}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  },

  /**
   * Claim a badge that the user has earned but not yet claimed
   * @param medalId - The unique identifier for the badge to claim
   * @returns Promise with the claimed Badge object or null if error
   */
  claimBadge: async (medalId: string): Promise<ApiResponse<Badge> | null> => {
    if (!medalId || typeof medalId !== 'string' || medalId.trim() === '') {
      console.error('Invalid medal ID provided to claimBadge:', medalId);
      return null;
    }
    
    try {
      const response = await handleApiError(() =>
        axiosInstance.post<Badge>(`/users/badges/${medalId}/claim/`, {})
      );
      
      if (!isValidApiResponse<Badge>(response)) {
        console.error(`Failed to claim badge with ID ${medalId}: Invalid response format`);
        return null;
      }
      
      if (!response.data || typeof response.data !== 'object') {
        console.error(`Failed to claim badge with ID ${medalId}: Invalid badge data`);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error in claimBadge for ID ${medalId}:`, error instanceof Error ? error.message : 'Not eligible or server error');
      return null;
    }
  }
};
