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
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isAllActive
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </Link>
      {categories.map((category) => {
        const slug = getCategorySlug(category);
        const href = `/category/${slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={category}
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
