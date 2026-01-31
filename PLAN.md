# XploreD 웹사이트 리빌드 계획

## 개요
- **현재**: Framer 기반 웹사이트 (https://www.xplored.design/)
- **목표**: Next.js + Airtable 연동으로 리빌드
- **이유**: 데이터 연동 편의성, 기존 Airtable 데이터 활용
- **프로젝트 위치**: `/Users/youngjinpark/Documents/study/claudecode/xplored-website`
- **데이터 범위**: Resource 테이블만 사용

## 기술 스택
| 구분 | 기술 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router) | SSG/SSR 지원, Vercel 배포 용이 |
| 스타일링 | Tailwind CSS | 빠른 개발, 반응형 쉬움 |
| 데이터 | **Airtable API** (기존 유지) | 이미 데이터 구축됨, 마이그레이션 불필요 |
| 배포 | Vercel | Next.js 최적화, 무료 플랜 |
| 폰트 | Inter (현재와 동일) | 디자인 일관성 유지 |

---

## 구현 단계

### Phase 1: 디자인 참고 (선택) ✅
1. 현재 사이트 스크린샷 캡처 (디자인 참고용)
2. 레이아웃/색상/타이포그래피 분석
   - (Airtable에 데이터가 이미 있으므로 콘텐츠 추출 불필요)

### Phase 2: 프로젝트 셋업 ✅
```
xplored-website/
├── app/
│   ├── layout.tsx              # 공통 레이아웃 (Header/Footer)
│   ├── page.tsx                # 홈페이지 (전체 리소스)
│   ├── category/
│   │   └── [slug]/page.tsx     # 카테고리별 페이지
│   ├── resources/
│   │   ├── design-system/page.tsx
│   │   ├── references/page.tsx
│   │   └── platforms/page.tsx
│   └── about/page.tsx          # About 페이지
├── components/
│   ├── Header.tsx              # 네비게이션
│   ├── Footer.tsx
│   ├── ResourceCard.tsx        # 리소스 카드 컴포넌트
│   ├── CategoryFilter.tsx      # 카테고리 필터
│   └── SearchBar.tsx           # 검색 기능
├── lib/
│   └── airtable.ts             # Airtable API 유틸
├── types/
│   └── resource.ts             # TypeScript 타입 정의
├── public/
│   └── images/
└── tailwind.config.js
```

### Phase 3: Airtable 연동 (기존 데이터 유지) ✅
1. 기존 Airtable Base 구조 파악
   - 현재 테이블/필드 구조 확인
   - API 키 및 Base ID 확보
2. Airtable API 연동 설정
   - `airtable` npm 패키지 사용
   - 환경변수로 API 키 관리
3. 데이터 fetching 함수 구현
   - 각 테이블별 조회 함수
   - ISR(Incremental Static Regeneration)로 캐싱

### Phase 4: UI 구현 ✅
1. 공통 컴포넌트 (Header, Footer, Navigation)
2. 리소스 카드 그리드 레이아웃
3. 카테고리 필터 (Design System, References, Platforms 등)
4. 검색/태그 필터 기능
5. 반응형 디자인 (모바일 우선)
6. 다크모드 지원 (선택)

### Phase 5: 배포 ⬜ (진행 예정)
1. Vercel 연동
2. 환경변수 설정 (Airtable API Key, Base ID)
3. 도메인 연결 (xplored.design)

---

## Airtable 구조 (실제)

### Base: XploreD (appNd1RzHxEzx8I4j)

**사용할 테이블:** Resource (다른 테이블은 사용 안 함)

### Resource 테이블 필드
| 필드명 | 타입 | 용도 |
|--------|------|------|
| title | 텍스트 | 리소스 이름 |
| url | URL | 원본 링크 |
| category | 선택 | Design System, References, Platforms |
| tags | 태그 | 분류 태그 |
| source_type | 선택 | Website 등 |
| status | 상태 | Published/Draft |
| thumbnail | 이미지 | 썸네일 |
| created_at | 날짜 | 생성일 |
| updated_at | 날짜 | 수정일 |

---

## Airtable API 연동 방법

### 1. API Key 생성
1. https://airtable.com/account 접속
2. "API" 섹션에서 "Generate API key" 또는 "Personal access token" 생성
3. 토큰에 `data.records:read` 권한 부여

### 2. Base ID 확인
- Airtable Base URL: `https://airtable.com/appNd1RzHxEzx8I4j/...`
- Base ID: `appNd1RzHxEzx8I4j`

### 3. 코드 예시
```typescript
// lib/airtable.ts
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!);

export async function getResources(category?: string) {
  const records = await base('Resource')
    .select({
      filterByFormula: category
        ? `{category} = '${category}'`
        : '{status} = "Published"',
      sort: [{ field: 'created_at', direction: 'desc' }]
    })
    .all();

  return records.map(r => ({
    id: r.id,
    title: r.fields.title,
    url: r.fields.url,
    category: r.fields.category,
    thumbnail: r.fields.thumbnail?.[0]?.url,
    // ...
  }));
}
```

### 4. 환경변수 (.env.local)
```
AIRTABLE_API_KEY=pat_xxxxx
AIRTABLE_BASE_ID=appNd1RzHxEzx8I4j
```

---

## 검증 방법
1. `npm run dev`로 로컬 개발 서버 실행
2. Airtable 데이터 변경 후 반영 확인
3. 모바일/태블릿/데스크톱 반응형 테스트
4. Lighthouse 성능 점수 확인
5. Vercel Preview 배포로 실제 환경 테스트

---

## 예상 결과물
- 데이터 관리: 기존 Airtable에서 콘텐츠 계속 관리
- 자동 반영: Airtable 수정 → 웹사이트 자동 업데이트 (ISR 또는 실시간)
- 유지보수: 코드 수정 없이 콘텐츠 관리 가능
- 마이그레이션: 기존 데이터 그대로 유지, 새로 입력 불필요
