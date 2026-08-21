import { apiClient } from '../api/client';
import { LoginResponse } from '../types/auth.types';

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
      expiresInMins: 60,
    });
    return response.data;
  },
};
