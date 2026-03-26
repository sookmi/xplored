# Vercel 배포 가이드

## 환경 변수 설정

Airtable 데이터가 사이트에 표시되려면 **Vercel 프로젝트 설정**에 다음 환경 변수를 추가해야 합니다.

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**
2. 아래 변수 추가:

| 변수명 | 설명 |
|--------|------|
| `AIRTABLE_API_KEY` | Airtable Personal Access Token (pat_로 시작) |
| `AIRTABLE_BASE_ID` | Airtable Base ID (app로 시작, 예: appNd1RzHxEzx8I4j) |

3. **Production**, **Preview**, **Development** 환경 모두 체크 후 저장
4. 변경 후 **재배포** 필요 (Settings 저장만으로는 기존 배포에 반영되지 않음)

## 환경 변수 없을 때

환경 변수가 설정되지 않으면 **"데이터를 불러올 수 없습니다"** 메시지가 표시됩니다. 이 경우 위 설정을 확인해 주세요.

## Insight 썸네일 입력 규칙

`xplored_insights.thumbnail` 컬럼은 **전체 URL이 아니라 파일명만** 저장하는 것을 기준으로 사용합니다.

- 사용 버킷: `insight-images`
- 입력 위치: `xplored_insights.thumbnail`
- 입력 값: 버킷 안 파일명과 **완전히 동일한 문자열**

예시:

| 버킷 파일명 | `thumbnail`에 넣을 값 |
|--------|------|
| `img_list_TheRightIt.jpg` | `img_list_TheRightIt.jpg` |
| `img_list_ZeroToOne.jpg` | `img_list_ZeroToOne.jpg` |

주의:

- `thumbnail`에 `https://...` 전체 URL을 넣지 않아도 됩니다.
- `thumbnail`에 Airtable URL을 붙여 넣지 않습니다.
- 공백, 대소문자, `'` 같은 문자는 버킷 파일명과 정확히 일치해야 합니다.
- 앱은 `thumbnail` 값을 읽어서 `insight-images` public 버킷 URL로 조합합니다.

## Resource 썸네일 입력 규칙

`xplored_resources.thumbnail_url` 컬럼도 **전체 URL이 아니라 파일명만** 저장하는 것을 기준으로 사용합니다.

- 사용 버킷: `resources-images`
- 입력 위치: `xplored_resources.thumbnail_url`
- 입력 값: 버킷 안 파일명과 **완전히 동일한 문자열**

예시:

| 버킷 파일명 | `thumbnail_url`에 넣을 값 |
|--------|------|
| `img_list_mobbin.jpg` | `img_list_mobbin.jpg` |
| `img_list_TokenStudioForFigma.jpg` | `img_list_TokenStudioForFigma.jpg` |

주의:

- `thumbnail_url`에 `https://...` 전체 URL을 넣지 않아도 됩니다.
- `thumbnail_url`에 Airtable URL을 붙여 넣지 않습니다.
- 공백, 대소문자, `'`, `&` 같은 문자는 버킷 파일명과 정확히 일치해야 합니다.
- 앱은 `thumbnail_url` 값을 읽어서 `resources-images` public 버킷 URL로 조합합니다.
