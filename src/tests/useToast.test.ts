import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, useToastStore } from '../hooks/useToast';

describe('useToast hook', () => {
  beforeEach(() => {
    act(() => {
      useToastStore.setState({ toasts: [] });
    });
  });

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should dispatch success toast item correctly', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Task created successfully');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Task created successfully');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('should dispatch error toast item correctly', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Failed to log in');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Failed to log in');
    expect(result.current.toasts[0].type).toBe('error');
  });

  it('should remove toast when removeToast is called', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string = '';
    act(() => {
      toastId = result.current.info('Notification test');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
