import { useState, useCallback } from 'react';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface UseApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export function useApi<T = any>(url: string, options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (overrideOptions?: UseApiOptions): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const finalOptions = { ...options, ...overrideOptions };
      const response = await fetch(`http://localhost:3001${url}`, {
        method: finalOptions.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...finalOptions.headers,
        },
        body: finalOptions.body ? JSON.stringify(finalOptions.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { execute, loading, error };
}

export function useMutation<T = any>(url: string, method: string = 'POST') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data?: any): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  return { mutate, loading, error };
}
