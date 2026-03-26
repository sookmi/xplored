'use client';

import { usePathname } from 'next/navigation';
import { Tab } from './Tab';

interface CategoryFilterProps {
  categories: string[];
}

function getCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname();
  const isAllActive = pathname === '/';

  return (
    <div className="flex flex-wrap gap-2">
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
