'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Icon } from '@xplored/ui';
import { Resource } from '@/types/resource';

interface InsightCardProps {
    resource: Resource;
    onSelect: () => void;
}

export default function InsightCard({ resource, onSelect }: InsightCardProps) {
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [resource.thumbnail]);

    return (
        <div
            onClick={onSelect}
            className="group cursor-pointer bg-default-primary rounded-xl border border-default-tertiary overflow-hidden hover:shadow-[var(--shadow-card-hovered)] hover:border-brand-primary transition-all duration-200"
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
                            className="flex-shrink-0 mt-0.5 p-1 rounded hover:bg-default-secondary transition-colors [&_path]:transition-colors hover:[&_path]:stroke-[var(--icon-brand-primary)]"
                            aria-label="외부 링크"
                        >
                            <Icon name="external-link" size={20} color="icon-default-tertiary" />
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
