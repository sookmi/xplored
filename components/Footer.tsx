import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-default-secondary border-t border-default-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-default-primary">
              XploreD
            </Link>
            <p className="mt-2 text-sm text-default-secondary">
              창업을 꿈꾸는 디자이너를 위한 리소스 키트
            </p>
          </div>

          <div>
            <ul className="flex flex-wrap gap-6">
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium text-default-secondary hover:text-default-primary transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/insight"
                  className="text-sm font-medium text-default-secondary hover:text-default-primary transition-colors"
                >
                  Insight
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium text-default-secondary hover:text-default-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-default-tertiary flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-utility-placeholder">
            &copy; {new Date().getFullYear()} XploreD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
