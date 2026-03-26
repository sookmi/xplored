'use client';

import { usePathname } from 'next/navigation';
import { getCategorySlug } from '@/lib/categories';
import { Tab } from './Tab';

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
          >
            {category}
          </Tab>
        );
      })}
    </div>
  );
}
