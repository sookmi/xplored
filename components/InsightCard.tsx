'use client';

import Image from 'next/image';
import { Resource } from '@/types/resource';

interface InsightCardProps {
    resource: Resource;
    onSelect: () => void;
}

export default function InsightCard({ resource, onSelect }: InsightCardProps) {
    return (
        <div
            onClick={onSelect}
            className="group cursor-pointer bg-default-primary rounded-xl border border-default-tertiary overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-brand-primary transition-all duration-200"
        >
            <div className="aspect-video relative bg-default-tertiary overflow-hidden">
                {resource.thumbnail ? (
                    <Image
                        src={resource.thumbnail}
                        alt={resource.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        unoptimized={true}
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
                {resource.author && (
                    <p className="text-xs text-default-secondary mb-1">{resource.author}</p>
                )}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-default-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                        {resource.title}
                    </h3>
                    {/* 외부 링크: 별도 클릭 이벤트 (사이드바 열기 방지) */}
                    {resource.url && (
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0 mt-0.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="외부 링크"
                        >
                            <svg
                                className="w-4 h-4 text-gray-400 dark:text-gray-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>

                {resource.tag_line && (
                    <p className="mt-2 text-sm text-default-secondary line-clamp-2">
                        {resource.tag_line}
                    </p>
                )}

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {resource.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-default-secondary text-default-secondary"
                        >
                            {tag}
                        </span>
                    ))}
                    {resource.tags.length > 2 && (
                        <span className="text-xs text-utility-placeholder">
                            +{resource.tags.length - 2}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
