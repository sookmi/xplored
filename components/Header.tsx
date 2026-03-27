'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Icon, NavigationHeader, ThemeToggle } from '@xplored/ui';
import { NextLinkAdapter } from './NextLinkAdapter';

const menuItems: { label: string; href: string }[] = [
  { label: 'Resources', href: '/' },
  { label: 'Insight', href: '/insight' },
  { label: 'About', href: '/about' },
];

export const Header: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const resolvedClassName = ['fixed inset-x-0 top-0 z-50', className].filter(Boolean).join(' ');

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
      className={resolvedClassName}
      themeToggle={<ThemeToggle />}
      showThemeToggleOnMobile={false}
      mobileAction={<Icon name="menu" size={20} color="icon-default-primary" />}
      LinkComponent={NextLinkAdapter}
    />
  );
};
