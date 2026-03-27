'use client';

import { useRouter } from 'next/navigation';
import { CommonButton, Icon } from '@xplored/ui';

interface ResourceLoadErrorProps {
  reason?: 'request' | 'config' | 'rate_limit';
}

export default function ResourceLoadError({ reason = 'request' }: ResourceLoadErrorProps) {
  const router = useRouter();
  const isConfigError = reason === 'config';
  const isRateLimitError = reason === 'rate_limit';

  return (
    <div className="text-center py-16">
      <div
        className="w-16 h-16 rounded-full bg-default-secondary flex items-center justify-center mx-auto mb-6"
        aria-hidden
      >
        <Icon name="alert-triangle" size={24} color="icon-default-tertiary" />
      </div>
      <h3 className="text-lg font-medium text-default-primary mb-1">
        {isConfigError
          ? 'Supabase 설정을 확인해 주세요'
          : isRateLimitError
            ? 'Supabase 요청 한도에 도달했습니다'
            : '데이터를 불러올 수 없습니다'}
      </h3>
      <p className="text-default-secondary text-sm mb-6">
        {isConfigError
          ? 'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.'
          : isRateLimitError
            ? '현재 프로젝트의 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'
          : '일시적인 오류가 발생했습니다. 다시 시도해 주세요.'}
      </p>
      <CommonButton variant="filled" color="secondary" size="md" onClick={() => router.refresh()}>
        다시 시도
      </CommonButton>
    </div>
  );
}
