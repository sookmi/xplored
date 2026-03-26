'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderMenu } from './HeaderMenu';
import { Icon } from './Icon';
import ThemeToggle from './ThemeToggle';

const menuItems: { label: string; href: string }[] = [
  { label: 'Resources', href: '/' },
  { label: 'Insight', href: '/insight' },
  { label: 'About', href: '/about' },
];

export const Header: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();

  const getActiveMenu = () => {
    if (pathname === '/') return 'Resources';
    if (pathname.startsWith('/insight')) return 'Insight';
    if (pathname.startsWith('/about')) return 'About';
    if (pathname.startsWith('/resource')) return 'Resources';
    return 'Resources';
  };

  const activeMenu = getActiveMenu();

  return (
    <header
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-default-tertiary backdrop-blur-sm ${className ?? ''}`}
      style={{ backgroundColor: 'var(--bg-utility-overlay-alpha-white-primary)' }}
    >
      <Link
        href="/"
        className="text-xl font-semibold text-default-primary no-underline hover:opacity-80 transition-opacity"
      >
        XploreD
      </Link>

      <nav className="hidden sm:flex items-center gap-1">
        {menuItems.map((item) => (
          <HeaderMenu
            key={item.label}
            href={item.href}
            state={item.label === activeMenu ? 'Active' : 'Enabled'}
          >
            {item.label}
          </HeaderMenu>
        ))}
        <div className="pl-2">
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile: 햄버거 + 테마 토글 */}
      <div className="flex sm:hidden items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          className="p-2 rounded-full bg-transparent hover:bg-default-secondary transition-colors"
          aria-label="메뉴"
        >
          <Icon name="menu" size={20} color="icon-default-primary" />
        </button>
      </div>
    </header>
  );
};
