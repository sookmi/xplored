import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Resource } from '@/types/resource';

const CATEGORY_ORDER = ['References', 'AI', 'Assets', 'Platforms', 'Production'];
const SUPABASE_TIMEOUT_MS = 10_000;
const SUPABASE_CONFIG_ERROR_MESSAGE =
  'Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).';
const RESOURCE_TABLE_NAME = process.env.SUPABASE_RESOURCE_TABLE || 'xplored_resources';
const INSIGHT_TABLE_NAME = process.env.SUPABASE_INSIGHT_TABLE || 'xplored_insights';
const RESOURCE_IMAGE_BUCKET = process.env.SUPABASE_RESOURCE_IMAGE_BUCKET || 'resources-images';
const INSIGHT_IMAGE_BUCKET = process.env.SUPABASE_INSIGHT_IMAGE_BUCKET || 'insight-images';
const RESOURCE_COLUMNS =
  'id, title, tag_line, explored_tip, url, category, tags, source_type, status, thumbnail, created_at, updated_at';
const INSIGHT_COLUMNS =
  'id, title, author, type, tags, tag_line, explored_tip, summary, purchase_url, thumbnail, status, created_at, updated_at';

interface SupabaseResourceRow {
  id: number;
  title: string | null;
  tag_line: string | null;
  explored_tip: string | null;
  url: string | null;
  category: string | null;
  tags: string[] | string | null;
  source_type: string | null;
  status: string | null;
  thumbnail?: string | null;
  thumbnail_url?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface SupabaseInsightRow {
  id: number;
  title: string | null;
  author: string | null;
  type: string | null;
  tags: string[] | string | null;
  tag_line: string | null;
  explored_tip: unknown;
  summary: string | null;
  purchase_url: string | null;
  thumbnail: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

function getEnvValue(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

function getSupabaseClient() {
  const supabaseUrl = getEnvValue(['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL']);
  const supabaseKey = getEnvValue([
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]);

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(SUPABASE_CONFIG_ERROR_MESSAGE);
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Supabase request timed out after ${ms}ms`)), ms);
    }),
  ]);
}

function parsePostgresArrayLiteral(value: string): string[] {
  return value
    .slice(1, -1)
    .split(',')
    .map((item) => item.replace(/^"(.*)"$/, '$1').trim())
    .filter(Boolean);
}

function parseTags(value: string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return parsePostgresArrayLiteral(trimmed);
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => String(tag).trim()).filter(Boolean);
      }
    } catch {
      // Keep falling back to simple parsing when the value is a label like "[Ref] System".
    }
  }

  return trimmed.split(/\s*,\s*/).filter(Boolean);
}

function normalizeThumbnailUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const wrappedUrlMatch = trimmed.match(/\((https?:\/\/[^)]+)\)/i);
  if (wrappedUrlMatch) {
    return wrappedUrlMatch[1];
  }

  const embeddedUrlMatch = trimmed.match(/https?:\/\/\S+/i);
  if (embeddedUrlMatch) {
    return embeddedUrlMatch[0];
  }

  return null;
}

function buildPublicStorageUrl(bucket: string, fileName: string): string | null {
  const supabaseUrl = getEnvValue(['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL']);
  if (!supabaseUrl || !bucket || !fileName) return null;

  return `${supabaseUrl.replace(/\/+$/g, '')}/storage/v1/object/public/${bucket}/${encodeURIComponent(fileName)}`;
}

function extractThumbnailFileName(value: string | null | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  const fileNameMatch = trimmed.match(/^([^()]+?\.(?:png|jpe?g|webp|gif|svg))/i);
  if (fileNameMatch) {
    return fileNameMatch[1].trim();
  }

  const directUrlMatch = trimmed.match(/https?:\/\/\S+/i);
  if (directUrlMatch) {
    try {
      const url = new URL(directUrlMatch[0].replace(/\)+$/, ''));
      const lastSegment = url.pathname.split('/').pop();
      return lastSegment ? decodeURIComponent(lastSegment) : '';
    } catch {
      // Fall through to other heuristics.
    }
  }

  return '';
}

function resolveThumbnail(bucket: string, value: string | null | undefined): string | null {
  const normalizedUrl = normalizeThumbnailUrl(value);

  // Keep direct image URLs as-is instead of guessing a mirrored storage path.
  if (normalizedUrl && /^https?:\/\//i.test(value?.trim() || '')) {
    return normalizedUrl;
  }

  const fileName = extractThumbnailFileName(value);
  return buildPublicStorageUrl(bucket, fileName) || normalizedUrl;
}

function mapResource(row: SupabaseResourceRow): Resource {
  const resourceBucketThumbnail = resolveThumbnail(
    RESOURCE_IMAGE_BUCKET,
    row.thumbnail || row.thumbnail_url
  );

  return {
    id: String(row.id),
    title: row.title || '',
    url: row.url || '',
    category: row.category || '',
    tags: parseTags(row.tags),
    sourceType: row.source_type || '',
    status: (row.status as Resource['status']) || 'Draft',
    thumbnail: resourceBucketThumbnail,
    tag_line: row.tag_line || undefined,
    explore_tip: row.explored_tip || undefined,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  };
}

const getPublishedResources = cache(async (): Promise<Resource[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await withTimeout(
    supabase
      .from(RESOURCE_TABLE_NAME)
      .select(RESOURCE_COLUMNS)
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .then((result) => ({
        data: (result.data as SupabaseResourceRow[] | null) || null,
        error: result.error,
      })),
    SUPABASE_TIMEOUT_MS
  );

  if (error) throw error;

  return ((data as SupabaseResourceRow[] | null) || []).map(mapResource);
});

function normalizeExploreTip(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value || undefined;
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return undefined;
}

function mapInsight(row: SupabaseInsightRow): Resource {
  const insightBucketThumbnail = resolveThumbnail(INSIGHT_IMAGE_BUCKET, row.thumbnail);

  return {
    id: String(row.id),
    title: row.title || '',
    url: row.purchase_url || '',
    category: '',
    tags: parseTags(row.tags),
    sourceType: row.type || '',
    status: (row.status as Resource['status']) || 'Draft',
    thumbnail: insightBucketThumbnail,
    tag_line: row.tag_line || undefined,
    explore_tip: normalizeExploreTip(row.explored_tip),
    author: row.author || undefined,
    summary: row.summary || undefined,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  };
}

const getPublishedInsights = cache(async (): Promise<Resource[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await withTimeout(
    supabase
      .from(INSIGHT_TABLE_NAME)
      .select(INSIGHT_COLUMNS)
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .then((result) => ({
        data: (result.data as SupabaseInsightRow[] | null) || null,
        error: result.error,
      })),
    SUPABASE_TIMEOUT_MS
  );

  if (error) throw error;

  return (data || []).map(mapInsight);
});

export function isAirtableConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Supabase configuration missing');
}

export function isAirtableRateLimitError(error: unknown): boolean {
  if (error === null || error === undefined) return false;

  const maybeError = error as { code?: string; message?: string; details?: string };
  const message = typeof maybeError.message === 'string' ? maybeError.message : '';
  const details = typeof maybeError.details === 'string' ? maybeError.details : '';

  return (
    maybeError.code === '429' ||
    message.includes('Too Many Requests') ||
    message.includes('rate limit') ||
    details.includes('rate limit')
  );
}

export async function getResources(category?: string): Promise<Resource[]> {
  const resources = await getPublishedResources();
  if (!category || category === 'All') return resources;
  return resources.filter((resource) => resource.category === category);
}

export async function getInsights(): Promise<Resource[]> {
  return getPublishedInsights();
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const resources = await getPublishedResources();
  return resources.find((resource) => resource.id === id) ?? null;
}

export async function getCategories(): Promise<string[]> {
  const resources = await getPublishedResources();
  const categories = new Set<string>();

  resources.forEach((resource) => {
    if (resource.category) categories.add(resource.category);
  });

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
  const resources = await getPublishedResources();
  const searchLower = query.toLowerCase();

  return resources.filter((resource) => {
    const title = (resource.title || '').toLowerCase();
    const tags = (resource.tags || []).map((tag) => tag.toLowerCase());
    const category = (resource.category || '').toLowerCase();

    return (
      title.includes(searchLower) ||
      tags.some((tag) => tag.includes(searchLower)) ||
      category.includes(searchLower)
    );
  });
}

export async function getAllTags(): Promise<string[]> {
  const resources = await getPublishedResources();
  const tags = new Set<string>();

  resources.forEach((resource) => {
    (resource.tags || []).forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
