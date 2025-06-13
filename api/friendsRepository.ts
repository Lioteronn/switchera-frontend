import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';


export const FriendsRepository = {
  listFriends: async () => {
    return handleApiError(() =>
      axiosInstance.get('/users/friends/')
    );
  },

  getFriend: async (id: string) => {
    return handleApiError(() =>
      axiosInstance.get(`/users/friends/${id}/`)
    );
  },

  addFriend: async (data: any) => {
    return handleApiError(() =>
      axiosInstance.post('/users/friends/add_friend/', data)
    );
  },

  createFriend: async (data: any) => {
    return handleApiError(() =>
      axiosInstance.post('/users/friends/', data)
    );
  },

  updateFriend: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.put(`/users/friends/${id}/`, data)
    );
  },

  patchFriend: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.patch(`/users/friends/${id}/`, data)
    );
  },

  deleteFriend: async (id: string) => {
    return handleApiError(() =>
      axiosInstance.delete(`/users/friends/${id}/`)
    );
  },

  blockFriend: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.post(`/users/friends/${id}/block/`, data)
    );
  }
};
