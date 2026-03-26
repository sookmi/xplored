import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Tab } from '../components/Tab';

const meta = {
  title: 'Design System/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['Enabled', 'Hovered', 'Active'],
      description: '탭 상태',
    },
    children: {
      control: 'text',
      description: '탭 텍스트',
    },
  },
  args: {
    onClick: fn(),
    children: 'Label',
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { state: 'Enabled', children: 'Label' },
};

export const AllVariants: Story = {
  render: () => {
    const states = ['Enabled', 'Hovered', 'Active'] as const;
    const samples = ['Label', '설정', '탭'] as const;
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
                      <Tab state={state}>{text}</Tab>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 style={{ marginBottom: 20, fontSize: 15, fontWeight: 700 }}>Tab Group</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <Tab state="Active">전체</Tab>
            <Tab state="Enabled">인기</Tab>
            <Tab state="Enabled">최신</Tab>
            <Tab state="Enabled">추천</Tab>
          </div>
        </div>
      </div>
    );
  },
};
