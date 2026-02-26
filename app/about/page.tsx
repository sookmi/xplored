import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'The Designer\'s Survival Kit. 아이디어부터 결과까지, 창업을 꿈꾸는 디자이너를 위한 엄선된 실무 리소스.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          아이디어는 많지만, 그것을 결과물로 만드는 과정은 고독합니다.
          사수 없는 환경에서 모든 결정을 스스로 내려야 하는 솔로 디자이너와 창업가형 디자이너를 위해,
          <strong className="text-gray-900 dark:text-white font-semibold"> 엑스플로디는 정교하게 정제된 실무 항로를 제안합니다.</strong>
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 my-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Systems Nominal.</h3>
          <p className="text-gray-600 dark:text-gray-300">
            우리는 단순히 리소스를 나열하지 않습니다.
            기획(AI)부터 설계(System), 그리고 실제 제작(Production) 인프라까지
            디자이너의 워크플로우를 관통하는 검증된 도구만을 엄선하여 엑스플로디에 담았습니다.
          </p>
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          Our Mission: Precision & Efficiency
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          넘쳐나는 정보는 오히려 의사결정을 방해합니다.
          엑스플로디의 미션은 불필요한 탐색 시간을 제거하고,
          디자이너가 오직 &apos;만드는 일&apos;에만 집중할 수 있는 인프라를 제공하는 것입니다.
        </p>


        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          Join the Orbit
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          제안하고 싶은 리소스가 있거나 시스템 오류를 발견하셨나요?
          당신의 피드백은 엑스플로디라는 항로를 더 정교하게 만듭니다.
        </p>
        <a
          href="mailto:xploredx@gmail.com?subject=XploreD 의견 보내기"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          의견 보내기
        </a>
      </div>
    </div>
  );
}
