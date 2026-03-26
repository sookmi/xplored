import { Resource } from '@/types/resource';
import ResourceCard from './ResourceCard';
import { Icon } from './Icon';

interface ResourceGridProps {
  resources: Resource[];
}

export default function ResourceGrid({ resources }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-default-secondary">
          <Icon name="alert-circle" size={24} color="icon-default-tertiary" />
        </div>
        <h3 className="text-lg font-medium text-default-primary mb-1">
          No resources found
        </h3>
        <p className="text-default-secondary">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
