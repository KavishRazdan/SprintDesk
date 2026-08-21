import { create } from 'zustand';
import { User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  restoreSession: () => Promise<boolean>;
}

// In-memory token reference for non-persisted access token
let memoryAccessToken: string | null = null;

export const getInMemoryAccessToken = () => memoryAccessToken;
export const setInMemoryAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isRestoringSession: true,

  setAuth: (user, accessToken, refreshToken) => {
    setInMemoryAccessToken(accessToken);
    localStorage.setItem('sprintdesk_refresh_token', refreshToken);
    localStorage.setItem('sprintdesk_user', JSON.stringify(user));
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isRestoringSession: false,
    });
  },

  setAccessToken: (token) => {
    setInMemoryAccessToken(token);
    set({ accessToken: token });
  },

  logout: () => {
    setInMemoryAccessToken(null);
    localStorage.removeItem('sprintdesk_refresh_token');
    localStorage.removeItem('sprintdesk_user');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isRestoringSession: false,
    });
  },

  restoreSession: async () => {
    const storedRefreshToken = localStorage.getItem('sprintdesk_refresh_token');
    const storedUserRaw = localStorage.getItem('sprintdesk_user');

    if (storedRefreshToken && storedUserRaw) {
      try {
        const user = JSON.parse(storedUserRaw) as User;
        const dummyAccessToken = `restored_access_${Date.now()}`;
        setInMemoryAccessToken(dummyAccessToken);
        set({
          user,
          accessToken: dummyAccessToken,
          refreshToken: storedRefreshToken,
          isAuthenticated: true,
          isRestoringSession: false,
        });
        return true;
      } catch {
        localStorage.removeItem('sprintdesk_refresh_token');
        localStorage.removeItem('sprintdesk_user');
      }
    }

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isRestoringSession: false,
    });
    return false;
  },
}));
