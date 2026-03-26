'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavigationHeader } from '@xplored/ui';
import { Icon } from './Icon';
import ThemeToggle from './ThemeToggle';
import { NextLinkAdapter } from './NextLinkAdapter';

const menuItems: { label: string; href: string }[] = [
  { label: 'Resources', href: '/' },
  { label: 'Insight', href: '/insight' },
  { label: 'About', href: '/about' },
];

export const Header: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();

  const activeHref = (() => {
    if (pathname === '/') return '/';
    if (pathname.startsWith('/insight')) return '/insight';
    if (pathname.startsWith('/about')) return '/about';
    if (pathname.startsWith('/resource')) return '/';
    return '/';
  })();

  return (
    <NavigationHeader
      brand="XploreD"
      brandHref="/"
      items={menuItems}
      activeHref={activeHref}
      mode="Responsive"
      className={className}
      themeToggle={<ThemeToggle />}
      showThemeToggleOnMobile={false}
      mobileAction={
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-transparent p-2 transition-colors"
          aria-label="메뉴"
        >
          <Icon name="menu" size={20} color="icon-default-primary" />
        </button>
      }
      LinkComponent={NextLinkAdapter}
    />
  );
};
