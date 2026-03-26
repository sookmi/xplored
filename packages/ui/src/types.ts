import type React from 'react';

export interface LinkComponentProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export type LinkComponent = React.ComponentType<LinkComponentProps>;
