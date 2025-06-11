import axiosInstance from './axiosInstance';

import { AUTH_ENDPOINTS } from './endpoints';

import { handleApiError } from './utils';

export const UserRepository = {
    register: async (username: string, first_name: string, last_name: string, email: string, password: string) => {
        return handleApiError(async () => {
            const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
                username,
                first_name,
                last_name,
                email,
                password
            });
            return response;
        })
    },

    login: async (username: string, password: string) => {
        return handleApiError(async () => {
            const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
                username,
                password
            });
            return response;
        });
    },

    refresh: async (refreshToken: string) => {
        return handleApiError(async () => {
            const response = await axiosInstance.post(AUTH_ENDPOINTS.REFRESH, {
                refresh: refreshToken
            });
            return response;
        });
    }
};
