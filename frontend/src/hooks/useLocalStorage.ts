import { useState } from 'react';
import { storage } from '../utils/helpers';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    const result = storage.get(key, initialValue);
    return result ?? initialValue;
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Hook for session storage
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  };

  return [storedValue, setValue];
}
