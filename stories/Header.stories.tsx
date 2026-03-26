import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon, NavigationHeader, ThemeToggleButton } from '@xplored/ui';
import type { LinkComponentProps } from '@xplored/ui';

const menuItems = [
  { label: 'Resources', href: '/' },
  { label: 'Insight', href: '/insight' },
  { label: 'About', href: '/about' },
] as const;

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
    initialMobileMenuOpen: {
      control: 'boolean',
      description: '모바일 메뉴 초기 오픈 상태 (스토리북 미리보기용)',
    },
  },
} satisfies Meta<typeof NavigationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function StorybookStaticLinkAdapter({ href, children, onClick, ...props }: LinkComponentProps) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

function InteractiveHeaderPreview({
  args,
}: {
  args: NonNullable<Story['args']>;
}) {
  const [activeHref, setActiveHref] = React.useState(args.activeHref ?? '/');

  React.useEffect(() => {
    setActiveHref(args.activeHref ?? '/');
  }, [args.activeHref]);

  return (
    <NavigationHeader
      {...args}
      activeHref={activeHref}
      LinkComponent={({ href, children, onClick, ...props }: LinkComponentProps) => (
        <a
          href={href}
          {...props}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
            if (href.startsWith('/')) setActiveHref(href);
          }}
        >
          {children}
        </a>
      )}
    />
  );
}

export const Playground: Story = {
  args: {
    brand: 'XploreD',
    brandHref: '/',
    activeHref: '/',
    mode: 'Mobile',
    showThemeToggleOnMobile: false,
    initialMobileMenuOpen: false,
    items: menuItems,
    themeToggle: <ThemeToggleButton mode="light" />,
    mobileAction: <Icon name="menu" size={20} color="icon-default-primary" />,
  },
  render: (args) => {
    const widthByMode: Record<NonNullable<typeof args.mode>, number> = {
      Desktop: 1460,
      Tablet: 768,
      Mobile: 390,
      Responsive: 390,
    };
    const mode = args.mode ?? 'Mobile';
    const isMobilePreview = mode === 'Mobile' || mode === 'Responsive';

    return (
      <div style={{ minHeight: isMobilePreview ? 760 : undefined }}>
        <HeaderFrame width={widthByMode[mode]} allowOverflow={isMobilePreview}>
          <InteractiveHeaderPreview args={args} />
        </HeaderFrame>
      </div>
    );
  },
};

function HeaderFrame({
  width,
  allowOverflow = false,
  children,
}: {
  width: number | string;
  allowOverflow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width,
        maxWidth: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: 20,
        overflow: allowOverflow ? 'visible' : 'hidden',
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
    initialMobileMenuOpen: false,
    items: menuItems,
  },
  render: (args) => {
    const variants = [
      { label: 'Desktop / Resources', mode: 'Desktop' as const, width: 1460, activeHref: '/' as const, initialMobileMenuOpen: false },
      { label: 'Desktop / Insight', mode: 'Desktop' as const, width: 1460, activeHref: '/insight' as const, initialMobileMenuOpen: false },
      { label: 'Desktop / About', mode: 'Desktop' as const, width: 1460, activeHref: '/about' as const, initialMobileMenuOpen: false },
      { label: 'Tablet / Resources', mode: 'Tablet' as const, width: 768, activeHref: '/' as const, initialMobileMenuOpen: false },
      { label: 'Tablet / Insight', mode: 'Tablet' as const, width: 768, activeHref: '/insight' as const, initialMobileMenuOpen: false },
      { label: 'Tablet / About', mode: 'Tablet' as const, width: 768, activeHref: '/about' as const, initialMobileMenuOpen: false },
      { label: 'Mobile / Closed', mode: 'Mobile' as const, width: 390, activeHref: '/' as const, initialMobileMenuOpen: false },
      { label: 'Mobile / Open', mode: 'Mobile' as const, width: 390, activeHref: '/' as const, initialMobileMenuOpen: true },
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
                initialMobileMenuOpen={variant.initialMobileMenuOpen}
                themeToggle={<ThemeToggleButton mode="light" />}
                mobileAction={<Icon name="menu" size={20} color="icon-default-primary" />}
                LinkComponent={StorybookStaticLinkAdapter}
              />
            </HeaderFrame>
          </div>
        ))}
      </div>
    );
  },
};
