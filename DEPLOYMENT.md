# Vercel Deployment Guide

## Environment Variables

The production site now loads content from Supabase.

Add these variables in Vercel Project Settings -> Environment Variables.

### Required

| Key | Value |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` key |

### Recommended defaults

| Key | Default |
| --- | --- |
| `SUPABASE_RESOURCE_TABLE` | `xplored_resources` |
| `SUPABASE_INSIGHT_TABLE` | `xplored_insights` |
| `SUPABASE_RESOURCE_IMAGE_BUCKET` | `resources-images` |
| `SUPABASE_INSIGHT_IMAGE_BUCKET` | `insight-images` |

Apply them to at least `Production`, and usually `Preview` too.

After saving environment variables, redeploy the project so the live deployment picks them up.

## Thumbnail Rules

Resource thumbnails:

- Table: `xplored_resources`
- Column: `thumbnail`
- If the image is in Supabase Storage, store the exact file name in the row.

Insight thumbnails:

- Table: `xplored_insights`
- Column: `thumbnail`
- If the image is in Supabase Storage, store the exact file name in the row.

If a record already contains a full `https://...` image URL, the app uses that URL directly.
