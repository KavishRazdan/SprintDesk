import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from './components/Toast';
import { useThemeStore } from './store/theme.store';
import { setupInterceptors } from './api/interceptors';
import { useAuthStore, getInMemoryAccessToken } from './store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const logout = useAuthStore((state) => state.logout);

  // Initialize theme class on document HTML root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Setup Axios auth interceptors with memory token getter and refresh handling
  useEffect(() => {
    setupInterceptors(
      getInMemoryAccessToken,
      setAccessToken,
      () => localStorage.getItem('sprintdesk_refresh_token'),
      logout
    );
  }, [setAccessToken, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
