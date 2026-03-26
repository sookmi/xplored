'use client';

import { useEffect } from 'react';
import { Resource } from '@/types/resource';
import { Icon } from './Icon';

interface InsightSidebarProps {
    insight: Resource | null;
    onClose: () => void;
}

// Simple markdown-like formatter: headings, bold, bullets, line breaks
function formatSummary(text: string): React.ReactNode[] {
    // 이스케이프된 \* → * 정규화
    const normalized = text.replace(/\\\*/g, '*');
    const lines = normalized.split('\n');
    const elements: React.ReactNode[] = [];

    const renderBold = (raw: string, key: number) => {
        const parts = raw.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={key}>
                {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j} className="font-semibold text-default-primary">{part.slice(2, -2)}</strong>
                        : part
                )}
            </span>
        );
    };

    lines.forEach((line, i) => {
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={i} className="text-base font-bold text-default-primary mt-4 mb-1">
                    {line.replace('### ', '')}
                </h3>
            );
        } else if (line.startsWith('- ')) {
            const content = line.replace('- ', '');
            elements.push(
                <li key={i} className="text-sm text-default-secondary ml-3 list-disc">
                    {renderBold(content, i)}
                </li>
            );
        } else if (line.trim() === '') {
            elements.push(<div key={i} className="h-1" />);
        } else {
            elements.push(
                <p key={i} className="text-sm text-default-secondary leading-relaxed">
                    {renderBold(line, i)}
                </p>
            );
        }
    });

    return elements;
}

export default function InsightSidebar({ insight, onClose }: InsightSidebarProps) {
    // ESC 키로 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // 열릴 때 스크롤 잠금
    useEffect(() => {
        if (insight) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [insight]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${insight ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[560px] bg-default-primary z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${insight ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {insight && (
                    <>
                        {/* 상단: 제목 + 닫기 버튼 */}
                        <div className="flex items-start justify-between gap-3 px-6 py-6 border-b border-default-tertiary flex-shrink-0">
                            <h2 className="text-2xl font-bold text-default-primary leading-snug">
                                {insight.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-default-secondary transition-colors flex-shrink-0 mt-0.5"
                                aria-label="닫기"
                            >
                                <Icon name="x" size={20} color="icon-default-tertiary" />
                            </button>
                        </div>

                        {/* 컨텐츠 스크롤 영역 */}
                        <div className="flex-1 overflow-y-auto">

                            <div className="px-6 py-6">
                                {/* 메타 정보 그룹: 저자 + 태그라인 + 태그 */}
                                <div className="mb-5 space-y-3">
                                    {insight.author && (
                                        <div>
                                            <p className="text-xs text-utility-placeholder mb-0.5">저자</p>
                                            <p className="text-sm text-default-primary">{insight.author}</p>
                                        </div>
                                    )}
                                    {insight.tag_line && (
                                        <div>
                                            <p className="text-xs text-utility-placeholder mb-0.5">한줄 요약</p>
                                            <p className="text-sm text-default-secondary leading-relaxed">
                                                {insight.tag_line}
                                            </p>
                                        </div>
                                    )}
                                    {insight.tags.length > 0 && (
                                        <div>
                                            <p className="text-xs text-utility-placeholder mb-1.5">태그</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {insight.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-default-secondary text-default-secondary"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 구분선 */}
                                {insight.summary && (
                                    <hr className="border-default-tertiary mb-5" />
                                )}


                                {/* Summary */}
                                {insight.summary && (
                                    <div className="space-y-1">
                                        {formatSummary(insight.summary)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 하단: 외부 링크 버튼 */}
                        {insight.url && (
                            <div className="px-6 py-6 border-t border-default-tertiary flex-shrink-0">
                                <a
                                    href={insight.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-default-black-solid text-utility-white dark:text-default-primary dark:bg-default-primary border border-default-primary-solid text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    <span className="dark:hidden"><Icon name="external-link" size={20} color="icon-utility-white" /></span>
                                    <span className="hidden dark:inline"><Icon name="external-link" size={20} color="icon-default-primary" /></span>
                                    바로가기
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
