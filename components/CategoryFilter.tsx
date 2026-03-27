'use client';

import { usePathname } from 'next/navigation';
import { Tab } from '@xplored/ui';
import { getCategorySlug } from '@/lib/categories';
import { NextLinkAdapter } from './NextLinkAdapter';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname();
  const isAllActive = pathname === '/';

  return (
    <div
      className="flex flex-wrap items-start gap-2"
      role="tablist"
      aria-label="Resource categories"
    >
      <Tab
        href="/"
        state={isAllActive ? 'Active' : 'Enabled'}
        LinkComponent={NextLinkAdapter}
      >
        All
      </Tab>
      {categories.map((category) => {
        const slug = getCategorySlug(category);
        const href = `/resource/${slug}`;
        const isActive = pathname === href || pathname === `${href}/`;

        return (
          <Tab
            key={category}
            href={href}
            state={isActive ? 'Active' : 'Enabled'}
            LinkComponent={NextLinkAdapter}
          >
            {category}
          </Tab>
        );
      })}
    </div>
  );
}
