#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline');
const { setTimeout: delay } = require('node:timers/promises');

const ROOT = process.cwd();

const DEFAULT_TABLE = 'xplored_resources';
const DEFAULT_ID_COLUMN = 'id';
const DEFAULT_SOURCE_COLUMN = 'thumbnail_url';
const DEFAULT_TARGET_COLUMN = 'thumbnail_url';
const DEFAULT_BUCKET = 'resources-images';
const DEFAULT_PATH_PREFIX = '';
const DEFAULT_PAGE_SIZE = 200;
const DEFAULT_CONCURRENCY = 4;
const DEFAULT_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_CONCURRENCY = 12;
const MAX_PAGE_SIZE = 1_000;

const HELP_TEXT = `
Migrate image URLs from a Supabase table into Supabase Storage.

Usage:
  node components/migrate-images.js [options]
  npm run migrate-images -- [options]

Defaults:
  table=xplored_resources
  id-column=id
  source-column=thumbnail_url
  target-column=thumbnail_url
  filename=resources-\${id}.jpg

Options:
  --table=xplored_resources          Table to read and update
  --id-column=id                     Primary key column name
  --source-column=thumbnail_url      Source image URL column
  --target-column=thumbnail_url      Column to overwrite with the Storage URL
  --bucket=resources-images          Supabase Storage bucket name
  --path-prefix=                     Optional folder prefix in the bucket
  --page-size=200                    Rows fetched per page (max ${MAX_PAGE_SIZE})
  --concurrency=4                    Parallel uploads (1-${MAX_CONCURRENCY})
  --retries=3                        Retries per step for retryable failures
  --timeout-ms=15000                 Timeout per network step
  --limit=25                         Only process the first N rows
  --force                            Re-upload even if the URL already points at Supabase Storage
  --dry-run                          Show what would happen without uploading or updating
  --verbose                          Print successful rows as they complete
  --report=data/content/migrate-images-report.json
                                     Save a JSON summary report
  --no-color                         Disable ANSI colors
  --help                             Show this message

Environment:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY
  SUPABASE_STORAGE_BUCKET
  SUPABASE_STORAGE_PREFIX

Examples:
  npm run migrate-images -- --dry-run --limit=10
  npm run migrate-images -- --bucket=resources-images
  npm run migrate-images -- --path-prefix=resources --report=data/content/migrate-images-report.json
`.trim();

class AppError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = options.name || 'AppError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.retryable = Boolean(options.retryable);
    this.details = options.details;
    this.cause = options.cause;
  }
}

function parseDotenv(content) {
  const out = {};

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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

    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Missing env files are allowed.
  }
}

async function loadEnv() {
  await loadEnvFile('.env.local');
  await loadEnvFile('.env');
}

function parseArgs(argv) {
  const options = {};

  for (const rawArg of argv) {
    if (!rawArg.startsWith('--')) continue;

    if (rawArg === '--help') {
      options.help = true;
      continue;
    }

    if (rawArg.startsWith('--no-')) {
      options[rawArg.slice(5)] = false;
      continue;
    }

    const eqIndex = rawArg.indexOf('=');

    if (eqIndex === -1) {
      options[rawArg.slice(2)] = true;
      continue;
    }

    const key = rawArg.slice(2, eqIndex);
    const value = rawArg.slice(eqIndex + 1);
    options[key] = value;
  }

  return options;
}

function toNumber(value, fallback, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = {}) {
  if (value === undefined || value === null || value === '') return fallback;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(numericValue)));
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return fallback;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const formatted = value >= 100 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 1_000) {
    return `${Math.max(0, Math.round(ms || 0))}ms`;
  }

  const seconds = ms / 1_000;
  if (seconds < 60) {
    return `${seconds.toFixed(seconds >= 10 ? 1 : 2)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainderSeconds}s`;
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function pickEnv(...keys) {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  return undefined;
}

function buildConfig(options) {
  return {
    help: Boolean(options.help),
    dryRun: toBoolean(options['dry-run'], false),
    verbose: toBoolean(options.verbose, false),
    force: toBoolean(options.force, false),
    color: options.color === false ? false : !toBoolean(options['no-color'], false),
    supabaseUrl: pickEnv('SUPABASE_URL'),
    supabaseKey: pickEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_KEY'),
    table: options.table || DEFAULT_TABLE,
    idColumn: options['id-column'] || DEFAULT_ID_COLUMN,
    sourceColumn: options['source-column'] || DEFAULT_SOURCE_COLUMN,
    targetColumn: options['target-column'] || DEFAULT_TARGET_COLUMN,
    bucket: options.bucket || process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET,
    pathPrefix: options['path-prefix'] ?? process.env.SUPABASE_STORAGE_PREFIX ?? DEFAULT_PATH_PREFIX,
    pageSize: toNumber(options['page-size'], DEFAULT_PAGE_SIZE, { min: 1, max: MAX_PAGE_SIZE }),
    concurrency: toNumber(options.concurrency, DEFAULT_CONCURRENCY, { min: 1, max: MAX_CONCURRENCY }),
    retries: toNumber(options.retries, DEFAULT_RETRIES, { min: 0, max: 10 }),
    timeoutMs: toNumber(options['timeout-ms'], DEFAULT_TIMEOUT_MS, { min: 1_000, max: 120_000 }),
    limit: toNumber(options.limit, 0, { min: 0, max: 100_000 }),
    reportPath: options.report ? path.resolve(ROOT, options.report) : '',
  };
}

function validateConfig(config) {
  const missing = [];

  if (!config.supabaseUrl) missing.push('SUPABASE_URL');
  if (!config.supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!config.table) missing.push('table');
  if (!config.idColumn) missing.push('id-column');
  if (!config.sourceColumn) missing.push('source-column');
  if (!config.targetColumn) missing.push('target-column');
  if (!config.bucket) missing.push('SUPABASE_STORAGE_BUCKET');

  if (missing.length > 0) {
    throw new AppError(`Missing required configuration: ${missing.join(', ')}`, {
      name: 'ConfigError',
      code: 'MISSING_CONFIG',
    });
  }
}

function supportsColor(config) {
  return config.color && process.stdout.isTTY && !process.env.NO_COLOR;
}

function createLogger(config) {
  const useColor = supportsColor(config);
  let liveActive = false;

  const palette = {
    dim: useColor ? '\x1b[2m' : '',
    cyan: useColor ? '\x1b[36m' : '',
    blue: useColor ? '\x1b[34m' : '',
    green: useColor ? '\x1b[32m' : '',
    yellow: useColor ? '\x1b[33m' : '',
    red: useColor ? '\x1b[31m' : '',
    bold: useColor ? '\x1b[1m' : '',
    reset: useColor ? '\x1b[0m' : '',
  };

  function paint(color, message) {
    return `${palette[color] || ''}${message}${palette.reset}`;
  }

  function clearLiveLine() {
    if (!liveActive || !process.stdout.isTTY) return;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    liveActive = false;
  }

  function writeLine(line = '') {
    clearLiveLine();
    process.stdout.write(`${line}\n`);
  }

  function renderBar(completed, total) {
    const width = 24;
    const ratio = total === 0 ? 0 : completed / total;
    const filled = Math.round(width * ratio);
    const empty = Math.max(0, width - filled);
    return `${'='.repeat(filled)}${'-'.repeat(empty)}`;
  }

  function formatProgress(stats, activeLabel = '') {
    const progress = `[${renderBar(stats.processed, stats.total)}] ${stats.processed}/${stats.total}`;
    const counters = `ok:${stats.uploaded} skip:${stats.skipped} fail:${stats.failed} retry:${stats.retried}`;
    const extras = `updated:${stats.updated} data:${formatBytes(stats.bytesUploaded)}`;
    const suffix = activeLabel ? ` ${paint('dim', activeLabel)}` : '';
    return `${paint('cyan', progress)} ${counters} ${paint('dim', extras)}${suffix}`;
  }

  return {
    section(title, details = '') {
      writeLine(`${paint('bold', title)}${details ? ` ${paint('dim', details)}` : ''}`);
    },
    info(message) {
      writeLine(`${paint('blue', 'INFO')} ${message}`);
    },
    success(message) {
      writeLine(`${paint('green', 'OK')} ${message}`);
    },
    warn(message) {
      writeLine(`${paint('yellow', 'WARN')} ${message}`);
    },
    error(message) {
      writeLine(`${paint('red', 'FAIL')} ${message}`);
    },
    updateProgress(stats, activeLabel = '') {
      if (!process.stdout.isTTY) {
        if (!stats.total || stats.processed === stats.total || stats.processed % 10 === 0) {
          writeLine(formatProgress(stats, activeLabel));
        }
        return;
      }

      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(formatProgress(stats, activeLabel));
      liveActive = true;
    },
    flushProgress(stats, label = '') {
      writeLine(formatProgress(stats, label));
    },
  };
}

function isRetryableStatus(statusCode) {
  return statusCode === 408 || statusCode === 409 || statusCode === 425 || statusCode === 429 || statusCode >= 500;
}

function isRetryableErrorShape(error) {
  if (!error || typeof error !== 'object') return false;
  if (error.retryable) return true;
  if (typeof error.statusCode === 'number' && isRetryableStatus(error.statusCode)) return true;
  const code = String(error.code || '').toUpperCase();
  return ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'UND_ERR_CONNECT_TIMEOUT'].includes(code);
}

function toAppError(error, contextMessage = 'Unexpected failure') {
  if (error instanceof AppError) return error;

  const message = error instanceof Error ? error.message : String(error);
  const code = error && typeof error === 'object' ? error.code : undefined;
  const statusCode = error && typeof error === 'object' ? error.statusCode : undefined;

  return new AppError(`${contextMessage}: ${message}`, {
    code,
    statusCode,
    retryable: isRetryableErrorShape(error),
    cause: error,
  });
}

async function withTimeout(promiseFactory, timeoutMs, timeoutMessage, options = {}) {
  const { abortable = true, retryableOnTimeout = true } = options;
  const controller = new AbortController();
  let timer;
  const taskPromise = Promise.resolve().then(() => promiseFactory(controller.signal));
  taskPromise.catch(() => {});

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      if (abortable) {
        controller.abort();
      }

      reject(
        new AppError(timeoutMessage, {
          name: 'TimeoutError',
          code: 'TIMEOUT',
          retryable: retryableOnTimeout,
        })
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([taskPromise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

async function withRetries(task, options) {
  const {
    retries,
    label,
    onRetry,
    baseDelayMs = 500,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await task(attempt + 1);
    } catch (error) {
      const appError = toAppError(error, label);
      const canRetry = appError.retryable && attempt < retries;

      if (!canRetry) {
        throw appError;
      }

      attempt += 1;
      const waitMs = baseDelayMs * 2 ** (attempt - 1);

      if (onRetry) {
        onRetry(appError, attempt, waitMs);
      }

      await delay(waitMs);
    }
  }
}

function buildStoragePath(id, config) {
  const filename = `resources-${String(id)}.jpg`;
  return config.pathPrefix ? `${config.pathPrefix.replace(/\/+$/g, '')}/${filename}` : filename;
}

function buildPublicUrlPrefix(config) {
  return `${config.supabaseUrl.replace(/\/+$/g, '')}/storage/v1/object/public/${config.bucket}/`;
}

function isManagedStorageUrl(url, config) {
  return typeof url === 'string' && url.startsWith(buildPublicUrlPrefix(config));
}

function extractImageUrl(value) {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/https?:\/\/[^\s)]+/i);
  return match ? match[0] : '';
}

async function fetchRowsPage(supabase, config, pageIndex) {
  const from = pageIndex * config.pageSize;
  const to = from + config.pageSize - 1;
  const columns = [config.idColumn, config.sourceColumn];
  const selectColumns = Array.from(new Set(columns)).join(', ');

  return withRetries(
    async () => {
      const query = supabase
        .from(config.table)
        .select(selectColumns, { count: pageIndex === 0 ? 'exact' : undefined })
        .not(config.sourceColumn, 'is', null)
        .neq(config.sourceColumn, '')
        .range(from, to);

      const { data, error, count } = await withTimeout(
        () => query,
        config.timeoutMs,
        `Timed out while reading rows ${from}-${to} from ${config.table}`,
        {
          abortable: false,
        }
      );

      if (error) {
        throw new AppError(`Table read failed: ${error.message}`, {
          name: 'SelectError',
          code: error.code || 'SUPABASE_SELECT_FAILED',
          statusCode: error.status || error.statusCode,
          retryable: isRetryableStatus(error.status || error.statusCode),
          details: error,
        });
      }

      return {
        rows: Array.isArray(data) ? data : [],
        count: typeof count === 'number' ? count : null,
      };
    },
    {
      retries: config.retries,
      label: `fetch page ${pageIndex + 1}`,
    }
  );
}

async function fetchRows(supabase, config, logger) {
  const rows = [];
  let totalCount = null;
  let pageIndex = 0;

  while (true) {
    const { rows: pageRows, count } = await fetchRowsPage(supabase, config, pageIndex);

    if (totalCount === null && typeof count === 'number') {
      totalCount = count;
      logger.info(`Found ${count} ${pluralize(count, 'row')} with a non-empty ${config.sourceColumn}`);
    }

    if (pageRows.length === 0) {
      break;
    }

    rows.push(...pageRows);

    if (pageRows.length < config.pageSize) {
      break;
    }

    pageIndex += 1;
  }

  return rows;
}

function buildJobs(rows, config) {
  const jobs = [];
  const skippedRows = [];

  for (const row of rows) {
    const rawId = row[config.idColumn];
    const id = rawId === undefined || rawId === null ? rawId : String(rawId);
    const rawSourceValue = typeof row[config.sourceColumn] === 'string' ? row[config.sourceColumn].trim() : row[config.sourceColumn];
    const sourceUrl = extractImageUrl(rawSourceValue);

    if (id === undefined || id === null || id === '') {
      skippedRows.push({
        id: '',
        sourceUrl: rawSourceValue || '',
        reason: `missing ${config.idColumn}`,
      });
      continue;
    }

    if (typeof rawSourceValue !== 'string' || !rawSourceValue.trim()) {
      skippedRows.push({
        id,
        sourceUrl: '',
        reason: `${config.sourceColumn} is empty`,
      });
      continue;
    }

    if (!sourceUrl) {
      skippedRows.push({
        id,
        sourceUrl: rawSourceValue,
        reason: `${config.sourceColumn} does not contain a valid http(s) URL`,
      });
      continue;
    }

    if (!config.force && isManagedStorageUrl(sourceUrl, config)) {
      skippedRows.push({
        id,
        sourceUrl: rawSourceValue,
        reason: `${config.sourceColumn} already points to this Supabase Storage bucket`,
      });
      continue;
    }

    jobs.push({
      id,
      rawId,
      rawSourceValue,
      sourceUrl,
    });
  }

  return {
    jobs: config.limit > 0 ? jobs.slice(0, config.limit) : jobs,
    skippedRows,
  };
}

async function downloadImage(job, config) {
  return withTimeout(
    async (signal) => {
      const response = await fetch(job.sourceUrl, { signal });

      if (!response.ok) {
        throw new AppError(`Download failed with HTTP ${response.status}`, {
          name: 'DownloadError',
          code: 'DOWNLOAD_FAILED',
          statusCode: response.status,
          retryable: isRetryableStatus(response.status),
        });
      }

      const arrayBuffer = await response.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        bytes: Number(response.headers.get('content-length')) || arrayBuffer.byteLength || 0,
        contentType: response.headers.get('content-type') || 'application/octet-stream',
      };
    },
    config.timeoutMs,
    `Timed out while downloading row ${job.id}`
  );
}

async function uploadImage(supabase, job, payload, config) {
  const storagePath = buildStoragePath(job.id, config);

  const { error } = await withTimeout(
    () =>
      supabase.storage.from(config.bucket).upload(storagePath, payload.buffer, {
        cacheControl: '31536000',
        contentType: payload.contentType,
        upsert: true,
      }),
    config.timeoutMs,
    `Timed out while uploading row ${job.id}`,
    {
      abortable: false,
    }
  );

  if (error) {
    throw new AppError(`Upload failed: ${error.message}`, {
      name: 'UploadError',
      code: error.code || error.error || 'SUPABASE_UPLOAD_FAILED',
      statusCode: error.statusCode || error.status,
      retryable: isRetryableStatus(error.statusCode || error.status),
      details: error,
    });
  }

  return {
    storagePath,
    publicUrl: `${buildPublicUrlPrefix(config)}${storagePath}`,
    bytes: payload.bytes,
  };
}

async function updateRow(supabase, job, publicUrl, config) {
  const { error } = await withTimeout(
    () =>
      supabase
        .from(config.table)
        .update({ [config.targetColumn]: publicUrl })
        .eq(config.idColumn, job.rawId),
    config.timeoutMs,
    `Timed out while updating row ${job.id}`,
    {
      abortable: false,
    }
  );

  if (error) {
    throw new AppError(`Row update failed: ${error.message}`, {
      name: 'UpdateError',
      code: error.code || 'SUPABASE_UPDATE_FAILED',
      statusCode: error.status || error.statusCode,
      retryable: isRetryableStatus(error.status || error.statusCode),
      details: error,
    });
  }
}

function createSummary(total, skippedRows) {
  return {
    total,
    processed: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    updated: 0,
    retried: 0,
    bytesUploaded: 0,
    startedAt: Date.now(),
    skippedRows,
    failures: [],
    uploadedItems: [],
  };
}

async function runPool(items, worker, concurrency) {
  const iterator = items[Symbol.iterator]();
  const workers = Array.from({ length: Math.min(concurrency, items.length || 1) }, async () => {
    while (true) {
      const next = iterator.next();
      if (next.done) return;
      await worker(next.value);
    }
  });

  await Promise.all(workers);
}

function buildReport(config, summary) {
  const finishedAt = Date.now();
  return {
    config: {
      table: config.table,
      idColumn: config.idColumn,
      sourceColumn: config.sourceColumn,
      targetColumn: config.targetColumn,
      bucket: config.bucket,
      pathPrefix: config.pathPrefix,
      dryRun: config.dryRun,
      limit: config.limit,
      pageSize: config.pageSize,
      concurrency: config.concurrency,
      retries: config.retries,
      timeoutMs: config.timeoutMs,
    },
    summary: {
      total: summary.total,
      processed: summary.processed,
      uploaded: summary.uploaded,
      skipped: summary.skipped,
      failed: summary.failed,
      updated: summary.updated,
      retried: summary.retried,
      bytesUploaded: summary.bytesUploaded,
      durationMs: finishedAt - summary.startedAt,
    },
    skippedRows: summary.skippedRows,
    failures: summary.failures,
    uploadedItems: summary.uploadedItems,
  };
}

async function writeReport(reportPath, report, logger) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  logger.success(`Saved report to ${path.relative(ROOT, reportPath)}`);
}

async function migrateImages(config) {
  const logger = createLogger(config);
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  logger.section('Supabase Table -> Supabase Storage Migration');
  logger.info(`Table: ${config.table}`);
  logger.info(`Source column: ${config.sourceColumn}`);
  logger.info(`Target column: ${config.targetColumn}`);
  logger.info(`Bucket: ${config.bucket}${config.pathPrefix ? `/${config.pathPrefix}` : ''}`);
  logger.info(
    `Mode: ${config.dryRun ? 'dry-run' : 'live'} | concurrency=${config.concurrency} | retries=${config.retries} | timeout=${config.timeoutMs}ms`
  );

  const rows = await fetchRows(supabase, config, logger);
  const { jobs, skippedRows } = buildJobs(rows, config);
  const summary = createSummary(jobs.length, skippedRows);
  const downloadCache = new Map();

  if (skippedRows.length > 0) {
    logger.warn(`Pre-skipped ${skippedRows.length} ${pluralize(skippedRows.length, 'row')}`);
  }

  if (jobs.length === 0) {
    logger.warn('No rows found to migrate.');
    const report = buildReport(config, summary);
    if (config.reportPath) {
      await writeReport(config.reportPath, report, logger);
    }
    return report;
  }

  logger.section('Processing', `${jobs.length} ${pluralize(jobs.length, 'row')}`);
  logger.updateProgress(summary);

  await runPool(
    jobs,
    async (job) => {
      const rowLabel = `row ${job.id}`;

      try {
        const result = await withRetries(
          async () => {
            if (config.dryRun) {
              const storagePath = buildStoragePath(job.id, config);
              return {
                storagePath,
                publicUrl: `${buildPublicUrlPrefix(config)}${storagePath}`,
                bytes: 0,
                updated: false,
              };
            }

            let payloadPromise = downloadCache.get(job.sourceUrl);
            if (!payloadPromise) {
              payloadPromise = withRetries(
                () => downloadImage(job, config),
                {
                  retries: config.retries,
                  label: `download ${rowLabel}`,
                  onRetry(error, attempt, waitMs) {
                    summary.retried += 1;
                    logger.warn(`Retrying download for ${rowLabel} (${attempt}/${config.retries}) in ${waitMs}ms: ${error.message}`);
                  },
                }
              ).catch((error) => {
                downloadCache.delete(job.sourceUrl);
                throw error;
              });
              downloadCache.set(job.sourceUrl, payloadPromise);
            }

            const payload = await payloadPromise;

            const uploadResult = await withRetries(
              () => uploadImage(supabase, job, payload, config),
              {
                retries: config.retries,
                label: `upload ${rowLabel}`,
                onRetry(error, attempt, waitMs) {
                  summary.retried += 1;
                  logger.warn(`Retrying upload for ${rowLabel} (${attempt}/${config.retries}) in ${waitMs}ms: ${error.message}`);
                },
              }
            );

            await withRetries(
              () => updateRow(supabase, job, uploadResult.publicUrl, config),
              {
                retries: config.retries,
                label: `update ${rowLabel}`,
                onRetry(error, attempt, waitMs) {
                  summary.retried += 1;
                  logger.warn(`Retrying row update for ${rowLabel} (${attempt}/${config.retries}) in ${waitMs}ms: ${error.message}`);
                },
              }
            );

            return {
              ...uploadResult,
              updated: true,
            };
          },
          {
            retries: 0,
            label: rowLabel,
          }
        );

        summary.processed += 1;
        summary.uploaded += 1;
        summary.updated += result.updated ? 1 : 0;
        summary.bytesUploaded += config.dryRun ? 0 : result.bytes;
        summary.uploadedItems.push({
          id: job.id,
          sourceUrl: job.sourceUrl,
          storagePath: result.storagePath,
          publicUrl: result.publicUrl,
          updated: result.updated,
        });

        if (config.verbose) {
          const verb = config.dryRun ? 'planned' : 'uploaded';
          logger.success(`${verb} ${rowLabel} -> ${result.storagePath}`);
        }
      } catch (error) {
        const appError = toAppError(error, `Failed to process ${rowLabel}`);
        summary.processed += 1;
        summary.failed += 1;
        summary.failures.push({
          id: job.id,
          sourceUrl: job.sourceUrl,
          message: appError.message,
          code: appError.code || '',
          statusCode: appError.statusCode || null,
        });
        logger.error(`${rowLabel} -> ${appError.message}`);
      } finally {
        logger.updateProgress(summary, rowLabel);
      }
    },
    config.concurrency
  );

  logger.flushProgress(summary);

  const report = buildReport(config, summary);
  logger.section('Summary');
  logger.info(`Processed ${summary.processed}/${summary.total} rows in ${formatDuration(report.summary.durationMs)}`);
  logger.success(
    config.dryRun
      ? `${summary.uploaded} planned, ${summary.failed} failed, ${summary.updated} row updates`
      : `${summary.uploaded} uploaded, ${summary.failed} failed, ${summary.updated} row updates`
  );
  logger.info(
    config.dryRun
      ? `No files were uploaded. Estimated retries observed: ${summary.retried}`
      : `Transferred ${formatBytes(summary.bytesUploaded)} with ${summary.retried} retries`
  );
  if (summary.skippedRows.length > 0) {
    logger.info(`Pre-skipped ${summary.skippedRows.length} ${pluralize(summary.skippedRows.length, 'row')}`);
  }
  if (summary.failures.length > 0) {
    logger.warn(`Failed rows: ${summary.failures.length}`);
  }

  if (config.reportPath) {
    await writeReport(config.reportPath, report, logger);
  }

  return report;
}

async function main() {
  await loadEnv();
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(`${HELP_TEXT}\n`);
    return;
  }

  const config = buildConfig(options);
  validateConfig(config);

  const report = await migrateImages(config);
  if (report.summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const appError = toAppError(error);
  const code = appError.code ? ` code=${appError.code}` : '';
  const statusCode = appError.statusCode ? ` status=${appError.statusCode}` : '';
  process.stderr.write(`Image migration failed.${code}${statusCode} ${appError.message}\n`);
  process.exit(1);
});
