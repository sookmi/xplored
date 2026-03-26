import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from '../components/Header';

const meta = {
  title: 'Design System/Header',
  component: Header,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    device: {
      control: 'select',
      options: ['Desktop', 'Tablet', 'Mobile'],
      description: '디바이스 타입',
    },
    activeMenu: {
      control: 'select',
      options: ['Resources', 'Insight', 'About'],
      description: '활성화된 메뉴',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { device: 'Desktop', activeMenu: 'Resources' },
};

export const AllVariants: Story = {
  render: () => {
    const devices = ['Desktop', 'Tablet', 'Mobile'] as const;
    const labelStyle: React.CSSProperties = {
      fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 8,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {devices.map((device) => (
          <div key={device}>
            <div style={labelStyle}>{device}</div>
            <Header device={device} activeMenu="Resources" />
          </div>
        ))}
      </div>
    );
  },
};
