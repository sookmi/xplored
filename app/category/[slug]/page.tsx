import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getResources, getCategories } from '@/lib/airtable';
import ResourceGrid from '@/components/ResourceGrid';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function getCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: getCategorySlug(category),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const categoryName = categories.find(c => getCategorySlug(c) === slug);

  if (!categoryName) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${categoryName} - XploreD`,
    description: `Browse curated ${categoryName.toLowerCase()} resources on XploreD.`,
  };
}

async function CategoryResources({ categoryName }: { categoryName: string }) {
  const resources = await getResources(categoryName);
  return <ResourceGrid resources={resources} />;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const categoryName = categories.find(c => getCategorySlug(c) === slug);

  if (!categoryName) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Curated collection of design systems, references, and platforms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CategoryFilter categories={categories} />
          <Suspense fallback={<div className="w-full max-w-md h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        }
      >
        <CategoryResources categoryName={categoryName} />
      </Suspense>
    </div>
  );
}
