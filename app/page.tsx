import { Suspense } from 'react';
import {
  getResources,
  getCategories,
  searchResources,
  isAirtableConfigError,
  isAirtableRateLimitError,
} from '@/lib/content-repo';
import ResourceGrid from '@/components/ResourceGrid';
import ResourceLoadError from '@/components/ResourceLoadError';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

export const revalidate = 3600;

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

async function ResourcesContent({ searchQuery }: { searchQuery?: string }) {
  try {
    const resources = searchQuery
      ? await searchResources(searchQuery)
      : await getResources();
    return <ResourceGrid resources={resources} />;
  } catch (error) {
    const reason = isAirtableConfigError(error)
      ? 'config'
      : isAirtableRateLimitError(error)
        ? 'rate_limit'
        : 'request';
    return (
      <ResourceLoadError reason={reason} />
    );
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params?.q;

  let categories: string[] = [];
  try {
    categories = await getCategories();
  } catch {
    // Show page with empty categories so at least the layout loads
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-default-primary mb-2">
          Resources
        </h1>
        <p className="text-default-secondary mb-6">
          아이디어부터 결과까지, 창업을 꿈꾸는 디자이너를 위한 리소스 키트
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CategoryFilter categories={categories} />
          <Suspense fallback={<div className="w-full max-w-md h-10 bg-default-tertiary rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-default-secondary">
            Search results for: <span className="font-medium text-default-primary">&quot;{searchQuery}&quot;</span>
          </p>
        </div>
      )}

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-default-tertiary rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        }
      >
        <ResourcesContent searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
