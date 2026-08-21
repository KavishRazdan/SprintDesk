import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import { useToast } from './useToast';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoringSession = useAuthStore((state) => state.isRestoringSession);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  const toast = useToast();

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(username, password);
      setAuth(
        {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
        },
        data.accessToken,
        data.refreshToken
      );
      toast.success(`Welcome back, ${data.firstName}!`);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Invalid username or password';
      toast.error(errorMessage || 'Login failed. Please check credentials.');
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isRestoringSession,
    login,
    logout,
    restoreSession,
  };
};
