import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

const headerModes = [
  {
    name: 'Mobile',
    range: '320 - 639px',
    figmaWidth: '390px',
    frameWidth: 'max 639px',
    contentWidth: 'fluid',
    padding: '16px',
    behavior: 'Logo + menu icon',
    note: '피그마 선택본에서 모바일 헤더는 최대 639px 범위 안에서 64px 높이와 16px 좌우 여백을 사용합니다.',
    color: '#e0f2fe',
    borderColor: '#7dd3fc',
    textColor: '#0c4a6e',
  },
  {
    name: 'Tablet',
    range: '640 - 1279px',
    figmaWidth: '768px',
    frameWidth: 'max 1279px',
    contentWidth: 'fluid',
    padding: '24px',
    behavior: 'Logo + nav + theme toggle',
    note: '태블릿 헤더는 메뉴가 노출되기 시작하고, 테마 토글도 함께 등장합니다.',
    color: '#ecfccb',
    borderColor: '#bef264',
    textColor: '#3f6212',
  },
  {
    name: 'Desktop',
    range: '1280px+',
    figmaWidth: '1460px frame',
    frameWidth: '1460px',
    contentWidth: '1280px inner',
    padding: '32px inner gutter',
    behavior: 'Full nav + theme toggle',
    note: '데스크톱은 바깥 프레임 1460px 안에 최대 1280px 컨테이너를 두는 구조입니다.',
    color: '#fef3c7',
    borderColor: '#fcd34d',
    textColor: '#78350f',
  },
] as const;

const tailwindBreakpoints = [
  {
    token: 'sm',
    minWidth: 360,
    headerEffect: 'Mobile review width',
    designLink: 'Mobile review width',
  },
  {
    token: 'md',
    minWidth: 768,
    headerEffect: '같은 Tablet 모드 안의 대표 검토 폭',
    designLink: 'Tablet review width',
  },
  {
    token: 'lg',
    minWidth: 1280,
    headerEffect: '데스크톱 내부 1280px 컨테이너 기준점',
    designLink: 'Desktop review width',
  },
] as const;

const s = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px 56px',
    fontFamily: 'Pretendard Variable, system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  h1: {
    fontSize: 36,
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: '-0.03em',
  } as React.CSSProperties,
  desc: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
    lineHeight: 1.7,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginTop: 48,
    marginBottom: 8,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  sectionDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 1.7,
  } as React.CSSProperties,
  chipLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
    marginBottom: 4,
  } as React.CSSProperties,
  chipValue: {
    fontSize: 13,
    color: '#0f172a',
    fontFamily: 'monospace',
    fontWeight: 700,
  } as React.CSSProperties,
};

function WidthRail({
  mode,
}: {
  mode: (typeof headerModes)[number];
}) {
  const railMax = 1460;
  const widthMap: Record<(typeof headerModes)[number]['name'], number> = {
    Mobile: 639,
    Tablet: 1279,
    Desktop: 1460,
  };

  return (
    <div
      style={{
        position: 'relative',
        height: 36,
        borderRadius: 999,
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${(widthMap[mode.name] / railMax) * 100}%`,
          minWidth: 96,
          height: '100%',
          borderRadius: 999,
          backgroundColor: mode.color,
          border: `1px solid ${mode.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: mode.textColor,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'monospace',
        }}
      >
        {mode.range}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div style={s.chipLabel}>{label}</div>
      <div style={s.chipValue}>{value}</div>
    </div>
  );
}

function HeaderModeCard(mode: (typeof headerModes)[number]) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 18,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{mode.name}</h3>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>{mode.behavior}</span>
      </div>

      <p style={{ margin: '0 0 16px', color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
        {mode.note}
      </p>

      <WidthRail mode={mode} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          marginTop: 20,
        }}
      >
        <Metric label="range" value={mode.range} />
        <Metric label="figma width" value={mode.figmaWidth} />
        <Metric label="frame" value={mode.frameWidth} />
        <Metric label="padding" value={mode.padding} />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={s.chipLabel}>content</div>
        <div style={s.chipValue}>{mode.contentWidth}</div>
      </div>
    </div>
  );
}

function BreakpointRow({
  token,
  minWidth,
  headerEffect,
  designLink,
}: (typeof tailwindBreakpoints)[number]) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 96px 1.2fr 1fr',
        gap: 16,
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{token}</div>
      <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#475569' }}>{minWidth}px+</div>
      <div style={{ fontSize: 14, color: '#475569' }}>{headerEffect}</div>
      <div style={{ fontSize: 13, color: '#64748b' }}>{designLink}</div>
    </div>
  );
}

function BreakpointPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Breakpoint</h1>
      <p style={s.desc}>
        피그마에서 선택한 헤더 컴포넌트를 기준으로, 현재 프로젝트의 디바이스 범위와 구현 브레이크포인트를 함께 정리한 기준 문서입니다.
      </p>

      <h2 style={s.sectionTitle}>Header Modes</h2>
      <p style={s.sectionDesc}>
        이번 선택본은 모바일, 태블릿, 데스크톱 헤더를 한 세트로 정의하고 있습니다. 이 섹션은 피그마 기준의 모드 범위와 각 모드에서 보여야 하는 헤더 구성을 설명합니다.
      </p>

      <div style={{ display: 'grid', gap: 16 }}>
        {headerModes.map((mode) => (
          <HeaderModeCard key={mode.name} {...mode} />
        ))}
      </div>

      <h2 style={s.sectionTitle}>Implementation Breakpoints</h2>
      <p style={s.sectionDesc}>
        구현 기준은 현재 헤더 리뷰에 실제로 쓰는 대표 폭만 남겨 정리했습니다. 이 표는 헤더 모드를 다시 정의하는 용도가 아니라, 디자인 검토와 구현 확인 시 우선 참고할 핵심 폭을 보여줍니다.
      </p>

      <div
        style={{
          padding: '8px 24px',
          borderRadius: 18,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        }}
      >
        {tailwindBreakpoints.map((breakpoint) => (
          <BreakpointRow key={breakpoint.token} {...breakpoint} />
        ))}
      </div>

      <h2 style={s.sectionTitle}>Practical Rules</h2>
      <p style={s.sectionDesc}>
        `Header Modes`는 피그마가 정의한 범위이고, `Implementation Breakpoints`는 그중 실제 리뷰와 구현에서 자주 확인하는 대표 폭입니다. 모바일 검토는 `360px+`, 태블릿 검토는 `768px+`, 데스크톱 검토는 `1280px+`와 내부 1280px 컨테이너를 기준으로 맞춥니다.
      </p>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Breakpoint',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <BreakpointPage />,
};
