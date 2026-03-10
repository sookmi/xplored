'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  const isConfigError =
    error.message?.includes('AIRTABLE') ||
    error.message?.includes('Airtable configuration') ||
    error.message?.includes('timed out');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-md mx-auto">
        <div
          className="w-16 h-16 rounded-full bg-default-secondary flex items-center justify-center mx-auto mb-6"
          aria-hidden
        >
          <svg
            className="w-8 h-8 text-default-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-default-primary mb-2">
          {isConfigError ? '데이터를 불러올 수 없습니다' : '오류가 발생했습니다'}
        </h1>
        <p className="text-default-secondary text-sm mb-6">
          {isConfigError ? (
            <>
              Airtable 설정을 확인해 주세요. 서버 환경 변수
              (AIRTABLE_API_KEY, AIRTABLE_BASE_ID)가 올바르게 설정되어 있는지 확인하세요.
            </>
          ) : (
            error.message || '잠시 후 다시 시도해 주세요.'
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center min-w-[56px] px-[12px] py-2 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--bg-brand-solid)', color: 'var(--text-utility-on-dark-color)' }}
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-w-[56px] px-[12px] py-2 text-sm font-semibold text-default-primary border border-default-primary rounded-lg hover:bg-default-secondary transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
