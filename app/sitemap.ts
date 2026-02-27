import { MetadataRoute } from 'next';
import { getCategories } from '@/lib/airtable';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://xplored.design'; // Replace with your actual domain
    const categories = await getCategories();

    const categoryUrls = categories.map((category) => {
        const slug = category.toLowerCase().replace(/\s+/g, '-');
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
