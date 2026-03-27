'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggleButton } from './ThemeToggleButton';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeToggleButton
      mounted={mounted}
      mode={theme === 'dark' ? 'dark' : 'light'}
      onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    />
  );
}
