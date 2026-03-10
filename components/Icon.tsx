import React from 'react';
import { iconRegistry, type IconName, type IconSize } from '../lib/icons';

export type IconColor =
  | 'icon-default-primary'
  | 'icon-default-secondary'
  | 'icon-default-tertiary'
  | 'icon-brand-primary'
  | 'icon-brand-secondary'
  | 'icon-error-primary'
  | 'icon-error-secondary'
  | 'icon-success-primary'
  | 'icon-warning-primary'
  | 'icon-info-primary'
  | 'icon-disabled-primary'
  | 'icon-utility-white';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  className?: string;
}

const STROKE_HALF = 1;

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'icon-default-primary',
  className,
}) => {
  const data = iconRegistry[name];
  if (!data) return null;

  const [iT, iR, iB, iL] = data.inset;

  const safeT = Math.max(iT, STROKE_HALF);
  const safeR = Math.max(iR, STROKE_HALF);
  const safeB = Math.max(iB, STROKE_HALF);
  const safeL = Math.max(iL, STROKE_HALF);

  const vbW = safeL + data.vw + safeR;
  const vbH = safeT + data.vh + safeB;

  const span = Math.max(vbW, vbH);
  const vbX = -safeL - (span - vbW) / 2;
  const vbY = -safeT - (span - vbH) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${vbX} ${vbY} ${span} ${span}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d={data.d}
        stroke={`var(--${color})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
