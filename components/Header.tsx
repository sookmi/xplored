import React from 'react';
import { HeaderMenu } from './HeaderMenu';

export type HeaderDevice = 'Desktop' | 'Tablet' | 'Mobile';

export interface HeaderProps {
  device?: HeaderDevice;
  activeMenu?: string;
  className?: string;
}

const MoonIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.1 12.6A7.5 7.5 0 0 1 7.4 2.9a7.5 7.5 0 1 0 9.7 9.7Z"
      stroke="var(--icon-default-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HamburgerIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 5h14M3 10h14M3 15h14"
      stroke="var(--icon-default-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const menuItems = ['Resources', 'Insight', 'About'];

export const Header: React.FC<HeaderProps> = ({
  device = 'Desktop',
  activeMenu = 'Resources',
  className,
}) => {
  const isMobile = device === 'Mobile';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: device === 'Desktop' ? 1280 : device === 'Tablet' ? 768 : 390,
    height: 64,
    paddingInline: device === 'Desktop' ? 32 : device === 'Tablet' ? 24 : 16,
    borderBottom: '1px solid var(--border-default-tertiary)',
    backdropFilter: isMobile ? undefined : 'blur(6px)',
    backgroundColor: isMobile ? undefined : 'var(--bg-utility-overlay-alpha-white-primary)',
    boxSizing: 'border-box',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 600,
    color: 'var(--text-default-primary)',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const iconButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'var(--bg-default-secondary)',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <header style={containerStyle} className={className}>
      <a href="https://www.xplored.design/" style={logoStyle}>XploreD</a>

      {isMobile ? (
        <button type="button" style={{ ...iconButtonStyle, background: 'transparent' }} aria-label="Menu">
          <HamburgerIcon />
        </button>
      ) : (
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {menuItems.map((item) => (
            <HeaderMenu key={item} state={item === activeMenu ? 'Active' : 'Enabled'}>{item}</HeaderMenu>
          ))}
          <div style={{ paddingLeft: 8 }}>
            <button type="button" style={iconButtonStyle} aria-label="Toggle theme">
              <MoonIcon />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
