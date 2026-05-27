import type { AxiosError } from 'axios';

type LaravelErrorShape =
  | { message?: string; errors?: Record<string, string[]> }
  | { error?: string; message?: string };

export function getApiErrorMessage(err: unknown, fallback = 'Ocorreu um erro. Tente novamente.') {
  const axiosErr = err as AxiosError<LaravelErrorShape>;
  const data = axiosErr?.response?.data;

  if (!data) return fallback;

  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if ((data as any).error) return (data as any).error as string;

  const errors = 'errors' in data ? (data as any).errors : undefined;
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0];
    const first = firstKey ? errors[firstKey]?.[0] : undefined;
    if (first) return first;
  }

  return fallback;
}

