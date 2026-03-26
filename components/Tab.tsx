'use client';

import type { TabProps as BaseTabProps } from '@xplored/ui';
import { Tab as BaseTab } from '@xplored/ui';
import { NextLinkAdapter } from './NextLinkAdapter';

export type { TabProps, TabState } from '@xplored/ui';

export function Tab(props: BaseTabProps) {
  return <BaseTab {...props} LinkComponent={NextLinkAdapter} />;
}
