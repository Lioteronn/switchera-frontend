

import axiosInstance from './axiosInstance';

import { handleApiError } from './utils';


interface AuthResponse {
  access: string;
  refresh: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
  followers: number;
  following: number;
  posts: number;
  services: number;
}



export const AuthRepository = {
  login: async (username: string, password: string) => {
    return handleApiError(() =>
      axiosInstance.post('/token/', { username, password })
    );
  },

  refresh: async (refresh: string) => {
    return handleApiError(() =>
      axiosInstance.post('/token/refresh/', { refresh })
    );
  },
};



