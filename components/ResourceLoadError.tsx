'use client';

import { useRouter } from 'next/navigation';

export default function ResourceLoadError() {
  const router = useRouter();

  return (
    <div className="text-center py-16">
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
      <h3 className="text-lg font-medium text-default-primary mb-1">
        데이터를 불러올 수 없습니다
      </h3>
      <p className="text-default-secondary text-sm mb-6">
        일시적인 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="inline-flex items-center justify-center min-w-[56px] px-[12px] py-2 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
        style={{
          backgroundColor: 'var(--bg-brand-solid)',
          color: 'var(--text-utility-on-dark-color)',
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
