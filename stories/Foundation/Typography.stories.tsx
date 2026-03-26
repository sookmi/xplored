import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

const fontFamily = 'Pretendard Variable, system-ui, -apple-system, sans-serif';

const fontWeights = {
  Regular: 400,
  Medium: 500,
  Semibold: 600,
} as const;

const fontScales = [9, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64, 72] as const;

interface TypeStyle {
  name: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  weights: (keyof typeof fontWeights)[];
  lineHeightParagraph?: number;
}

const typeStyles: Record<string, TypeStyle[]> = {
  Title: [
    { name: 'Title1', fontSize: 72, lineHeight: 88, letterSpacing: -0.8, weights: ['Semibold'] },
    { name: 'Title2', fontSize: 64, lineHeight: 76, letterSpacing: -0.8, weights: ['Semibold'] },
    { name: 'Title3', fontSize: 56, lineHeight: 68, letterSpacing: -0.6, weights: ['Semibold'] },
  ],
  Heading: [
    { name: 'H1', fontSize: 56, lineHeight: 68, letterSpacing: -0.5, weights: ['Semibold'] },
    { name: 'H2', fontSize: 48, lineHeight: 58, letterSpacing: -0.4, weights: ['Semibold'] },
    { name: 'H3', fontSize: 40, lineHeight: 48, letterSpacing: -0.3, weights: ['Semibold'] },
    { name: 'H4', fontSize: 32, lineHeight: 38, letterSpacing: -0.2, weights: ['Semibold'] },
    { name: 'H5', fontSize: 24, lineHeight: 30, letterSpacing: -0.15, weights: ['Semibold'] },
    { name: 'H6', fontSize: 20, lineHeight: 24, letterSpacing: 0, weights: ['Semibold'] },
  ],
  Body: [
    { name: 'Body1', fontSize: 18, lineHeight: 28, letterSpacing: 0, weights: ['Regular', 'Semibold'] },
    { name: 'Body2', fontSize: 16, lineHeight: 24, letterSpacing: 0, weights: ['Regular', 'Semibold'], lineHeightParagraph: 28 },
    { name: 'Body3', fontSize: 14, lineHeight: 20, letterSpacing: 0, weights: ['Regular', 'Semibold'], lineHeightParagraph: 25 },
    { name: 'Body4', fontSize: 12, lineHeight: 16, letterSpacing: 0, weights: ['Regular', 'Semibold'], lineHeightParagraph: 22 },
  ],
  Label: [
    { name: 'Label1', fontSize: 16, lineHeight: 22, letterSpacing: -0.18, weights: ['Regular', 'Semibold'] },
    { name: 'Label2', fontSize: 14, lineHeight: 20, letterSpacing: -0.16, weights: ['Regular', 'Semibold'] },
    { name: 'Label3', fontSize: 12, lineHeight: 16, letterSpacing: -0.12, weights: ['Regular', 'Medium', 'Semibold'] },
  ],
  Caption: [
    { name: 'Caption1', fontSize: 10, lineHeight: 12, letterSpacing: 0, weights: ['Regular', 'Medium', 'Semibold'] },
    { name: 'Caption2', fontSize: 9, lineHeight: 12, letterSpacing: 0, weights: ['Regular', 'Medium', 'Semibold'] },
  ],
};

const sampleText = '다람쥐 헌 쳇바퀴에 타고파 The quick brown fox';

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily } as React.CSSProperties,
  h1: { fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.03em' } as React.CSSProperties,
  desc: { fontSize: 16, color: '#64748b', marginBottom: 40 } as React.CSSProperties,
  sectionTitle: { fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.02em' } as React.CSSProperties,
  sectionDesc: { fontSize: 14, color: '#64748b', marginBottom: 24 } as React.CSSProperties,
  subTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 40, marginBottom: 24, paddingBottom: 8, borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase' as const, letterSpacing: '0.05em' } as React.CSSProperties,
  metaLabel: { fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', lineHeight: 1.4 } as React.CSSProperties,
  metaValue: { fontSize: 11, color: '#475569', fontFamily: 'monospace', fontWeight: 600 } as React.CSSProperties,
  tag: { display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, fontFamily: 'monospace', marginRight: 4 } as React.CSSProperties,
};

function MetaChip({ label, value }: { label: string; value: string | number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 16 }}>
      <span style={s.metaLabel}>{label}</span>
      <span style={s.metaValue}>{value}</span>
    </span>
  );
}

function WeightTag({ weight }: { weight: string }) {
  const bg: Record<string, string> = {
    Regular: '#f1f5f9',
    Medium: '#e0f2fe',
    Semibold: '#ecfdf5',
  };
  const fg: Record<string, string> = {
    Regular: '#475569',
    Medium: '#0369a1',
    Semibold: '#059669',
  };
  return (
    <span style={{ ...s.tag, backgroundColor: bg[weight] ?? '#f1f5f9', color: fg[weight] ?? '#475569' }}>
      {weight} ({fontWeights[weight as keyof typeof fontWeights]})
    </span>
  );
}

function TypeStyleRow({ style: ts }: { style: TypeStyle }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', minWidth: 80 }}>{ts.name}</span>
        <MetaChip label="size" value={`${ts.fontSize}px`} />
        <MetaChip label="line-height" value={`${ts.lineHeight}px`} />
        <MetaChip label="letter-spacing" value={`${ts.letterSpacing}px`} />
        {ts.lineHeightParagraph && <MetaChip label="paragraph" value={`${ts.lineHeightParagraph}px`} />}
      </div>
      <div style={{ marginBottom: 8 }}>
        {ts.weights.map((w) => (
          <WeightTag key={w} weight={w} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {ts.weights.map((w) => (
          <div
            key={w}
            style={{
              fontFamily,
              fontSize: ts.fontSize,
              lineHeight: `${ts.lineHeight}px`,
              letterSpacing: ts.letterSpacing,
              fontWeight: fontWeights[w],
              color: '#0f172a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sampleText}
          </div>
        ))}
      </div>
    </div>
  );
}

function FontScaleRow({ size }: { size: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', width: 50, textAlign: 'right' }}>{size}px</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            height: Math.max(size * 1.2, 16),
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: size,
              fontWeight: 400,
              color: '#0f172a',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            가나다라 Aa Bb 123
          </span>
        </div>
      </div>
      <div
        style={{
          width: 60,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(size / 72) * 100}%`,
            height: '100%',
            borderRadius: 3,
            backgroundColor: '#10b981',
          }}
        />
      </div>
    </div>
  );
}

function TypographyPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Typography</h1>
      <p style={s.desc}>
        디자인 시스템의 타이포그래피 토큰입니다. Pretendard Variable 폰트 기반으로, Title부터 Caption까지 계층적 타입 스케일을 정의합니다.
      </p>

      {/* Font Family */}
      <h2 style={s.sectionTitle}>Font Family</h2>
      <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 8 }}>fontFamily.familySans</div>
        <div style={{ fontFamily, fontSize: 32, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>
          Pretendard Variable
        </div>
        <div style={{ fontFamily, fontSize: 16, color: '#475569', lineHeight: 1.6 }}>
          가나다라마바사아자차카타파하 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&*()
        </div>
      </div>

      {/* Font Weight */}
      <h2 style={s.sectionTitle}>Font Weight</h2>
      <p style={s.sectionDesc}>3단계의 Font Weight를 사용합니다.</p>
      <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
        {Object.entries(fontWeights).map(([name, value]) => (
          <div key={name} style={{ flex: 1, padding: '24px 32px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 8 }}>
              fontWeight.weight{name} = {value}
            </div>
            <div style={{ fontFamily, fontSize: 28, fontWeight: value, color: '#0f172a' }}>
              {name}
            </div>
            <div style={{ fontFamily, fontSize: 16, fontWeight: value, color: '#475569', marginTop: 8 }}>
              다람쥐 헌 쳇바퀴에 타고파
            </div>
          </div>
        ))}
      </div>

      {/* Font Scale */}
      <h2 style={s.sectionTitle}>Font Scale</h2>
      <p style={s.sectionDesc}>9px부터 72px까지 14단계의 Font Scale을 사용합니다.</p>
      <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        {fontScales.map((size) => (
          <FontScaleRow key={size} size={size} />
        ))}
      </div>

      {/* Type Styles */}
      <h2 style={s.sectionTitle}>Type Styles</h2>
      <p style={s.sectionDesc}>
        카테고리별 타입 스타일. Font Size, Line Height, Letter Spacing, Font Weight가 조합된 시맨틱 타이포그래피 토큰입니다.
      </p>

      {Object.entries(typeStyles).map(([category, styles]) => (
        <div key={category}>
          <h3 style={s.subTitle}>{category}</h3>
          {styles.map((ts) => (
            <TypeStyleRow key={ts.name} style={ts} />
          ))}
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Typography',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <TypographyPage />,
};
