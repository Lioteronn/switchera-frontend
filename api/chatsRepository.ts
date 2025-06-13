import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';


export const ChatsRepository = {
  listChats: async () => {
    return handleApiError(() =>
      axiosInstance.get('/users/chats/')
    );
  },

  getChat: async (id: string) => {
    return handleApiError(() =>
      axiosInstance.get(`/users/chats/${id}/`)
    );
  },

  createChat: async (data: any) => {
    return handleApiError(() =>
      axiosInstance.post('/users/chats/', data)
    );
  },

  updateChat: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.put(`/users/chats/${id}/`, data)
    );
  },

  patchChat: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.patch(`/users/chats/${id}/`, data)
    );
  },

  deleteChat: async (id: string) => {
    return handleApiError(() =>
      axiosInstance.delete(`/users/chats/${id}/`)
    );
  },

  sendMessage: async (id: string, data: any) => {
    return handleApiError(() =>
      axiosInstance.post(`/users/chats/${id}/send_message/`, data)
    );
  }
};
