import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - XploreD',
  description: 'The Designer\'s Survival Kit. 아이디어부터 결과까지, 창업을 꿈꾸는 디자이너를 위한 엄선된 실무 리소스.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">About XploreD</h1>
      <h2 className="text-xl font-medium text-gray-600 mb-8">The Designer&apos;s Survival Kit.</h2>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          아이디어는 많지만, 그것을 결과물로 만드는 과정은 고독합니다.
          사수 없는 환경에서 모든 결정을 스스로 내려야 하는 솔로 디자이너와 창업가형 디자이너를 위해,
          <strong className="text-gray-900 font-semibold"> 엑스플로디(XploreD)는 정교하게 정제된 실무 항로를 제안합니다.</strong>
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 my-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">All Systems Nominal.</h3>
          <p className="text-gray-600">
            우리는 단순히 리소스를 나열하지 않습니다.
            기획(AI)부터 설계(System), 그리고 실제 제작(Production) 인프라까지
            디자이너의 워크플로우를 관통하는 검증된 도구만을 엄선하여 &apos;컨트롤 타워&apos;에 담았습니다.
          </p>
        </div>

        <hr className="my-10 border-gray-200" />

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          Our Mission: Precision & Efficiency
        </h2>
        <p className="text-gray-600 mb-8">
          넘쳐나는 정보는 오히려 의사결정을 방해합니다.
          엑스플로디의 미션은 불필요한 탐색 시간을 제거하고,
          당신이 오직 &apos;만드는 일&apos;에만 집중할 수 있는 무결점(Seamless) 인프라를 제공하는 것입니다.
        </p>

        <hr className="my-10 border-gray-200" />

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
          The 6 Pillars (Categories)
        </h2>
        <p className="text-gray-600 mb-6">시스템의 안정성을 지탱하는 6가지 핵심 카테고리입니다.</p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mb-10">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2 font-bold">•</span>
            <span><strong className="text-gray-900">AI & Automation</strong>: 기획과 반복 업무를 가속화하는 지능형 도구.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2 font-bold">•</span>
            <span><strong className="text-gray-900">Design System</strong>: 글로벌 기업의 설계 도면과 컴포넌트 라이브러리.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2 font-bold">•</span>
            <span><strong className="text-gray-900">References</strong>: 단순 영감을 넘어 논리와 구조가 담긴 레퍼런스.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2 font-bold">•</span>
            <span><strong className="text-gray-900">Platforms</strong>: 협업과 생산성을 극대화하는 실무 환경.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2 font-bold">•</span>
            <span><strong className="text-gray-900">Assets</strong>: 즉시 투입 가능한 고품질 소스와 에셋.</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2 font-bold">•</span>
            <span><strong className="text-gray-900">Production</strong>: 한국 실무에 특화된 인쇄, 특허, 제작 인프라.</span>
          </li>
        </ul>

        <hr className="my-10 border-gray-200" />

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          Join the Orbit
        </h2>
        <p className="text-gray-600">
          제안하고 싶은 리소스가 있거나 시스템 오류를 발견하셨나요?
          당신의 피드백은 엑스플로디라는 항로를 더 정교하게 만듭니다.
        </p>
      </div>
    </div>
  );
}
