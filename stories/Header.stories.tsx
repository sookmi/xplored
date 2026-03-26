import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon, NavigationHeader, ThemeToggleButton } from '@xplored/ui';

const meta = {
  title: 'Design System/Header',
  component: NavigationHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeHref: {
      control: 'select',
      options: ['/', '/insight', '/about'],
      description: '활성화된 메뉴 href',
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
    items: [
      { label: 'Resources', href: '/' },
      { label: 'Insight', href: '/insight' },
      { label: 'About', href: '/about' },
    ],
    themeToggle: <ThemeToggleButton mode="light" />,
    mobileAction: (
      <button
        type="button"
        className="p-2 rounded-full bg-transparent hover:bg-default-secondary transition-colors"
        aria-label="메뉴"
      >
        <Icon name="menu" size={20} color="icon-default-primary" />
      </button>
    ),
  },
};

export const AllVariants: Story = {
  render: () => {
    const activeHrefs = ['/', '/insight', '/about'] as const;
    const labelStyle: React.CSSProperties = {
      fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 8,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {activeHrefs.map((activeHref) => (
          <div key={activeHref}>
            <div style={labelStyle}>{activeHref}</div>
            <NavigationHeader
              brand="XploreD"
              brandHref="/"
              activeHref={activeHref}
              items={[
                { label: 'Resources', href: '/' },
                { label: 'Insight', href: '/insight' },
                { label: 'About', href: '/about' },
              ]}
              themeToggle={<ThemeToggleButton mode="light" />}
              mobileAction={
                <button
                  type="button"
                  className="p-2 rounded-full bg-transparent hover:bg-default-secondary transition-colors"
                  aria-label="메뉴"
                >
                  <Icon name="menu" size={20} color="icon-default-primary" />
                </button>
              }
            />
          </div>
        ))}
      </div>
    );
  },
};
