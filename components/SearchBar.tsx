'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@xplored/ui';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/');
      }
    },
    [query, router]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    router.push('/');
  }, [router]);

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="search" size={20} color="icon-default-tertiary" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-10 py-2.5 bg-default-secondary border-0 rounded-lg text-sm text-default-primary placeholder-utility-placeholder focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-default-primary transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-default-secondary transition-colors"
            aria-label="검색어 지우기"
          >
            <Icon name="x" size={20} color="icon-default-tertiary" />
          </button>
        )}
      </div>
    </form>
  );
}
