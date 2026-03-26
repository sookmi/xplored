import { MetadataRoute } from 'next';
import { getCategorySlug } from '@/lib/categories';
import { getCategories } from '@/lib/content-repo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://xplored.design';
  let categories: string[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  const categoryUrls = categories.map((category) => {
    const slug = getCategorySlug(category);
    return {
      url: `${baseUrl}/resource/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insight`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
  ];
}
