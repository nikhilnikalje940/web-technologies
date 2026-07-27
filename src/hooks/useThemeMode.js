import { useEffect, useState } from 'react';
import useLocalStorageState from './useLocalStorageState';

export default function useThemeMode() {
  const [prefersDark, setPrefersDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [themeMode, setThemeMode] = useLocalStorageState('clock-dashboard-theme', 'auto');
  const resolvedTheme =
    themeMode === 'auto' ? (prefersDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setPrefersDark(event.matches);

    mediaQuery.addEventListener('change', handleChange);
    setPrefersDark(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return { themeMode, setThemeMode, resolvedTheme };
}
