import fs from 'node:fs/promises';
import path from 'node:path';
import Airtable from 'airtable';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data', 'content');

const RESOURCE_FIELDS = [
  'title',
  'url',
  'category',
  'tags',
  'source_type',
  'status',
  'thumbnail',
  'tag_line',
  'tagline',
  'explore_tip',
  'explored_tip',
  'created_at',
  'updated_at',
];

const INSIGHT_FIELDS = [
  'title',
  'url',
  'tags',
  'status',
  'thumbnail',
  'tag_line',
  'explored_tip',
  'summary',
  'author',
  'created_at',
  'updated_at',
];

function parseDotenv(content) {
  const out = {};
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

async function loadEnvFile(fileName) {
  const envPath = path.join(ROOT, fileName);
  try {
    const content = await fs.readFile(envPath, 'utf8');
    const parsed = parseDotenv(content);
    for (const [k, v] of Object.entries(parsed)) {
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // ignore missing env files
  }
}

function mapRecord(record) {
  const fields = record.fields ?? {};
  return {
    id: record.id,
    title: fields.title ?? '',
    url: fields.url ?? '',
    category: fields.category ?? '',
    tags: Array.isArray(fields.tags) ? fields.tags : [],
    sourceType: fields.source_type ?? '',
    status: fields.status === 'Published' ? 'Published' : 'Draft',
    thumbnail: Array.isArray(fields.thumbnail) && fields.thumbnail.length > 0 ? fields.thumbnail[0].url ?? null : null,
    tag_line: fields.tag_line ?? fields.tagline ?? '',
    explore_tip: fields.explore_tip ?? fields.explored_tip ?? '',
    author: fields.author ?? '',
    summary: fields.summary ?? '',
    createdAt: fields.created_at ?? '',
    updatedAt: fields.updated_at ?? '',
  };
}

function getCategories(resources) {
  const CATEGORY_ORDER = ['References', 'AI', 'Assets', 'Platforms', 'Production'];
  const categories = Array.from(new Set(resources.map((r) => r.category).filter(Boolean)));
  return categories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function getTags(resources) {
  return Array.from(
    new Set(resources.flatMap((resource) => resource.tags || []))
  ).sort((a, b) => a.localeCompare(b));
}

async function fetchTable(base, tableName, fields) {
  const records = await base(tableName)
    .select({
      fields,
      filterByFormula: '{status} = "Published"',
      sort: [{ field: 'created_at', direction: 'desc' }],
    })
    .all();

  return records.map(mapRecord);
}

async function writeJson(fileName, value) {
  const target = path.join(DATA_DIR, fileName);
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function main() {
  await loadEnvFile('.env.local');
  await loadEnvFile('.env');

  const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE;
  const resourceTable = process.env.AIRTABLE_RESOURCE_TABLE || 'Resource';
  const insightTable = process.env.AIRTABLE_INSIGHT_TABLE || 'Insight';
  const dryRun = process.argv.includes('--dry-run');

  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable env: AIRTABLE_API_KEY and AIRTABLE_BASE_ID are required.');
  }

  const base = new Airtable({
    apiKey,
    noRetryIfRateLimited: true,
    requestTimeout: 10_000,
  }).base(baseId);

  const [resources, insights] = await Promise.all([
    fetchTable(base, resourceTable, RESOURCE_FIELDS),
    fetchTable(base, insightTable, INSIGHT_FIELDS),
  ]);

  const categories = getCategories(resources);
  const tags = getTags(resources);

  const meta = {
    syncedAt: new Date().toISOString(),
    resourcesCount: resources.length,
    insightsCount: insights.length,
    categoriesCount: categories.length,
    tagsCount: tags.length,
    source: {
      baseId,
      resourceTable,
      insightTable,
    },
  };

  if (dryRun) {
    console.log(JSON.stringify(meta, null, 2));
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await Promise.all([
    writeJson('resources.json', resources),
    writeJson('insights.json', insights),
    writeJson('meta.json', meta),
  ]);

  console.log(`Synced content: resources=${resources.length}, insights=${insights.length}`);
}

main().catch((error) => {
  const anyError = error;
  const statusCode = anyError?.statusCode ? ` status=${anyError.statusCode}` : '';
  const code = anyError?.error ? ` code=${anyError.error}` : '';
  console.error(`Content sync failed.${statusCode}${code} ${error.message}`);
  process.exit(1);
});
