import { getInsights } from '@/lib/airtable';
import InsightPageClient from '@/components/InsightPageClient';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Insight - XploreD',
    description: '팔리는 디자인의 밑그림, 디자이너를 위한 지식 저장소',
};

export default async function InsightPage() {
    const insights = await getInsights();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Insight
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    팔리는 디자인의 밑그림, 디자이너를 위한 지식 저장소
                </p>
            </section>

            <InsightPageClient insights={insights} />
        </div>
    );
}
