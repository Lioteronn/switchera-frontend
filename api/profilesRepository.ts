import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';


export const ProfilesRepository = {
  listProfiles: async () => {
    return handleApiError(() =>
      axiosInstance.get('/users/profiles/')
    );
  },

  getProfile: async (id: number) => {
    return handleApiError(() =>
      axiosInstance.get(`/users/profiles/${id}/`)
    );
  },

  getMyProfile: async () => {
    return handleApiError(() =>
      axiosInstance.get('/users/profiles/me/')
    );
  },

  followUser: async (id: number, data: any) => {
    return handleApiError(() =>
      axiosInstance.post(`/users/profiles/${id}/follow/`, data)
    );
  },

  getUserServices: async (id: number) => {
    return handleApiError(() =>
      axiosInstance.get(`/users/profiles/${id}/services/`)
    );
  }
};
