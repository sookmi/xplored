'use client';

import React from 'react';

export type HeaderMenuState = 'Enabled' | 'Hovered' | 'Active';

export interface HeaderMenuProps {
  state?: HeaderMenuState;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const textColorMap: Record<HeaderMenuState, string> = {
  Active: 'var(--text-default-primary)',
  Hovered: 'var(--text-default-primary)',
  Enabled: 'var(--text-default-tertiary)',
};

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  state = 'Enabled',
  children = 'Menu',
  onClick,
  className,
}) => {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: 16,
    paddingBlock: 8,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    letterSpacing: '-0.16px',
    color: textColorMap[state],
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 150ms',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state === 'Enabled') {
      e.currentTarget.style.color = textColorMap.Hovered;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state === 'Enabled') {
      e.currentTarget.style.color = textColorMap.Enabled;
    }
  };

  return (
    <button
      type="button"
      style={style}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};
