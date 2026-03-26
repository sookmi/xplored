'use client';

import React from 'react';
import { HeaderMenu } from './HeaderMenu';
import type { LinkComponent } from '../types';

export interface NavigationHeaderItem {
  label: string;
  href: string;
}

export interface NavigationHeaderProps {
  brand: React.ReactNode;
  brandHref?: string;
  items: NavigationHeaderItem[];
  activeHref?: string;
  className?: string;
  themeToggle?: React.ReactNode;
  mobileAction?: React.ReactNode;
  LinkComponent?: LinkComponent;
}

export function NavigationHeader({
  brand,
  brandHref = '/',
  items,
  activeHref,
  className,
  themeToggle,
  mobileAction,
  LinkComponent,
}: NavigationHeaderProps) {
  const brandClassName =
    'text-xl font-semibold text-default-primary no-underline hover:opacity-80 transition-opacity';

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
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-default-tertiary backdrop-blur-sm ${className ?? ''}`.trim()}
      style={{ backgroundColor: 'var(--bg-utility-overlay-alpha-white-primary)' }}
    >
      {brandNode}

      <nav className="hidden sm:flex items-center gap-1">
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

      <div className="flex sm:hidden items-center gap-2">
        {themeToggle}
        {mobileAction}
      </div>
    </header>
  );
}
