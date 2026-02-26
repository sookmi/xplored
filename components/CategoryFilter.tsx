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
          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
