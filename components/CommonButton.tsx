'use client';

import type { CommonButtonProps as BaseCommonButtonProps } from '@xplored/ui';
import { CommonButton as BaseCommonButton } from '@xplored/ui';
import { NextLinkAdapter } from './NextLinkAdapter';

export type {
  ButtonColor,
  ButtonSize,
  ButtonState,
  ButtonType,
  CommonButtonProps,
} from '@xplored/ui';

export function CommonButton(props: BaseCommonButtonProps) {
  return <BaseCommonButton {...props} LinkComponent={NextLinkAdapter} />;
}
