import Airtable from 'airtable';
import { Resource, AirtableAttachment } from '@/types/resource';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

const TABLE_NAME = 'Resource';
const INSIGHT_TABLE_NAME = 'Insight';

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
    explore_tip?: string;
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
    tag_line: fields.tag_line,
    explore_tip: fields.explore_tip,
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
    createdAt: fields.created_at || '',
    updatedAt: fields.updated_at || '',
  };
}

export async function getResources(category?: string): Promise<Resource[]> {
  const filterFormula = category && category !== 'All'
    ? `AND({status} = "Published", {category} = "${category}")`
    : '{status} = "Published"';

  const records = await base(TABLE_NAME)
    .select({
      filterByFormula: filterFormula,
      sort: [{ field: 'created_at', direction: 'desc' }],
    })
    .all();

  return records.map((record) => mapRecordToResource(record as unknown as AirtableRecord));
}

export async function getInsights(): Promise<Resource[]> {
  const records = await base(INSIGHT_TABLE_NAME)
    .select({
      filterByFormula: '{status} = "Published"',
      sort: [{ field: 'created_at', direction: 'desc' }],
    })
    .all();

  return records.map((record) => mapInsightRecordToResource(record as unknown as InsightAirtableRecord));
}

export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const record = await base(TABLE_NAME).find(id);
    return mapRecordToResource(record as unknown as AirtableRecord);
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  const records = await base(TABLE_NAME)
    .select({
      filterByFormula: '{status} = "Published"',
      fields: ['category'],
    })
    .all();

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
  const searchLower = query.toLowerCase();

  const records = await base(TABLE_NAME)
    .select({
      filterByFormula: '{status} = "Published"',
      sort: [{ field: 'created_at', direction: 'desc' }],
    })
    .all();

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
  const records = await base(TABLE_NAME)
    .select({
      filterByFormula: '{status} = "Published"',
      fields: ['tags'],
    })
    .all();

  const tags = new Set<string>();
  records.forEach((record) => {
    const recordTags = record.fields.tags as string[] | undefined;
    if (recordTags) {
      recordTags.forEach((tag: string) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

