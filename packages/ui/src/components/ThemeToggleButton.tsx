'use client';

import React from 'react';
import { Icon } from './Icon';

export interface ThemeToggleButtonProps {
  mode?: 'light' | 'dark';
  mounted?: boolean;
  onToggle?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function ThemeToggleButton({
  mode = 'light',
  mounted = true,
  onToggle,
  className,
  ariaLabel = '테마 전환',
}: ThemeToggleButtonProps) {
  if (!mounted) {
    return (
      <button className={`p-2 rounded-full bg-default-secondary cursor-default ${className ?? ''}`.trim()} aria-hidden>
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-2 rounded-full bg-default-secondary hover:bg-default-tertiary transition-colors inline-flex items-center justify-center ${className ?? ''}`.trim()}
      aria-label={ariaLabel}
    >
      {mode === 'dark' ? (
        <Icon name="sun" size={20} color="icon-default-secondary" />
      ) : (
        <Icon name="moon" size={20} color="icon-default-secondary" />
      )}
    </button>
  );
}
