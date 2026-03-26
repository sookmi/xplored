# XploreD Architecture

## Runtime Stack

- Framework: Next.js 14 App Router
- Styling: Tailwind CSS + design-token CSS variables
- Data source: Supabase
- Deployment: Vercel
- UI reuse layer: `packages/ui`
- App-specific wrappers and domain components: `components`

## Code Layout

### App runtime

- `app/`: routes and page composition
- `components/`: XploreD-specific wrappers, routing-aware UI, and domain components
- `lib/content-repo.ts`: Supabase-backed resource and insight loading
- `types/`: shared domain types

### Reusable UI

- `packages/ui/src/components`: reusable framework-agnostic UI primitives
- `packages/ui/src/icons.ts`: icon registry and metadata
- `stories/`: Storybook stories for the reusable UI layer

The site should prefer importing reusable primitives through app wrappers when Next.js integration is needed.

## Data Model

### Resources

- Table: `xplored_resources`
- Core columns:
  - `title`
  - `url`
  - `category`
  - `tags`
  - `tag_line`
  - `explored_tip`
  - `source_type`
  - `status`
  - `thumbnail`

### Insights

- Table: `xplored_insights`
- Core columns:
  - `title`
  - `author`
  - `type`
  - `tags`
  - `tag_line`
  - `explored_tip`
  - `summary`
  - `purchase_url`
  - `thumbnail`
  - `status`

### Image buckets

- `resources-images`
- `insight-images`

## Environment Variables

Required in Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Recommended defaults:

- `SUPABASE_RESOURCE_TABLE=xplored_resources`
- `SUPABASE_INSIGHT_TABLE=xplored_insights`
- `SUPABASE_RESOURCE_IMAGE_BUCKET=resources-images`
- `SUPABASE_INSIGHT_IMAGE_BUCKET=insight-images`

## Notes

- Airtable sync and generated JSON snapshots were removed from the active runtime.
- Storybook is used as the source of truth for reusable UI, while the site consumes the same UI through local wrappers.
