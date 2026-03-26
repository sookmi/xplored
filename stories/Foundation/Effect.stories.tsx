import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

interface ShadowDef {
  name: string;
  token: string;
  description: string;
  layers: { color: string; x: number; y: number; blur: number; spread: number }[];
}

const shadows: ShadowDef[] = [
  {
    name: 'Card Hovered',
    token: 'Shadow.Card-Hovered',
    description: '카드 호버 시 적용되는 그림자',
    layers: [
      { color: '#0000001a', x: 0, y: 10, blur: 15, spread: -3 },
      { color: '#0000001a', x: 0, y: 4, blur: 6, spread: -4 },
    ],
  },
];

function shadowToCSS(layers: ShadowDef['layers']): string {
  return layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(', ');
}

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' } as React.CSSProperties,
  h1: { fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.03em' } as React.CSSProperties,
  desc: { fontSize: 16, color: '#64748b', marginBottom: 40 } as React.CSSProperties,
  sectionTitle: { fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.02em' } as React.CSSProperties,
  sectionDesc: { fontSize: 14, color: '#64748b', marginBottom: 24 } as React.CSSProperties,
};

function ShadowCard({ shadow }: { shadow: ShadowDef }) {
  const cssValue = shadowToCSS(shadow.layers);

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{shadow.name}</div>
          <div
            style={{
              width: 200,
              height: 140,
              borderRadius: 12,
              backgroundColor: '#ffffff',
              boxShadow: cssValue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Preview</span>
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>Token</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace', marginTop: 2 }}>
              {shadow.token}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>Description</span>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{shadow.description}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>CSS Value</span>
            <div style={{
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#475569',
              marginTop: 4,
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              wordBreak: 'break-all',
            }}>
              box-shadow: {cssValue};
            </div>
          </div>

          {/* Layers */}
          <div>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              Layers ({shadow.layers.length})
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {shadow.layers.map((layer, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '8px 12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      backgroundColor: layer.color,
                      border: '1px solid #e2e8f0',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: '#64748b' }}>color <strong style={{ color: '#0f172a' }}>{layer.color}</strong></span>
                  <span style={{ color: '#64748b' }}>x <strong style={{ color: '#0f172a' }}>{layer.x}</strong></span>
                  <span style={{ color: '#64748b' }}>y <strong style={{ color: '#0f172a' }}>{layer.y}</strong></span>
                  <span style={{ color: '#64748b' }}>blur <strong style={{ color: '#0f172a' }}>{layer.blur}</strong></span>
                  <span style={{ color: '#64748b' }}>spread <strong style={{ color: '#0f172a' }}>{layer.spread}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShadowCompare() {
  const levels = [
    { name: 'None', value: 'none' },
    { name: 'Card Hovered', value: shadowToCSS(shadows[0].layers) },
  ];

  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      {levels.map((level) => (
        <div key={level.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 160,
              height: 100,
              borderRadius: 12,
              backgroundColor: '#ffffff',
              boxShadow: level.value,
              border: level.value === 'none' ? '1px solid #e2e8f0' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{level.name}</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>{level.name}</span>
        </div>
      ))}
    </div>
  );
}

function EffectPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Effect</h1>
      <p style={s.desc}>
        디자인 시스템의 이펙트 스타일입니다. Box Shadow 등 시각적 효과 토큰을 정의합니다.
      </p>

      {/* Box Shadow */}
      <h2 style={s.sectionTitle}>Box Shadow</h2>
      <p style={s.sectionDesc}>컴포넌트에 적용되는 그림자 효과입니다. 다중 레이어로 자연스러운 깊이감을 표현합니다.</p>

      {shadows.map((shadow) => (
        <ShadowCard key={shadow.name} shadow={shadow} />
      ))}

      {/* Comparison */}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Elevation Comparison</h3>
      <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <ShadowCompare />
      </div>

    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Effect',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <EffectPage />,
};
