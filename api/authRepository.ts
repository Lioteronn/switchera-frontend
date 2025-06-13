import axiosInstance from './axiosInstance';

import { handleApiError } from './utils';

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
