'use client';

import React from 'react';
import type { LinkComponent } from '../types';

export type HeaderMenuState = 'Enabled' | 'Hovered' | 'Active';

export interface HeaderMenuProps {
  state?: HeaderMenuState;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  LinkComponent?: LinkComponent;
}

const textColorMap: Record<HeaderMenuState, string> = {
  Active: 'var(--text-default-primary)',
  Hovered: 'var(--text-default-primary)',
  Enabled: 'var(--text-default-tertiary)',
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: 16,
  paddingBlock: 8,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  letterSpacing: '-0.16px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'color 150ms',
  textDecoration: 'none',
};

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  state = 'Enabled',
  href,
  children = 'Menu',
  onClick,
  className,
  LinkComponent,
}) => {
  const style: React.CSSProperties = { ...baseStyle, color: textColorMap[state] };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (state === 'Enabled') e.currentTarget.style.color = textColorMap.Hovered;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (state === 'Enabled') e.currentTarget.style.color = textColorMap.Enabled;
  };

  if (href) {
    const linkProps = {
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
