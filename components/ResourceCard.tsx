import Image from 'next/image';
import { Resource } from '@/types/resource';

interface ResourceCardProps {
  resource: Resource;
}

// Helper function to remove [bracket] patterns from tags
function stripBrackets(tag: string): string {
  // Match pattern like "[AI] Text" and return only "Text"
  const match = tag.match(/\[.*?\]\s*(.*)/);
  return match ? match[1].trim() : tag;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
    >
      <div className="aspect-video relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {resource.thumbnail ? (
          <Image
            src={resource.thumbnail}
            alt={resource.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="eager"
            unoptimized
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <span className="text-4xl font-bold text-gray-300 dark:text-gray-700">
              {resource.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {resource.title}
          </h3>
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0 mt-1 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>


        {/* Tag Line */}
        {resource.tag_line && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {resource.tag_line}
          </p>
        )}

        {/* Explore Tip - Hidden for now */}
        {/* {resource.explore_tip && (
          <div className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-lg">
            <p className="text-xs text-primary-700 dark:text-primary-300">
              💡 {resource.explore_tip}
            </p>
          </div>
        )} */}


        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {resource.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {resource.category}
            </span>
          )}
          {resource.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {stripBrackets(tag)}
            </span>
          ))}
          {resource.tags.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              +{resource.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
