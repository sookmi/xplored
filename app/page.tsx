import { Suspense } from 'react';
import { getResources, getCategories, searchResources } from '@/lib/airtable';
import ResourceGrid from '@/components/ResourceGrid';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

export const revalidate = 3600; // ISR: revalidate every hour

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

async function ResourcesContent({ searchQuery }: { searchQuery?: string }) {
  const resources = searchQuery
    ? await searchResources(searchQuery)
    : await getResources();

  return <ResourceGrid resources={resources} />;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.q;
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Design Resources
        </h1>
        <p className="text-gray-600 mb-6">
          Curated collection of design systems, references, and platforms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CategoryFilter categories={categories} />
          <Suspense fallback={<div className="w-full max-w-md h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Search results for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
          </p>
        </div>
      )}

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        }
      >
        <ResourcesContent searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
