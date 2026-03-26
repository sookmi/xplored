import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

const primitiveScales = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose',
] as const;

const neutralScales = ['slate', 'gray', 'zinc', 'neutral', 'stone'] as const;

const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

const alphaSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'] as const;
const alphaGroups = ['black', 'white', 'brand'] as const;

const semanticCategories = ['bg', 'text', 'icon', 'border'] as const;

const semanticTokens: Record<string, Record<string, string[]>> = {
  bg: {
    default: ['primary', 'secondary', 'tertiary', 'quartiary', 'primary-hover', 'secondary-hover', 'tertiary-hover', 'quartiary-hover', 'black-solid', 'black-solid-hover'],
    disabled: ['primary', 'secondary'],
    brand: ['primary', 'primary-hover', 'solid', 'solid-hover'],
    error: ['primary', 'primary-hover', 'secondary', 'secondary-hover'],
    success: ['primary', 'primary-hover', 'secondary', 'secondary-hover'],
    warning: ['primary', 'primary-hover', 'secondary', 'secondary-hover'],
    info: ['primary', 'primary-hover', 'secondary', 'secondary-hover'],
    offer: ['primary', 'primary-hover', 'secondary', 'secondary-hover'],
    utility: ['overlay-alpha-primary', 'overlay-alpha-secondary', 'overlay-alpha-white-primary', 'overlay-alpha-white-secondary'],
  },
  text: {
    default: ['primary', 'secondary', 'tertiary', 'primary-hover', 'secondary-hover', 'tertiary-hover'],
    disabled: ['primary', 'secondary'],
    utility: ['placeholder', 'white', 'on-dark-color'],
    brand: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    error: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    success: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    warning: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    info: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    offer: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
  },
  icon: {
    default: ['primary', 'secondary', 'tertiary', 'primary-hover', 'secondary-hover', 'tertiary-hover'],
    disabled: ['primary', 'secondary'],
    utility: ['placeholder', 'white', 'on-dark-color'],
    brand: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    error: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    success: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    warning: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    info: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
    offer: ['primary', 'secondary', 'primary-hover', 'secondary-hover'],
  },
  border: {
    default: ['primary', 'secondary', 'tertiary', 'primary-solid'],
    disabled: ['primary', 'secondary'],
    brand: ['primary', 'secondary'],
    error: ['primary', 'secondary'],
    success: ['primary', 'secondary'],
    warning: ['primary', 'secondary'],
    info: ['primary', 'secondary'],
    offer: ['primary', 'secondary'],
  },
};

function getCssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '').slice(0, 6);
  if (c.length < 6) return true;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

const sectionTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginTop: 48,
  marginBottom: 8,
  color: '#0f172a',
  letterSpacing: '-0.02em',
};

const sectionDesc: React.CSSProperties = {
  fontSize: 14,
  color: '#64748b',
  marginBottom: 24,
};

const scaleName: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#334155',
  textTransform: 'capitalize',
  width: 80,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
};

function Swatch({ cssVar, label }: { cssVar: string; label: string }) {
  const [hex, setHex] = React.useState('');
  React.useEffect(() => {
    setHex(getCssVar(cssVar));
  }, [cssVar]);

  const light = isLightColor(hex);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '1 1 0' }}>
      <div
        style={{
          width: '100%',
          height: 48,
          borderRadius: 6,
          backgroundColor: `var(${cssVar})`,
          border: light ? '1px solid #e2e8f0' : '1px solid transparent',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 4,
        }}
      >
        <span style={{ fontSize: 9, color: light ? '#64748b' : '#ffffffcc', fontFamily: 'monospace' }}>
          {hex}
        </span>
      </div>
      <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>{label}</span>
    </div>
  );
}

function PrimitiveRow({ name, scaleSteps }: { name: string; scaleSteps: readonly string[] }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={scaleName}>{name}</div>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {scaleSteps.map((step) => (
          <Swatch key={step} cssVar={`--${name}-${step}`} label={step} />
        ))}
      </div>
    </div>
  );
}

function AlphaRow({ group }: { group: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={scaleName}>alpha-{group}</div>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {alphaSteps.map((step) => (
          <Swatch key={step} cssVar={`--alpha-${group}-${step}`} label={step} />
        ))}
      </div>
    </div>
  );
}

function SemanticGroup({ category, group, tokens }: { category: string; group: string; tokens: string[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', textTransform: 'capitalize', marginBottom: 8 }}>
        {group}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tokens.map((token) => {
          const cssVar = `--${category}-${group}-${token}`;
          return (
            <div key={token} style={{ width: 120 }}>
              <SemanticSwatch cssVar={cssVar} label={token} category={category} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SemanticSwatch({ cssVar, label, category }: { cssVar: string; label: string; category: string }) {
  const [hex, setHex] = React.useState('');
  React.useEffect(() => {
    setHex(getCssVar(cssVar));
  }, [cssVar]);

  const isBorder = category === 'border';
  const isText = category === 'text' || category === 'icon';
  const light = isLightColor(hex);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          width: '100%',
          height: 56,
          borderRadius: 8,
          backgroundColor: isBorder || isText ? '#ffffff' : `var(${cssVar})`,
          border: isBorder
            ? `3px solid var(${cssVar})`
            : light
              ? '1px solid #e2e8f0'
              : '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isText && (
          <span style={{ fontSize: 16, fontWeight: 700, color: `var(${cssVar})` }}>Aa</span>
        )}
      </div>
      <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all' }}>
        {label}
      </span>
      <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>{hex}</span>
    </div>
  );
}

function ColorPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.03em' }}>
        Color
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40 }}>
        디자인 시스템의 컬러 토큰입니다. Primitive 컬러는 원시 색상 팔레트이고, Semantic 컬러는 용도에 따라 맵핑된 토큰입니다.
      </p>

      {/* Primitive Colors */}
      <h2 style={sectionTitle}>Primitive Colors</h2>
      <p style={sectionDesc}>Tailwind 기반 원시 컬러 팔레트 (50–950)</p>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Chromatic</h3>
      {primitiveScales.map((name) => (
        <PrimitiveRow key={name} name={name} scaleSteps={steps} />
      ))}

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Neutral</h3>
      {neutralScales.map((name) => (
        <PrimitiveRow key={name} name={name} scaleSteps={steps} />
      ))}

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Brand</h3>
      <PrimitiveRow name="brand" scaleSteps={steps} />

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Black & White</h3>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={scaleName}>bw</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Swatch cssVar="--bw-white" label="white" />
          <Swatch cssVar="--bw-black" label="black" />
          <Swatch cssVar="--bw-transparent" label="transparent" />
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 16, marginTop: 32 }}>Alpha</h3>
      {alphaGroups.map((group) => (
        <AlphaRow key={group} group={group} />
      ))}

      {/* Semantic Colors */}
      <h2 style={sectionTitle}>Semantic Colors</h2>
      <p style={sectionDesc}>
        용도별 시맨틱 컬러 토큰. Background, Text, Icon, Border 카테고리로 구분됩니다.
      </p>

      {semanticCategories.map((category) => (
        <div key={category} style={{ marginTop: 40 }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 24,
            paddingBottom: 8,
            borderBottom: '2px solid #e2e8f0',
          }}>
            {category}
          </h3>
          {Object.entries(semanticTokens[category]).map(([group, tokens]) => (
            <SemanticGroup key={group} category={category} group={group} tokens={tokens} />
          ))}
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Color',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <ColorPage />,
};
