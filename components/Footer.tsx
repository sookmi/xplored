import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              XploreD
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              창업을 꿈꾸는 디자이너를 위한 리소스 키트
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/category/design-system"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Design System
                </Link>
              </li>
              <li>
                <Link
                  href="/category/references"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  References
                </Link>
              </li>
              <li>
                <Link
                  href="/category/platforms"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Platforms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} XploreD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
