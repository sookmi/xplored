'use client';

import React from 'react';
import type { LinkComponent } from '../types';

export type ButtonType = 'text' | 'filled' | 'outlined';
export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
export type ButtonColor = 'brand' | 'primary' | 'secondary' | 'neutral';
export type ButtonState = 'enabled' | 'hovered' | 'pressed' | 'disabled';

export interface CommonButtonProps {
  variant?: ButtonType;
  size?: ButtonSize;
  color?: ButtonColor;
  state?: ButtonState;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  LinkComponent?: LinkComponent;
}

const sizeMap: Record<ButtonSize, React.CSSProperties> = {
  xxs: { minWidth: 48, paddingInline: 4, paddingBlock: 4, borderRadius: 4 },
  xs: { minWidth: 56, paddingInline: 8, paddingBlock: 4, borderRadius: 6 },
  sm: { minWidth: 56, paddingInline: 10, paddingBlock: 6, borderRadius: 6 },
  md: { minWidth: 56, paddingInline: 12, paddingBlock: 8, borderRadius: 8 },
  lg: { minWidth: 56, paddingInline: 16, paddingBlock: 10, borderRadius: 8 },
};

type StateStyles = {
  bg?: string;
  text: string;
  border?: string;
  backgroundImage?: string;
};

type VariantStateMap = Record<ButtonType, Record<ButtonColor, Record<ButtonState, StateStyles>>>;

const styleMap: VariantStateMap = {
  text: {
    brand: {
      enabled: { text: 'var(--text-brand-primary)' },
      hovered: { bg: 'var(--bg-brand-primary)', text: 'var(--text-brand-primary)' },
      pressed: { bg: 'var(--bg-brand-primary-hover)', text: 'var(--text-brand-primary)' },
      disabled: { text: 'var(--text-disabled-secondary)' },
    },
    primary: {
      enabled: { text: 'var(--text-brand-primary)' },
      hovered: { bg: 'var(--bg-brand-primary)', text: 'var(--text-brand-primary)' },
      pressed: { bg: 'var(--bg-brand-primary-hover)', text: 'var(--text-brand-primary)' },
      disabled: { text: 'var(--text-disabled-secondary)' },
    },
    secondary: {
      enabled: { text: 'var(--text-default-primary)' },
      hovered: { bg: 'var(--bg-default-secondary)', text: 'var(--text-default-primary)' },
      pressed: { bg: 'var(--bg-default-secondary-hover)', text: 'var(--text-default-primary)' },
      disabled: { text: 'var(--text-disabled-secondary)' },
    },
    neutral: {
      enabled: { text: 'var(--text-default-secondary)' },
      hovered: { bg: 'var(--bg-default-secondary)', text: 'var(--text-default-secondary)' },
      pressed: { bg: 'var(--bg-default-secondary-hover)', text: 'var(--text-default-secondary)' },
      disabled: { text: 'var(--text-disabled-secondary)' },
    },
  },
  filled: {
    brand: {
      enabled: { bg: 'var(--bg-brand-solid)', text: 'var(--text-utility-on-dark-color)' },
      hovered: { bg: 'var(--bg-brand-solid-hover)', text: 'var(--text-utility-on-dark-color)' },
      pressed: {
        backgroundImage:
          'linear-gradient(rgba(26,26,26,0.2), rgba(26,26,26,0.2)), linear-gradient(var(--bg-brand-solid), var(--bg-brand-solid))',
        text: 'var(--text-utility-on-dark-color)',
      },
      disabled: { bg: 'var(--bg-disabled-secondary)', text: 'var(--text-disabled-primary)' },
    },
    primary: {
      enabled: { bg: 'var(--bg-brand-primary)', text: 'var(--text-brand-primary)' },
      hovered: { bg: 'var(--bg-brand-primary-hover)', text: 'var(--text-brand-primary)' },
      pressed: { bg: 'var(--bg-brand-primary-hover)', text: 'var(--text-brand-primary)' },
      disabled: { bg: 'var(--bg-disabled-secondary)', text: 'var(--text-disabled-primary)' },
    },
    secondary: {
      enabled: { bg: 'var(--bg-default-tertiary)', text: 'var(--text-default-primary)' },
      hovered: { bg: 'var(--bg-default-tertiary-hover)', text: 'var(--text-default-primary)' },
      pressed: { bg: 'var(--bg-default-tertiary-hover)', text: 'var(--text-default-primary)' },
      disabled: { bg: 'var(--bg-disabled-secondary)', text: 'var(--text-disabled-primary)' },
    },
    neutral: {
      enabled: { bg: 'var(--bg-default-tertiary)', text: 'var(--text-default-secondary)' },
      hovered: { bg: 'var(--bg-default-tertiary-hover)', text: 'var(--text-default-secondary)' },
      pressed: { bg: 'var(--bg-default-tertiary-hover)', text: 'var(--text-default-secondary)' },
      disabled: { bg: 'var(--bg-disabled-secondary)', text: 'var(--text-disabled-primary)' },
    },
  },
  outlined: {
    brand: {
      enabled: { border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
      hovered: { bg: 'var(--bg-brand-primary)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
      pressed: { bg: 'var(--bg-brand-primary-hover)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
      disabled: { border: 'var(--border-disabled-secondary)', text: 'var(--text-disabled-secondary)' },
    },
    primary: {
      enabled: { border: 'var(--border-default-secondary)', text: 'var(--text-brand-primary)' },
      hovered: { bg: 'var(--bg-brand-primary)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
      pressed: { bg: 'var(--bg-brand-primary-hover)', border: 'var(--border-brand-primary)', text: 'var(--text-brand-primary)' },
      disabled: { border: 'var(--border-disabled-secondary)', text: 'var(--text-disabled-secondary)' },
    },
    secondary: {
      enabled: { border: 'var(--border-default-secondary)', text: 'var(--text-default-primary)' },
      hovered: { bg: 'var(--bg-default-secondary)', border: 'var(--border-default-secondary)', text: 'var(--text-default-primary)' },
      pressed: { bg: 'var(--bg-default-secondary-hover)', border: 'var(--border-default-secondary)', text: 'var(--text-default-primary)' },
      disabled: { border: 'var(--border-disabled-secondary)', text: 'var(--text-disabled-secondary)' },
    },
    neutral: {
      enabled: { border: 'var(--border-default-secondary)', text: 'var(--text-default-secondary)' },
      hovered: { bg: 'var(--bg-default-secondary)', border: 'var(--border-default-secondary)', text: 'var(--text-default-secondary)' },
      pressed: { bg: 'var(--bg-default-secondary-hover)', border: 'var(--border-default-secondary)', text: 'var(--text-default-secondary)' },
      disabled: { border: 'var(--border-disabled-secondary)', text: 'var(--text-disabled-secondary)' },
    },
  },
};

function getFontWeight(size: ButtonSize): number {
  return size === 'md' || size === 'lg' ? 600 : 400;
}

function getTypography(size: ButtonSize): { fontSize: number; lineHeight: string } {
  return size === 'xxs' ? { fontSize: 12, lineHeight: '16px' } : { fontSize: 14, lineHeight: '20px' };
}

export const CommonButton: React.FC<CommonButtonProps> = ({
  variant = 'filled',
  size = 'md',
  color = 'brand',
  state,
  href,
  target,
  rel,
  active = false,
  disabled = false,
  children = '레이블',
  onClick,
  className,
  LinkComponent,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const sizeStyle = sizeMap[size];
  const controlledState = state !== undefined;
  const resolvedState: ButtonState = disabled
    ? 'disabled'
    : active
      ? 'pressed'
      : controlledState
        ? state
        : pressed
          ? 'pressed'
          : hovered
            ? 'hovered'
            : 'enabled';
  const colorStyle = styleMap[variant][color][resolvedState];
  const fontWeight = getFontWeight(size);
  const typography = getTypography(size);
  const isDisabled = resolvedState === 'disabled';
  const isInteractive = !isDisabled && !active && !controlledState;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    overflow: 'clip',
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    fontWeight,
    letterSpacing: 0,
    transition: 'background-color 150ms, color 150ms',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ...sizeStyle,
    backgroundColor: colorStyle.bg ?? 'transparent',
    backgroundImage: colorStyle.backgroundImage,
    color: colorStyle.text,
    border: colorStyle.border ? `1px solid ${colorStyle.border}` : 'none',
  };

  const handleMouseEnter = () => {
    if (isInteractive) setHovered(true);
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHovered(false);
      setPressed(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (isInteractive && e.button === 0) setPressed(true);
  };

  const handleMouseUp = () => {
    if (isInteractive) setPressed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    if (e.key === ' ' || e.key === 'Enter') setPressed(true);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    if (e.key === ' ' || e.key === 'Enter') setPressed(false);
  };

  const handleBlur = () => {
    if (isInteractive) {
      setHovered(false);
      setPressed(false);
    }
  };

  const content = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        paddingInline: 2,
      }}
    >
      {children}
    </span>
  );

  if (href) {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.();
    };

    const interactiveProps = {
      style,
      className,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onBlur: handleBlur,
      onClick: handleLinkClick,
      'aria-disabled': isDisabled,
      tabIndex: isDisabled ? -1 : undefined,
    } as const;

    const finalRel = target === '_blank' ? rel ?? 'noopener noreferrer' : rel;
    const isInternal = href.startsWith('/');

    if (LinkComponent && isInternal) {
      return (
        <LinkComponent href={href} target={target} rel={finalRel} {...interactiveProps}>
          {content}
        </LinkComponent>
      );
    }

    return (
      <a href={href} target={target} rel={finalRel} {...interactiveProps}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      style={style}
      className={className}
      disabled={isDisabled}
      aria-pressed={resolvedState === 'pressed'}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    >
      {content}
    </button>
  );
};
