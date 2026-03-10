'use client';

import React from 'react';

export type ButtonType = 'text' | 'filled' | 'outlined';
export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
export type ButtonColor = 'brand' | 'primary' | 'secondary';

export interface CommonButtonProps {
  variant?: ButtonType;
  size?: ButtonSize;
  color?: ButtonColor;
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const sizeMap: Record<ButtonSize, React.CSSProperties> = {
  xxs: { minWidth: 48, paddingInline: 4, paddingBlock: 2, borderRadius: 6 },
  xs:  { minWidth: 56, paddingInline: 8, paddingBlock: 4, borderRadius: 6 },
  sm:  { minWidth: 56, paddingInline: 8, paddingBlock: 6, borderRadius: 6 },
  md:  { minWidth: 56, paddingInline: 12, paddingBlock: 8, borderRadius: 8 },
  lg:  { minWidth: 56, paddingInline: 16, paddingBlock: 10, borderRadius: 8 },
};

function getFontWeight(size: ButtonSize, active: boolean): number {
  if (active) return 600;
  return ['md', 'lg'].includes(size) ? 600 : 400;
}

type ColorStyles = {
  bg?: string;
  bgHover?: string;
  text: string;
  border?: string;
  backgroundImage?: string;
};

const variantColorMap: Record<ButtonType, Record<ButtonColor, ColorStyles>> = {
  text: {
    brand:     { text: 'var(--text-brand-primary)',     bgHover: 'var(--bg-brand-primary)' },
    primary:   { text: 'var(--text-default-primary)',   bgHover: 'var(--bg-default-secondary)' },
    secondary: { text: 'var(--text-default-secondary)', bgHover: 'var(--bg-default-secondary)' },
  },
  filled: {
    brand:     { bg: 'var(--bg-brand-solid)',      bgHover: 'var(--bg-brand-solid-hover)',      text: 'var(--text-utility-on-dark-color)' },
    primary:   { bg: 'var(--bg-brand-primary)',     bgHover: 'var(--bg-brand-primary-hover)',     text: 'var(--text-brand-primary)' },
    secondary: { bg: 'var(--bg-default-tertiary)',  bgHover: 'var(--bg-default-tertiary-hover)',  text: 'var(--text-default-primary)' },
  },
  outlined: {
    brand:     { border: 'var(--border-brand-primary)',   text: 'var(--text-brand-primary)',     bgHover: 'var(--bg-brand-primary)' },
    primary:   { border: 'var(--border-default-primary)', text: 'var(--text-default-primary)',   bgHover: 'var(--bg-default-secondary)' },
    secondary: { border: 'var(--border-default-primary)', text: 'var(--text-default-secondary)', bgHover: 'var(--bg-default-secondary)' },
  },
};

const activeStyleMap: Record<ButtonType, Record<ButtonColor, ColorStyles>> = {
  text: {
    brand:     { bg: 'var(--bg-brand-primary)', text: 'var(--text-brand-primary)' },
    primary:   { bg: 'var(--bg-brand-primary)', text: 'var(--text-brand-primary)' },
    secondary: { bg: 'var(--bg-brand-primary)', text: 'var(--text-brand-primary)' },
  },
  filled: {
    brand: {
      backgroundImage: 'linear-gradient(rgba(26,26,26,0.2), rgba(26,26,26,0.2)), linear-gradient(var(--bg-brand-solid), var(--bg-brand-solid))',
      text: 'var(--text-utility-on-dark-color)',
    },
    primary:   { bg: 'var(--bg-brand-primary-hover)', text: 'var(--text-brand-primary)' },
    secondary: { bg: 'var(--bg-brand-primary)',        text: 'var(--text-brand-primary)' },
  },
  outlined: {
    brand:     { bg: 'var(--bg-brand-primary)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
    primary:   { bg: 'var(--bg-brand-primary)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
    secondary: { bg: 'var(--bg-brand-primary)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
  },
};

const disabledMap: Record<ButtonType, ColorStyles> = {
  filled:   { bg: 'var(--bg-disabled-secondary)',   text: 'var(--text-disabled-primary)' },
  outlined: { border: 'var(--border-disabled-secondary)', text: 'var(--text-disabled-secondary)' },
  text:     { text: 'var(--text-disabled-secondary)' },
};

export const CommonButton: React.FC<CommonButtonProps> = ({
  variant = 'filled',
  size = 'md',
  color = 'brand',
  active = false,
  disabled = false,
  children = '레이블',
  onClick,
  className,
}) => {
  const sizeStyle = sizeMap[size];
  const colorStyle = disabled
    ? disabledMap[variant]
    : active
      ? activeStyleMap[variant][color]
      : variantColorMap[variant][color];

  const fontWeight = getFontWeight(size, active);

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    overflow: 'clip',
    fontSize: 14,
    lineHeight: '20px',
    fontWeight,
    transition: 'background-color 150ms, color 150ms',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...sizeStyle,
    backgroundColor: colorStyle.bg ?? 'transparent',
    backgroundImage: colorStyle.backgroundImage,
    color: colorStyle.text,
    border: colorStyle.border ? `1px solid ${colorStyle.border}` : 'none',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !active && colorStyle.bgHover) {
      e.currentTarget.style.backgroundColor = colorStyle.bgHover;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !active) {
      e.currentTarget.style.backgroundColor = colorStyle.bg ?? 'transparent';
    }
  };

  return (
    <button
      type="button"
      style={style}
      className={className}
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};
