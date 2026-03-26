import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMITIVES_PATH = path.join(__dirname, '../tokens/Color Primitives/Default.json');
const SEMANTICS_LIGHT_PATH = path.join(__dirname, '../tokens/Color/Light.json');
const SEMANTICS_DARK_PATH = path.join(__dirname, '../tokens/Color/Dark.json');
const INPUT_PATH = path.join(__dirname, '../.figma-variables.json');

const PRIMITIVE_COLLECTIONS = new Set([
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink',
  'rose', 'bw', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'alpha', 'brand'
]);

const SEMANTIC_CATEGORIES = new Set(['bg', 'text', 'icon', 'border']);

function parseMode() {
  const modeArg = process.argv.find(a => a.startsWith('--mode='));
  if (modeArg) return modeArg.split('=')[1].toLowerCase();
  const idx = process.argv.indexOf('--mode');
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1].toLowerCase();
  return 'light';
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function buildHexToPrimitiveMap(primitives) {
  const map = new Map();
  for (const [collection, steps] of Object.entries(primitives)) {
    for (const [step, def] of Object.entries(steps)) {
      if (step.startsWith('$')) continue;
      if (def && def.$value && typeof def.$value === 'string') {
        const hex = def.$value.toLowerCase();
        map.set(hex, `{${collection}.${step}}`);
      }
    }
  }
  return map;
}

function setNestedValue(obj, pathParts, value) {
  let current = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const key = pathParts[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  const leafKey = pathParts[pathParts.length - 1];
  if (current[leafKey] && current[leafKey].$type) {
    current[leafKey].$value = value;
  } else {
    current[leafKey] = {
      "$extensions": { "com.figma.scopes": ["ALL_SCOPES"] },
      "$type": "color",
      "$value": value,
      "$description": ""
    };
  }
}

function getNestedValue(obj, pathParts) {
  let current = obj;
  for (const key of pathParts) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
}

function parseFigmaVariables(input) {
  if (typeof input === 'string') {
    input = input
      .replace(/'/g, '"')
      .replace(/(\w+\/[\w/.-]+):/g, '"$1":')
      .replace(/(#[0-9a-fA-F]+)/g, '"$1"');
    try {
      return JSON.parse(input);
    } catch {
      const vars = {};
      const regex = /['"]([\w/.-]+)['"]:\s*['"](#[0-9a-fA-F]+)['"]/g;
      let match;
      while ((match = regex.exec(input)) !== null) {
        vars[match[1]] = match[2];
      }
      return vars;
    }
  }
  return input;
}

function normalizeHex(hex) {
  if (!hex || typeof hex !== 'string') return hex;
  hex = hex.toLowerCase().trim();
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

function pullTokens() {
  const mode = parseMode();
  const validModes = ['light', 'dark'];
  if (!validModes.includes(mode)) {
    console.error(`Invalid mode: "${mode}". Use --mode=light or --mode=dark`);
    process.exit(1);
  }

  const semanticsPath = mode === 'dark' ? SEMANTICS_DARK_PATH : SEMANTICS_LIGHT_PATH;
  console.log(`Mode: ${mode.toUpperCase()}`);

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Input file not found: ${INPUT_PATH}`);
    console.error('Save Figma MCP get_variable_defs output to .figma-variables.json first.');
    process.exit(1);
  }

  const rawInput = fs.readFileSync(INPUT_PATH, 'utf8');
  let figmaVars;
  try {
    figmaVars = JSON.parse(rawInput);
  } catch {
    figmaVars = parseFigmaVariables(rawInput);
  }

  if (!figmaVars || Object.keys(figmaVars).length === 0) {
    console.error('No variables found in input file.');
    process.exit(1);
  }

  console.log(`Found ${Object.keys(figmaVars).length} Figma variables`);

  const primitives = readJson(PRIMITIVES_PATH);
  const semantics = readJson(semanticsPath);

  const primitiveUpdates = {};
  const semanticUpdates = {};

  for (const [varName, rawValue] of Object.entries(figmaVars)) {
    const parts = varName.split('/');
    const topLevel = parts[0];
    const value = normalizeHex(rawValue);

    if (PRIMITIVE_COLLECTIONS.has(topLevel)) {
      primitiveUpdates[varName] = value;
    } else if (SEMANTIC_CATEGORIES.has(topLevel)) {
      semanticUpdates[varName] = value;
    } else {
      console.warn(`Unknown variable collection: ${varName}`);
    }
  }

  let primChanges = 0;
  for (const [varName, hex] of Object.entries(primitiveUpdates)) {
    const parts = varName.split('/');
    const existing = getNestedValue(primitives, parts);
    if (existing && existing.$value !== hex) {
      console.log(`  PRIM: ${varName}: ${existing.$value} → ${hex}`);
      primChanges++;
    } else if (!existing) {
      console.log(`  PRIM (new): ${varName}: ${hex}`);
      primChanges++;
    }
    setNestedValue(primitives, parts, hex);
  }

  const hexToPrimitive = buildHexToPrimitiveMap(primitives);

  let semChanges = 0;
  for (const [varName, hex] of Object.entries(semanticUpdates)) {
    const parts = varName.split('/');
    const existing = getNestedValue(semantics, parts);

    let ref = hexToPrimitive.get(hex) || hex;

    if (existing && existing.$value) {
      const existingRef = existing.$value;
      if (existingRef.startsWith('{') && existingRef.endsWith('}')) {
        const refPath = existingRef.slice(1, -1).split('.');
        const referencedPrim = getNestedValue(primitives, refPath);
        if (referencedPrim && normalizeHex(referencedPrim.$value) === hex) {
          ref = existingRef;
        }
      }
    }

    if (existing && existing.$value !== ref) {
      console.log(`  ${mode.toUpperCase()}: ${varName}: ${existing.$value} → ${ref}`);
      semChanges++;
    } else if (!existing) {
      console.log(`  ${mode.toUpperCase()} (new): ${varName}: ${ref}`);
      semChanges++;
    }
    setNestedValue(semantics, parts, ref);
  }

  if (primChanges > 0) {
    writeJson(PRIMITIVES_PATH, primitives);
    console.log(`\nUpdated primitives: ${primChanges} changes`);
  }
  if (semChanges > 0) {
    writeJson(semanticsPath, semantics);
    console.log(`Updated ${mode} semantics: ${semChanges} changes`);
  }

  if (primChanges === 0 && semChanges === 0) {
    console.log('\nNo changes detected. Tokens are up to date.');
  } else {
    console.log('\nToken JSON files updated. Run "npm run sync-tokens" to regenerate CSS/TS.');
  }
}

pullTokens();
