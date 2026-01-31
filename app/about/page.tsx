import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - XploreD',
  description: 'Learn more about XploreD and our mission to curate the best design resources.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About XploreD</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          XploreD is a curated collection of design resources for designers and developers.
          We carefully select and organize the best design systems, references, and platforms
          to help you create better products.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 mb-6">
          Finding quality design resources can be overwhelming. Our mission is to simplify
          this process by curating and categorizing the most valuable resources in one place.
          Whether you&apos;re looking for inspiration, learning materials, or tools to enhance
          your workflow, XploreD has you covered.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Categories
        </h2>
        <ul className="space-y-4 mb-6">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-900">Design System</h3>
              <p className="text-sm text-gray-600">
                Comprehensive design systems and component libraries from leading companies.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-900">References</h3>
              <p className="text-sm text-gray-600">
                Inspiration galleries, design showcases, and reference materials.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-900">Platforms</h3>
              <p className="text-sm text-gray-600">
                Design tools, collaboration platforms, and productivity apps.
              </p>
            </div>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Contact
        </h2>
        <p className="text-gray-600">
          Have a resource you&apos;d like to suggest? Found an issue?
          We&apos;d love to hear from you.
        </p>
      </div>
    </div>
  );
}
