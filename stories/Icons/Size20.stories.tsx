import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon, iconCategories, type IconColor, type IconName, type IconSize } from '@xplored/ui';

const colorOptions: IconColor[] = [
  'icon-default-primary',
  'icon-default-secondary',
  'icon-default-tertiary',
  'icon-brand-primary',
  'icon-brand-secondary',
  'icon-error-primary',
  'icon-error-secondary',
  'icon-success-primary',
  'icon-warning-primary',
  'icon-info-primary',
  'icon-disabled-primary',
  'icon-utility-white',
];

function IconCell({ name, size, color }: { name: IconName; size: IconSize; color: IconColor }) {
  const [hovered, setHovered] = React.useState(false);
  const box = size + 20;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: box,
          height: box,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: color === 'icon-utility-white' ? '#1e293b' : '#ffffff',
          border: hovered ? '1px dashed #E0E0E0' : '1px solid transparent',
          transition: 'border-color 150ms',
        }}
      >
        <Icon name={name} size={size} color={color} />
      </div>
      <span style={{
        fontSize: 10,
        fontFamily: 'monospace',
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: box + 16,
        wordBreak: 'break-all',
      }}>
        {name}
      </span>
    </div>
  );
}

function IconGrid({ color }: { color: IconColor }) {
  const SIZE: IconSize = 20;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.03em' }}>
        Icon — {SIZE}px
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40 }}>
        {SIZE}×{SIZE} 아이콘 검수 그리드 · 마우스를 올리면 Bounding Box 가이드선 표시
      </p>

      {Object.entries(iconCategories).map(([category, icons]) => (
        <section key={category}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 24, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {category}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {icons.map((name: IconName) => (
              <IconCell key={name} name={name} size={SIZE} color={color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Icons/Size 20',
  component: IconGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: colorOptions,
      description: '아이콘 컬러 토큰',
    },
  },
} satisfies Meta<typeof IconGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: { color: 'icon-default-primary' },
};
