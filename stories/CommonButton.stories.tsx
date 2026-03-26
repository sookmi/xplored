import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CommonButton } from '@xplored/ui';

const meta = {
  title: 'Design System/CommonButton',
  component: CommonButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'filled', 'outlined'],
      description: '버튼 타입',
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    color: {
      control: 'select',
      options: ['brand', 'primary', 'secondary', 'neutral'],
      description: '버튼 색상',
    },
    state: {
      control: 'select',
      options: ['enabled', 'hovered', 'pressed', 'disabled'],
      description: '버튼 상태',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
  },
  args: {
    onClick: fn(),
    children: '레이블',
  },
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { variant: 'filled', color: 'brand', size: 'md' },
};

export const AllVariants: Story = {
  render: () => {
    const variants = ['text', 'filled', 'outlined'] as const;
    const colors = ['brand', 'primary', 'secondary', 'neutral'] as const;
    const sizes = ['xxs', 'xs', 'sm', 'md', 'lg'] as const;
    const states = ['enabled', 'hovered', 'pressed', 'disabled'] as const;
    const labelStyle: React.CSSProperties = {
      fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', minWidth: 56,
    };
    const headerStyle: React.CSSProperties = {
      fontSize: 11, color: '#64748b', fontFamily: 'monospace', fontWeight: 600, textAlign: 'center',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ marginBottom: 20, fontSize: 15, fontWeight: 700, textTransform: 'capitalize' }}>
              {variant}
            </h3>
            <table style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th />
                  <th />
                  {sizes.map((s) => (
                    <th key={s} style={{ ...headerStyle, padding: '0 8px 8px' }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colors.map((color) =>
                  states.map((state, stateIndex) => (
                    <tr key={`${variant}-${color}-${state}`}>
                      {stateIndex === 0 ? (
                        <td
                          rowSpan={states.length}
                          style={{ ...labelStyle, paddingRight: 12, verticalAlign: 'top', paddingTop: 6 }}
                        >
                          {color}
                        </td>
                      ) : null}
                      <td style={{ ...labelStyle, paddingRight: 10, paddingTop: 6 }}>{state}</td>
                      {sizes.map((size) => (
                        <td key={size} style={{ padding: '4px 8px' }}>
                          <CommonButton
                            variant={variant}
                            color={color}
                            size={size}
                            state={state}
                          >
                            레이블
                          </CommonButton>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  },
};
