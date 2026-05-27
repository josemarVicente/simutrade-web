'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import type { AuthResponse, User } from '@/types';

export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => api.get('/api/user').then((r) => r.data),
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>('/api/login', data).then((r) => r.data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => api.post('/api/register', data).then((r) => r.data),
    onSuccess: () => {
      router.push('/login');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/api/logout').then((r) => r.data),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
      router.push('/login');
    },
  });
}
