import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';

export const MessagesRepository = {
  listMessages: async () => {
    return handleApiError(() =>
      axiosInstance.get('/users/messages/')
    );
  },

  getMessage: async (id: string) => {
    return handleApiError(() =>
      axiosInstance.get(`/users/messages/${id}/`)
    );
  },

  createMessage: async (data: any) => {
    return handleApiError(() =>
      axiosInstance.post('/users/messages/', data)
    );
  },

  updateMessage: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.put(`/users/messages/${id}/`, data)
    );
  },

  patchMessage: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.patch(`/users/messages/${id}/`, data)
    );
  },

  deleteMessage: async (id: string) => {
    return handleApiError(() =>
      axiosInstance.delete(`/users/messages/${id}/`)
    );
  }
};
