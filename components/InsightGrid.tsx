import { Resource } from '@/types/resource';
import InsightCard from './InsightCard';

interface InsightGridProps {
    resources: Resource[];
    onSelect?: (resource: Resource) => void;
}

export default function InsightGrid({ resources, onSelect }: InsightGridProps) {
    if (resources.length === 0) {
        return (
            <div className="text-center py-16">
                <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No insights found
                </h3>
                <p className="text-gray-500">
                    Check back soon for new insights.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <InsightCard
                    key={resource.id}
                    resource={resource}
                    onSelect={() => onSelect?.(resource)}
                />
            ))}
        </div>
    );
}
