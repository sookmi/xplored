import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCategorySlug } from '@/lib/categories';
import {
  getResources,
  getCategories,
  isAirtableConfigError,
  isAirtableRateLimitError,
} from '@/lib/content-repo';
import ResourceGrid from '@/components/ResourceGrid';
import ResourceLoadError from '@/components/ResourceLoadError';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  let categories: string[] = [];
  try {
    categories = await getCategories();
  } catch {
    return [];
  }
  return categories.map((category) => ({
    slug: getCategorySlug(category),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  let categories: string[] = [];
  try {
    categories = await getCategories();
  } catch {
    return { title: 'Resources - XploreD' };
  }
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
  try {
    const resources = await getResources(categoryName);
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let categories: string[] = [];
  try {
    categories = await getCategories();
  } catch {
    redirect('/');
  }

  const categoryName = categories.find(c => getCategorySlug(c) === slug);

  if (!categoryName) {
    redirect('/');
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

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-default-tertiary rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        }
      >
        <CategoryResources categoryName={categoryName} />
      </Suspense>
    </div>
  );
}
