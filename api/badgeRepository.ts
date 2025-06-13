import axiosInstance from './axiosInstance';

import { handleApiError } from './utils';

export const BadgesRepository = {
  listBadges: async () => {
    return handleApiError(() =>
      axiosInstance.get('/users/badges/')
    );
  },

  getBadgeById: async (medalId: string) => {
    return handleApiError(() =>
      axiosInstance.get(`/users/badges/${medalId}/`)
    );
  }
};
