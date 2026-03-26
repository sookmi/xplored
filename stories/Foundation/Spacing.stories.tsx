import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

const positiveSpaces = [1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 120, 160];
const negativeSpaces = [-1, -2, -4, -8];

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' } as React.CSSProperties,
  h1: { fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.03em' } as React.CSSProperties,
  desc: { fontSize: 16, color: '#64748b', marginBottom: 40 } as React.CSSProperties,
  sectionTitle: { fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.02em' } as React.CSSProperties,
  sectionDesc: { fontSize: 14, color: '#64748b', marginBottom: 24 } as React.CSSProperties,
};

function SpaceRow({ value }: { value: number }) {
  const absVal = Math.abs(value);
  const barWidth = Math.min(absVal, 320);
  const isNeg = value < 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 2, padding: '8px 0' }}>
      <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 60, textAlign: 'right', flexShrink: 0 }}>
        space.{value}
      </span>
      <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', width: 50, textAlign: 'right', flexShrink: 0 }}>
        {value}px
      </span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: barWidth,
            height: 24,
            borderRadius: 4,
            backgroundColor: isNeg ? '#fecaca' : '#a7f3d0',
            border: `1px solid ${isNeg ? '#f87171' : '#34d399'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.3s ease',
          }}
        >
          {absVal >= 16 && (
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: isNeg ? '#991b1b' : '#065f46' }}>
              {absVal}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SpaceGrid({ values }: { values: number[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
      {values.map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: v,
                height: v,
                backgroundColor: '#10b981',
                borderRadius: 2,
                maxWidth: 72,
                maxHeight: 72,
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>{v}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>{v}px</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacingPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Spacing</h1>
      <p style={s.desc}>
        디자인 시스템의 간격(Spacing) 토큰입니다. 일관된 여백과 패딩을 위해 사용합니다.
      </p>

      <h2 style={s.sectionTitle}>Space Scale</h2>
      <p style={s.sectionDesc}>1px부터 160px까지 22단계의 양수 스페이싱과 4단계의 음수 스페이싱을 제공합니다.</p>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Positive</h3>
      <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        {positiveSpaces.map((v) => (
          <SpaceRow key={v} value={v} />
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Negative</h3>
      <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        {negativeSpaces.map((v) => (
          <SpaceRow key={v} value={v} />
        ))}
      </div>

      <h2 style={s.sectionTitle}>Visual Reference</h2>
      <p style={s.sectionDesc}>각 토큰의 실제 크기를 시각적으로 비교합니다. (초록 영역이 해당 px 크기)</p>
      <SpaceGrid values={positiveSpaces.filter((v) => v <= 80)} />
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Spacing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <SpacingPage />,
};
