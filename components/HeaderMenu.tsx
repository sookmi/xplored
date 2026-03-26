'use client';

import type { HeaderMenuProps as BaseHeaderMenuProps } from '@xplored/ui';
import { HeaderMenu as BaseHeaderMenu } from '@xplored/ui';
import { NextLinkAdapter } from './NextLinkAdapter';

export type { HeaderMenuProps, HeaderMenuState } from '@xplored/ui';

export function HeaderMenu(props: BaseHeaderMenuProps) {
  return <BaseHeaderMenu {...props} LinkComponent={NextLinkAdapter} />;
}
