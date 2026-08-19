import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';
import { authService } from '@/features/auth/services/auth.service';
import type { AuthUser, LoginResponse } from '@/types/auth.types';

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    logout: vi.fn(),
    getMe: vi.fn(),
  },
}));

describe('AuthStore (Zustand Global State)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('should initialize with default unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update state when setUser is called with valid user', () => {
    const mockUser: AuthUser = {
      id: 'usr_1',
      firstName: 'Berk',
      lastName: 'Güngör',
      email: 'berk@insurahub.com',
      role: 'SUPERADMIN',
      branchId: null,
      agencyId: null,
      companyId: null,
    };

    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('should clear state on logout', async () => {
    const mockUser: AuthUser = {
      id: 'usr_1',
      firstName: 'Berk',
      lastName: 'Güngör',
      role: 'SUPERADMIN',
    };

    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    vi.mocked(authService.logout).mockResolvedValueOnce({
      message: 'Çıkış başarılı',
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should authenticate user on successful checkAuth', async () => {
    const mockUser: AuthUser = {
      id: 'usr_1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@insurahub.com',
      role: 'BROKER',
    };

    const mockResponse: LoginResponse = {
      user: mockUser,
    };

    vi.mocked(authService.getMe).mockResolvedValueOnce(mockResponse);

    await useAuthStore.getState().checkAuth();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });
});
