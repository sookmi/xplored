'use client';

import React from 'react';

export type TabState = 'Enabled' | 'Hovered' | 'Active';

export interface TabProps {
  state?: TabState;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const stateStyles: Record<TabState, { bg: string; text: string; fontWeight: number }> = {
  Enabled: { bg: 'var(--bg-default-tertiary)', text: 'var(--text-default-secondary)', fontWeight: 400 },
  Hovered: { bg: 'var(--bg-default-tertiary-hover)', text: 'var(--text-default-secondary)', fontWeight: 400 },
  Active:  { bg: 'var(--bg-default-black-solid)', text: 'var(--text-utility-white)', fontWeight: 600 },
};

export const Tab: React.FC<TabProps> = ({
  state = 'Enabled',
  children = 'Label',
  onClick,
  className,
}) => {
  const s = stateStyles[state];

  const hoverBg = state === 'Enabled'
    ? 'var(--bg-default-tertiary-hover)'
    : state === 'Active'
      ? 'var(--bg-default-black-solid-hover)'
      : undefined;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    height: 36,
    paddingInline: 16,
    paddingBlock: 8,
    borderRadius: 999,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: s.fontWeight,
    backgroundColor: s.bg,
    color: s.text,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    whiteSpace: 'nowrap',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverBg) e.currentTarget.style.backgroundColor = hoverBg;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverBg) e.currentTarget.style.backgroundColor = s.bg;
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={state === 'Active'}
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
