import { useEffect, useState } from 'react';

export default function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      return storedValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
