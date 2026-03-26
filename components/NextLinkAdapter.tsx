'use client';

import Link from 'next/link';
import type { LinkComponentProps } from '@xplored/ui';

export function NextLinkAdapter({ href, children, ...props }: LinkComponentProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
