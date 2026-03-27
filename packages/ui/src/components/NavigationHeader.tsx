'use client';

import React from 'react';
import { HeaderMenu } from './HeaderMenu';
import { Icon } from './Icon';
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
  initialMobileMenuOpen?: boolean;
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
  initialMobileMenuOpen = false,
  LinkComponent,
}: NavigationHeaderProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(initialMobileMenuOpen);
  const isDesktop = mode === 'Desktop';
  const isTablet = mode === 'Tablet';
  const isMobile = mode === 'Mobile';
  const isResponsive = mode === 'Responsive';
  const supportsMobileMenu = isResponsive || isMobile;

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

  const headerBorderColor = 'rgba(148, 163, 184, 0.09)';
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const defaultSurfaceStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-utility-overlay-alpha-white-primary)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };
  const mobileOpenSurfaceStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-default-primary)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  };
  const headerSurfaceStyle = isMobileMenuOpen && supportsMobileMenu ? mobileOpenSurfaceStyle : defaultSurfaceStyle;

  React.useEffect(() => {
    if (!supportsMobileMenu) {
      setIsMobileMenuOpen(false);
    }
  }, [supportsMobileMenu]);

  React.useEffect(() => {
    setIsMobileMenuOpen(initialMobileMenuOpen);
  }, [initialMobileMenuOpen]);

  React.useEffect(() => {
    closeMobileMenu();
  }, [activeHref]);

  React.useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={rootRef}
      className={`w-full border-b ${className ?? ''}`.trim()}
      style={{
        borderColor: headerBorderColor,
        ...headerSurfaceStyle,
      }}
    >
      <div className="relative">
        <div
          className={[
            'relative z-10 mx-auto flex h-16 w-full items-center justify-between',
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
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-transparent p-2 transition-colors"
                aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen
                  ? <Icon name="x" size={20} color="icon-default-primary" />
                  : (mobileAction ?? <Icon name="menu" size={20} color="icon-default-primary" />)}
              </button>
            </div>
          ) : null}
        </div>

        {supportsMobileMenu && isMobileMenuOpen ? (
          <div
            id="mobile-navigation-menu"
            className={isResponsive ? 'absolute inset-x-0 top-full z-0 sm:hidden' : 'absolute inset-x-0 top-full z-0'}
            style={{
              ...mobileOpenSurfaceStyle,
            }}
            onClick={closeMobileMenu}
          >
            <div className="mx-auto flex h-[calc(100dvh-64px)] w-full max-w-[1280px] flex-col justify-between px-4 pb-4 pt-4">
              <nav className="flex flex-col items-stretch gap-1" onClick={(event) => event.stopPropagation()}>
                {items.map((item) => {
                  const itemClassName =
                    'block rounded-2xl px-4 py-4 text-[16px] font-semibold leading-6 no-underline transition-colors';
                  const itemStyle: React.CSSProperties = {
                    color:
                      item.href === activeHref
                        ? 'var(--text-default-primary)'
                        : 'var(--text-default-tertiary)',
                  };

                  if (LinkComponent && item.href.startsWith('/')) {
                    return (
                      <LinkComponent
                        key={item.label}
                        href={item.href}
                        className={itemClassName}
                        style={itemStyle}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </LinkComponent>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={itemClassName}
                      style={itemStyle}
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              {themeToggle ? (
                <div className="flex w-full justify-end py-2" onClick={(event) => event.stopPropagation()}>
                  <div className="[&>button]:p-3">{themeToggle}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
