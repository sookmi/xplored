import { CommonButton, Icon } from '@xplored/ui';
import { NextLinkAdapter } from '@/components/NextLinkAdapter';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-default-tertiary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-default-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-default-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <CommonButton
          href="/"
          variant="filled"
          color="brand"
          size="md"
          LinkComponent={NextLinkAdapter}
          className="mx-auto"
        >
          <Icon name="arrow-left" size={20} color="icon-utility-white" />
          Back to Home
        </CommonButton>
      </div>
    </div>
  );
}
