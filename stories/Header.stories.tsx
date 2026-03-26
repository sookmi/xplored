import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon, NavigationHeader, ThemeToggleButton } from '@xplored/ui';

const menuItems = [
  { label: 'Resources', href: '/' },
  { label: 'Insight', href: '/insight' },
  { label: 'About', href: '/about' },
] as const;

function MobileMenuButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full bg-transparent p-2 transition-colors"
      aria-label="메뉴"
    >
      <Icon name="menu" size={20} color="icon-default-primary" />
    </button>
  );
}

const meta = {
  title: 'Design System/Header',
  component: NavigationHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    activeHref: {
      control: 'select',
      options: ['/', '/insight', '/about'],
      description: '활성화된 메뉴 href',
    },
    mode: {
      control: 'select',
      options: ['Desktop', 'Tablet', 'Mobile', 'Responsive'],
      description: '헤더 미리보기 모드',
    },
  },
} satisfies Meta<typeof NavigationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    brand: 'XploreD',
    brandHref: '/',
    activeHref: '/',
    mode: 'Desktop',
    showThemeToggleOnMobile: false,
    items: menuItems,
    themeToggle: <ThemeToggleButton mode="light" />,
    mobileAction: <MobileMenuButton />,
  },
};

function HeaderFrame({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width,
        maxWidth: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {children}
    </div>
  );
}

export const AllVariants: Story = {
  args: {
    brand: 'XploreD',
    brandHref: '/',
    activeHref: '/',
    mode: 'Desktop',
    showThemeToggleOnMobile: false,
    items: menuItems,
  },
  render: (args) => {
    const variants = [
      { label: 'Desktop / Resources', mode: 'Desktop' as const, width: 1460, activeHref: '/' as const },
      { label: 'Desktop / Insight', mode: 'Desktop' as const, width: 1460, activeHref: '/insight' as const },
      { label: 'Desktop / About', mode: 'Desktop' as const, width: 1460, activeHref: '/about' as const },
      { label: 'Tablet / Resources', mode: 'Tablet' as const, width: 768, activeHref: '/' as const },
      { label: 'Tablet / Insight', mode: 'Tablet' as const, width: 768, activeHref: '/insight' as const },
      { label: 'Tablet / About', mode: 'Tablet' as const, width: 768, activeHref: '/about' as const },
      { label: 'Mobile', mode: 'Mobile' as const, width: 390, activeHref: '/' as const },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {variants.map((variant) => (
          <div key={variant.label}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 8 }}>
              {variant.label}
            </div>
            <HeaderFrame width={variant.width}>
              <NavigationHeader
                {...args}
                activeHref={variant.activeHref}
                mode={variant.mode}
                items={menuItems}
                themeToggle={<ThemeToggleButton mode="light" />}
                mobileAction={<MobileMenuButton />}
              />
            </HeaderFrame>
          </div>
        ))}
      </div>
    );
  },
};
