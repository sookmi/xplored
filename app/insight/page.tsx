import { getInsights, isAirtableConfigError, isAirtableRateLimitError } from '@/lib/content-repo';
import InsightPageClient from '@/components/InsightPageClient';
import ResourceLoadError from '@/components/ResourceLoadError';
import type { Resource } from '@/types/resource';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Insight - XploreD',
    description: '팔리는 디자인의 밑그림, 디자이너를 위한 지식 저장소',
};

export default async function InsightPage() {
    let insights: Resource[] = [];
    let loadErrorReason: 'request' | 'config' | 'rate_limit' | null = null;
    try {
        insights = await getInsights();
    } catch (error) {
        loadErrorReason = isAirtableConfigError(error)
            ? 'config'
            : isAirtableRateLimitError(error)
                ? 'rate_limit'
                : 'request';
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="mb-8">
                <h1 className="text-3xl font-bold text-default-primary mb-2">
                    Insight
                </h1>
                <p className="text-default-secondary mb-6">
                    팔리는 디자인의 밑그림, 디자이너를 위한 지식 저장소
                </p>
            </section>

            {loadErrorReason ? (
                <ResourceLoadError reason={loadErrorReason} />
            ) : (
                <InsightPageClient insights={insights} />
            )}
        </div>
    );
}
