import { useState, useEffect } from 'react';
import { debounce } from '../utils/helpers';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debouncedSetValue = debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay);

    debouncedSetValue(value);
  }, [value, delay]);

  return debouncedValue;
}

// Hook for debounced callback
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(callback as T);

  useEffect(() => {
    const debounced = debounce(callback, delay);
    setDebouncedCallback(debounced as T);
  }, [callback, delay]);

  return debouncedCallback;
}
