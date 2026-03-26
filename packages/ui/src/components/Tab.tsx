'use client';

import React from 'react';
import type { LinkComponent } from '../types';

export type TabState = 'Enabled' | 'Hovered' | 'Active';

export interface TabProps {
  state?: TabState;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  LinkComponent?: LinkComponent;
}

const stateStyles: Record<TabState, { bg: string; text: string; fontWeight: number }> = {
  Enabled: { bg: 'var(--bg-default-tertiary)', text: 'var(--text-default-secondary)', fontWeight: 400 },
  Hovered: { bg: 'var(--bg-default-tertiary-hover)', text: 'var(--text-default-secondary)', fontWeight: 400 },
  Active: { bg: 'var(--bg-default-black-solid)', text: 'var(--text-utility-white)', fontWeight: 600 },
};

export const Tab: React.FC<TabProps> = ({
  state = 'Enabled',
  href,
  children = 'Label',
  onClick,
  className,
  LinkComponent,
}) => {
  const s = stateStyles[state];
  const hoverBg =
    state === 'Enabled'
      ? 'var(--bg-default-tertiary-hover)'
      : state === 'Active'
        ? 'var(--bg-default-black-solid-hover)'
        : undefined;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: 56,
    height: 36,
    paddingInline: 16,
    paddingBlock: 8,
    borderRadius: 999,
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: s.fontWeight,
    textAlign: 'center',
    textDecoration: 'none',
    backgroundColor: s.bg,
    color: s.text,
    border: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
    WebkitTapHighlightColor: 'transparent',
    whiteSpace: 'nowrap',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (hoverBg) e.currentTarget.style.backgroundColor = hoverBg;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (hoverBg) e.currentTarget.style.backgroundColor = s.bg;
  };

  if (href) {
    const linkProps = {
      role: 'tab',
      'aria-selected': state === 'Active',
      style,
      className,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    } as const;

    if (LinkComponent && href.startsWith('/')) {
      return (
        <LinkComponent href={href} {...linkProps}>
          {children}
        </LinkComponent>
      );
    }

    return (
      <a href={href} {...linkProps}>
        {children}
      </a>
    );
  }

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
