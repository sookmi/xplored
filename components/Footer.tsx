import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              XploreD
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              창업을 꿈꾸는 디자이너를 위한 리소스 키트
            </p>
          </div>

          <div>
            <ul className="flex flex-wrap gap-6">
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/insight"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Insight
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} XploreD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
