import Airtable from 'airtable';
import { Resource, AirtableAttachment } from '@/types/resource';

const AIRTABLE_TIMEOUT_MS = 10_000;
const CONFIG_ERROR_MESSAGE =
  'Airtable configuration missing. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.';

function getEnvValue(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

export function isAirtableConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Airtable configuration missing');
}

export function isAirtableRateLimitError(error: unknown): boolean {
  if (error === null || error === undefined) return false;
  const anyError = error as { statusCode?: number; error?: string; message?: string };
  const message = typeof anyError.message === 'string' ? anyError.message : '';
  return (
    anyError.statusCode === 429 ||
    anyError.error === 'TOO_MANY_REQUESTS' ||
    anyError.error === 'PUBLIC_API_BILLING_LIMIT_EXCEEDED' ||
    message.includes('PUBLIC_API_BILLING_LIMIT_EXCEEDED') ||
    message.includes('Too Many Requests') ||
    message.includes('too many requests')
  );
}

function getBase(): Airtable.Base {
  const apiKey = getEnvValue(['AIRTABLE_API_KEY', 'AIRTABLE_TOKEN', 'AIRTABLE_PAT']);
  const baseId = getEnvValue(['AIRTABLE_BASE_ID', 'AIRTABLE_BASE']);
  if (!apiKey || !baseId) {
    throw new Error(CONFIG_ERROR_MESSAGE);
  }
  return new Airtable({
    apiKey,
    noRetryIfRateLimited: true,
    requestTimeout: AIRTABLE_TIMEOUT_MS,
  }).base(baseId);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Airtable request timed out after ${ms}ms`)), ms)
    ),
  ]);
}

const TABLE_NAME = process.env.AIRTABLE_RESOURCE_TABLE || 'Resource';
const INSIGHT_TABLE_NAME = process.env.AIRTABLE_INSIGHT_TABLE || 'Insight';

interface AirtableRecord {
  id: string;
  fields: {
    title?: string;
    url?: string;
    category?: string;
    tags?: string[];
    source_type?: string;
    status?: string;
    thumbnail?: AirtableAttachment[];
    tag_line?: string;
    tagline?: string; // Airtable schema uses "tagline"
    explore_tip?: string;
    explored_tip?: string; // Airtable schema uses "explored_tip"
    created_at?: string;
    updated_at?: string;
  };
}

interface InsightAirtableRecord {
  id: string;
  fields: {
    title?: string;
    url?: string;
    tags?: string[];
    status?: string;
    thumbnail?: AirtableAttachment[];
    tag_line?: string;
    explored_tip?: string;
    summary?: string;
    author?: string;
    created_at?: string;
    updated_at?: string;
  };
}

function mapRecordToResource(record: AirtableRecord): Resource {
  const fields = record.fields;
  return {
    id: record.id,
    title: fields.title || '',
    url: fields.url || '',
    category: fields.category || '',
    tags: fields.tags || [],
    sourceType: fields.source_type || '',
    status: (fields.status as 'Published' | 'Draft') || 'Draft',
    thumbnail: fields.thumbnail?.[0]?.url || null,
    tag_line: fields.tag_line || fields.tagline,
    explore_tip: fields.explore_tip || fields.explored_tip,
    createdAt: fields.created_at || '',
    updatedAt: fields.updated_at || '',
  };
}

function mapInsightRecordToResource(record: InsightAirtableRecord): Resource {
  const fields = record.fields;
  return {
    id: record.id,
    title: fields.title || '',
    url: fields.url || '',
    category: '',
    tags: fields.tags || [],
    sourceType: '',
    status: (fields.status as 'Published' | 'Draft') || 'Draft',
    thumbnail: fields.thumbnail?.[0]?.url || null,
    tag_line: fields.tag_line,
    explore_tip: fields.explored_tip,
    author: fields.author,
    summary: fields.summary,
    createdAt: fields.created_at || '',
    updatedAt: fields.updated_at || '',
  };
}

export async function getResources(category?: string): Promise<Resource[]> {
  const base = getBase();
  const filterFormula = category && category !== 'All'
    ? `AND({status} = "Published", {category} = "${category}")`
    : '{status} = "Published"';

  const records = await withTimeout(
    base(TABLE_NAME)
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: 'created_at', direction: 'desc' }],
      })
      .all(),
    AIRTABLE_TIMEOUT_MS
  );

  return records.map((record) => mapRecordToResource(record as unknown as AirtableRecord));
}

export async function getInsights(): Promise<Resource[]> {
  const base = getBase();
  const records = await withTimeout(
    base(INSIGHT_TABLE_NAME)
      .select({
        filterByFormula: '{status} = "Published"',
        sort: [{ field: 'created_at', direction: 'desc' }],
      })
      .all(),
    AIRTABLE_TIMEOUT_MS
  );

  return records.map((record) => mapInsightRecordToResource(record as unknown as InsightAirtableRecord));
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const base = getBase();
  try {
    const record = await withTimeout(
      base(TABLE_NAME).find(id),
      AIRTABLE_TIMEOUT_MS
    );
    return mapRecordToResource(record as unknown as AirtableRecord);
  } catch (error) {
    if (isAirtableConfigError(error)) throw error;
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  const base = getBase();
  const records = await withTimeout(
    base(TABLE_NAME)
      .select({
        filterByFormula: '{status} = "Published"',
        fields: ['category'],
      })
      .all(),
    AIRTABLE_TIMEOUT_MS
  );

  const categories = new Set<string>();
  records.forEach((record) => {
    const category = record.fields.category as string | undefined;
    if (category) {
      categories.add(category);
    }
  });

  const CATEGORY_ORDER = ['References', 'AI', 'Assets', 'Platforms', 'Production'];
  return Array.from(categories).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export async function searchResources(query: string): Promise<Resource[]> {
  const base = getBase();
  const searchLower = query.toLowerCase();

  const records = await withTimeout(
    base(TABLE_NAME)
      .select({
        filterByFormula: '{status} = "Published"',
        sort: [{ field: 'created_at', direction: 'desc' }],
      })
      .all(),
    AIRTABLE_TIMEOUT_MS
  );

  return records
    .filter((record) => {
      const fields = record.fields as AirtableRecord['fields'];
      const title = (fields.title || '').toLowerCase();
      const tags = (fields.tags || []).map((t: string) => t.toLowerCase());
      const category = (fields.category || '').toLowerCase();

      return (
        title.includes(searchLower) ||
        tags.some((tag: string) => tag.includes(searchLower)) ||
        category.includes(searchLower)
      );
    })
    .map((record) => mapRecordToResource(record as unknown as AirtableRecord));
}

export async function getAllTags(): Promise<string[]> {
  const base = getBase();
  const records = await withTimeout(
    base(TABLE_NAME)
      .select({
        filterByFormula: '{status} = "Published"',
        fields: ['tags'],
      })
      .all(),
    AIRTABLE_TIMEOUT_MS
  );

  const tags = new Set<string>();
  records.forEach((record) => {
    const recordTags = record.fields.tags as string[] | undefined;
    if (recordTags) {
      recordTags.forEach((tag: string) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}
