import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

const radii = [2, 4, 6, 8, 12, 16, 24, 32, 48, 999];
const strokes = [1, 2];

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' } as React.CSSProperties,
  h1: { fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.03em' } as React.CSSProperties,
  desc: { fontSize: 16, color: '#64748b', marginBottom: 40 } as React.CSSProperties,
  sectionTitle: { fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.02em' } as React.CSSProperties,
  sectionDesc: { fontSize: 14, color: '#64748b', marginBottom: 24 } as React.CSSProperties,
};

function RadiusSwatch({ value }: { value: number }) {
  const label = value === 999 ? 'Full' : `${value}`;
  const displayRadius = value === 999 ? '50%' : `${value}px`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: displayRadius,
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: '#ffffff', fontFamily: 'monospace' }}>
          {displayRadius}
        </span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
          radius.{label.toLowerCase()}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{value}px</div>
      </div>
    </div>
  );
}

function RadiusCompare({ value }: { value: number }) {
  const displayRadius = value === 999 ? '50%' : `${value}px`;
  const label = value === 999 ? 'Full' : `${value}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4, padding: '10px 0' }}>
      <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 80, textAlign: 'right', flexShrink: 0 }}>
        radius.{label.toLowerCase()}
      </span>
      <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', width: 50, textAlign: 'right', flexShrink: 0 }}>
        {value === 999 ? '999' : value}px
      </span>
      <div
        style={{
          width: 200,
          height: 48,
          borderRadius: displayRadius,
          backgroundColor: '#ecfdf5',
          border: '2px solid #10b981',
        }}
      />
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: displayRadius,
          backgroundColor: '#ecfdf5',
          border: '2px solid #10b981',
        }}
      />
    </div>
  );
}

function StrokeSwatch({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 120,
          height: 80,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          border: `${value}px solid #0f172a`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
          {value}px
        </span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
          stroke.{value}
        </div>
      </div>
    </div>
  );
}

function RadiusPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Radius</h1>
      <p style={s.desc}>
        디자인 시스템의 모서리 둥글기(Radius)와 선 굵기(Stroke) 토큰입니다.
      </p>

      {/* Radius Swatches */}
      <h2 style={s.sectionTitle}>Border Radius</h2>
      <p style={s.sectionDesc}>2px부터 Full(999px)까지 10단계의 Radius 토큰을 제공합니다.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
        {radii.map((v) => (
          <RadiusSwatch key={v} value={v} />
        ))}
      </div>

      {/* Radius Comparison */}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Shape Comparison</h3>
      <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        {radii.map((v) => (
          <RadiusCompare key={v} value={v} />
        ))}
      </div>

      {/* Stroke */}
      <h2 style={s.sectionTitle}>Stroke</h2>
      <p style={s.sectionDesc}>선 굵기(Border Width) 토큰입니다.</p>
      <div style={{ display: 'flex', gap: 32 }}>
        {strokes.map((v) => (
          <StrokeSwatch key={v} value={v} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Radius',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <RadiusPage />,
};
