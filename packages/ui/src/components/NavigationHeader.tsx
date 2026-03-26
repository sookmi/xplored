'use client';

import React from 'react';
import { HeaderMenu } from './HeaderMenu';
import type { LinkComponent } from '../types';

export interface NavigationHeaderItem {
  label: string;
  href: string;
}

export type NavigationHeaderMode = 'Responsive' | 'Desktop' | 'Tablet' | 'Mobile';

export interface NavigationHeaderProps {
  brand: React.ReactNode;
  brandHref?: string;
  items: NavigationHeaderItem[];
  activeHref?: string;
  mode?: NavigationHeaderMode;
  className?: string;
  themeToggle?: React.ReactNode;
  showThemeToggleOnMobile?: boolean;
  mobileAction?: React.ReactNode;
  LinkComponent?: LinkComponent;
}

export function NavigationHeader({
  brand,
  brandHref = '/',
  items,
  activeHref,
  mode = 'Responsive',
  className,
  themeToggle,
  showThemeToggleOnMobile = false,
  mobileAction,
  LinkComponent,
}: NavigationHeaderProps) {
  const isDesktop = mode === 'Desktop';
  const isTablet = mode === 'Tablet';
  const isMobile = mode === 'Mobile';
  const isResponsive = mode === 'Responsive';

  const brandClassName =
    'inline-flex items-center text-[20px] leading-6 font-semibold text-default-primary no-underline transition-opacity hover:opacity-80';

  const brandNode =
    LinkComponent && brandHref.startsWith('/') ? (
      <LinkComponent href={brandHref} className={brandClassName}>
        {brand}
      </LinkComponent>
    ) : (
      <a href={brandHref} className={brandClassName}>
        {brand}
      </a>
    );

  return (
    <header
      className={`w-full border-b border-default-tertiary ${className ?? ''}`.trim()}
      style={{
        backgroundColor: 'var(--bg-utility-overlay-alpha-white-primary)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className={[
          'mx-auto flex h-16 w-full items-center justify-between',
          isResponsive ? 'max-w-[1280px] px-4 sm:px-6 xl:px-8' : '',
          isDesktop ? 'max-w-[1280px] px-8' : '',
          isTablet ? 'px-6' : '',
          isMobile ? 'px-4' : '',
        ].join(' ').trim()}
      >
        {brandNode}

        {(isResponsive || isDesktop || isTablet) ? (
          <nav className={isResponsive ? 'hidden sm:flex items-center gap-1' : 'flex items-center gap-1'}>
            {items.map((item) => (
              <HeaderMenu
                key={item.label}
                href={item.href}
                state={item.href === activeHref ? 'Active' : 'Enabled'}
                LinkComponent={LinkComponent}
              >
                {item.label}
              </HeaderMenu>
            ))}
            {themeToggle ? <div className="pl-2">{themeToggle}</div> : null}
          </nav>
        ) : null}

        {(isResponsive || isMobile) ? (
          <div className={isResponsive ? 'flex sm:hidden items-center gap-2' : 'flex items-center gap-2'}>
            {showThemeToggleOnMobile ? themeToggle : null}
            {mobileAction}
          </div>
        ) : null}
      </div>
    </header>
  );
}
