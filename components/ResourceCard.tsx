'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Resource } from '@/types/resource';
import { Icon } from './Icon';

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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [resource.thumbnail]);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-default-primary rounded-xl border border-default-tertiary overflow-hidden hover:shadow-[var(--shadow-card-hovered)] hover:border-brand-primary transition-all duration-200"
    >
      <div className="aspect-video relative bg-default-tertiary overflow-hidden">
        {resource.thumbnail && !imageFailed ? (
          <Image
            src={resource.thumbnail}
            alt={resource.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            unoptimized={true}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-default-tertiary to-default-secondary">
            <span className="text-4xl font-bold text-utility-placeholder">
              {resource.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-default-primary group-hover:text-brand-primary transition-colors line-clamp-1">
            {resource.title}
          </h3>
          <span className="flex-shrink-0 mt-0.5 [&_path]:transition-colors group-hover:[&_path]:stroke-[var(--icon-brand-primary)]">
            <Icon name="external-link" size={20} color="icon-default-tertiary" />
          </span>
        </div>


        {/* Tag Line */}
        {resource.tag_line && (
          <p className="mt-2 text-sm text-default-secondary line-clamp-2">
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-default-secondary text-default-secondary">
              {resource.category}
            </span>
          )}
          {resource.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-default-secondary text-default-secondary"
            >
              {stripBrackets(tag)}
            </span>
          ))}
          {resource.tags.length > 2 && (
            <span className="text-xs text-utility-placeholder">
              +{resource.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
