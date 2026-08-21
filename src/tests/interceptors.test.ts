import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../api/client';
import { setupInterceptors } from '../api/interceptors';
import { InternalAxiosRequestConfig } from 'axios';

describe('Axios Auth Interceptors', () => {
  let mockAccessToken: string | null = null;
  let mockRefreshToken: string | null = null;
  const onLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccessToken = 'mock_access_token_123';
    mockRefreshToken = 'mock_refresh_token_456';

    setupInterceptors(
      () => mockAccessToken,
      (token: string) => {
        mockAccessToken = token;
      },
      () => mockRefreshToken,
      onLogout
    );
  });

  it('should attach Bearer token to outgoing request headers when access token is present', async () => {
    const config: InternalAxiosRequestConfig = {
      headers: {} as unknown as InternalAxiosRequestConfig['headers'],
    } as InternalAxiosRequestConfig;

    // Trigger the request interceptor directly
    // @ts-expect-error accessing private interceptor handlers for unit test
    const requestInterceptor = apiClient.interceptors.request.handlers[0];
    const modifiedConfig = await requestInterceptor.fulfilled(config);

    expect(modifiedConfig.headers?.Authorization).toBe('Bearer mock_access_token_123');
  });

  it('should not attach Authorization header if access token is null', async () => {
    mockAccessToken = null;

    const config: InternalAxiosRequestConfig = {
      headers: {} as unknown as InternalAxiosRequestConfig['headers'],
    } as InternalAxiosRequestConfig;

    // @ts-expect-error accessing private interceptor handlers for unit test
    const requestInterceptor = apiClient.interceptors.request.handlers[0];
    const modifiedConfig = await requestInterceptor.fulfilled(config);

    expect(modifiedConfig.headers?.Authorization).toBeUndefined();
  });
});
