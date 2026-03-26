import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { HeaderMenu } from '../components/HeaderMenu';

const meta = {
  title: 'Design System/HeaderMenu',
  component: HeaderMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['Enabled', 'Hovered', 'Active'],
      description: '메뉴 아이템 상태',
    },
    children: {
      control: 'text',
      description: '메뉴 텍스트',
    },
  },
  args: {
    onClick: fn(),
    children: 'Menu',
  },
} satisfies Meta<typeof HeaderMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { state: 'Enabled', children: 'Menu' },
};

export const AllVariants: Story = {
  render: () => {
    const states = ['Enabled', 'Hovered', 'Active'] as const;
    const samples = ['Resources', 'Insight', 'About'] as const;
    const labelStyle: React.CSSProperties = {
      fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', minWidth: 56,
    };
    const headerStyle: React.CSSProperties = {
      fontSize: 11, color: '#64748b', fontFamily: 'monospace', fontWeight: 600,
      textAlign: 'center', padding: '0 8px 8px',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div>
          <h3 style={{ marginBottom: 20, fontSize: 15, fontWeight: 700 }}>States</h3>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th />
                {samples.map((s) => (
                  <th key={s} style={headerStyle}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state}>
                  <td style={{ ...labelStyle, paddingRight: 12, paddingTop: 6 }}>{state}</td>
                  {samples.map((text) => (
                    <td key={text} style={{ padding: '4px 8px' }}>
                      <HeaderMenu state={state}>{text}</HeaderMenu>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 style={{ marginBottom: 20, fontSize: 15, fontWeight: 700 }}>Menu Group</h3>
          <div style={{ display: 'flex', gap: 4 }}>
            <HeaderMenu state="Active">Resources</HeaderMenu>
            <HeaderMenu state="Enabled">Insight</HeaderMenu>
            <HeaderMenu state="Enabled">About</HeaderMenu>
          </div>
        </div>
      </div>
    );
  },
};
