'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      <Link
        href="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isAllActive
          ? 'bg-default-black-solid text-utility-white dark:text-gray-900'
          : 'bg-default-tertiary text-default-secondary hover:bg-default-tertiary-hover'
          }`}
      >
        All
      </Link>
      {categories.map((category) => {
        const slug = getCategorySlug(category);
        const href = `/resource/${slug}`;
        // Handle potential trailing slashes in pathname or consistent matching
        const isActive = pathname === href || pathname === `${href}/`;

        return (
          <Link
            key={category}
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive
              ? 'bg-default-black-solid text-utility-white dark:text-gray-900'
              : 'bg-default-tertiary text-default-secondary hover:bg-default-tertiary-hover'
              }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
