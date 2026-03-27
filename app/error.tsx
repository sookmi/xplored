'use client';

import { useEffect } from 'react';
import { CommonButton, Icon } from '@xplored/ui';
import { NextLinkAdapter } from '@/components/NextLinkAdapter';

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
    error.message?.includes('SUPABASE') ||
    error.message?.includes('Supabase configuration') ||
    error.message?.includes('timed out');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-md mx-auto">
        <div
          className="w-16 h-16 rounded-full bg-default-secondary flex items-center justify-center mx-auto mb-6"
          aria-hidden
        >
          <Icon name="alert-triangle" size={24} color="icon-default-tertiary" />
        </div>
        <h1 className="text-2xl font-bold text-default-primary mb-2">
          {isConfigError ? '데이터를 불러올 수 없습니다' : '오류가 발생했습니다'}
        </h1>
        <p className="text-default-secondary text-sm mb-6">
          {isConfigError ? (
            <>
              Supabase 설정을 확인해 주세요. 서버 환경 변수
              (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)가 올바르게 설정되어 있는지 확인하세요.
            </>
          ) : (
            error.message || '잠시 후 다시 시도해 주세요.'
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <CommonButton variant="filled" color="secondary" size="md" onClick={reset}>
            다시 시도
          </CommonButton>
          <CommonButton
            href="/"
            variant="outlined"
            color="secondary"
            size="md"
            LinkComponent={NextLinkAdapter}
          >
            홈으로 돌아가기
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
