import { Resource } from '@/types/resource';
import { Icon } from '@xplored/ui';
import InsightCard from './InsightCard';

interface InsightGridProps {
    resources: Resource[];
    onSelect?: (resource: Resource) => void;
}

export default function InsightGrid({ resources, onSelect }: InsightGridProps) {
    if (resources.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-default-secondary">
                    <Icon name="alert-circle" size={24} color="icon-default-tertiary" />
                </div>
                <h3 className="text-lg font-medium text-default-primary mb-1">
                    No insights found
                </h3>
                <p className="text-default-secondary">
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
