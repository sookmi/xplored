import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRMITIVES_PATH = path.join(__dirname, '../tokens/Color Primitives/Default.json');
const SEMANTICS_LIGHT_PATH = path.join(__dirname, '../tokens/Color/Light.json');
const SEMANTICS_DARK_PATH = path.join(__dirname, '../tokens/Color/Dark.json');

const OUTPUT_TS_PATH = path.join(__dirname, '../lib/tokens.ts');
const OUTPUT_CSS_PATH = path.join(__dirname, '../lib/tokens.css');

function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        process.exit(1);
    }
}

function resolveReference(value, allTokens) {
    if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
        return value;
    }

    const path = value.slice(1, -1).split('.');
    let current = allTokens;

    for (const step of path) {
        if (current[step] === undefined) {
            console.warn(`Warning: Could not resolve reference ${value}`);
            return value;
        }
        current = current[step];
    }

    // If the resolved value is another reference, resolve it recursively
    if (current && current.$value) {
        return resolveReference(current.$value, allTokens);
    }
    return current;
}

function processTokens(tokenObj, allTokens, result = {}, pathStack = []) {
    for (const key in tokenObj) {
        if (key.startsWith('$')) continue;

        const value = tokenObj[key];
        const currentPath = [...pathStack, key];

        if (value !== null && typeof value === 'object') {
            if (value.$type === 'color' && value.$value) {
                result[key] = {
                    value: resolveReference(value.$value, allTokens),
                    cssVarName: `--${currentPath.join('-')}`
                };
            } else {
                result[key] = {};
                processTokens(value, allTokens, result[key], currentPath);
                // Remove empty objects
                if (Object.keys(result[key]).length === 0) {
                    delete result[key];
                }
            }
        }
    }
    return result;
}

function generateCSSVarsString(categorizedTokens) {
    let css = "";
    function traverse(obj) {
        for (const key in obj) {
            if (obj[key] && obj[key].cssVarName) {
                css += `  ${obj[key].cssVarName}: ${obj[key].value};\n`;
            } else if (typeof obj[key] === 'object') {
                traverse(obj[key]);
            }
        }
    }
    traverse(categorizedTokens);
    return css;
}

function generateTailwindConfigMap(categorizedTokens) {
    const result = {};
    function traverse(obj, target) {
        for (const key in obj) {
            if (obj[key] && obj[key].cssVarName) {
                target[key] = `var(${obj[key].cssVarName})`;
            } else if (typeof obj[key] === 'object') {
                target[key] = {};
                traverse(obj[key], target[key]);
            }
        }
    }
    traverse(categorizedTokens, result);
    return result;
}

function generateTokens() {
    console.log('Reading Figma tokens...');
    const primitives = readJsonFile(PRMITIVES_PATH);
    const semanticsLight = readJsonFile(SEMANTICS_LIGHT_PATH);
    const semanticsDark = readJsonFile(SEMANTICS_DARK_PATH);

    const allTokensLight = { ...primitives, ...semanticsLight };
    const allTokensDark = { ...primitives, ...semanticsDark };

    console.log('Processing Primitive Colors...');
    const pColors = processTokens(primitives, allTokensLight); // Primitives are same for both

    console.log('Processing Semantic Colors (Light)...');
    const sColorsLight = processTokens(semanticsLight, allTokensLight);

    console.log('Processing Semantic Colors (Dark)...');
    const sColorsDark = processTokens(semanticsDark, allTokensDark);

    // 1. Generate CSS Variables file
    let cssContent = `/* Automatically generated from Figma Tokens. Do not edit directly. */\n`;

    // Primitive mappings are placed in root since they are static
    cssContent += `:root {\n`;
    cssContent += `  /* Primitive Colors */\n`;
    cssContent += generateCSSVarsString(pColors);

    cssContent += `\n  /* Light Theme Semantic Colors */\n`;
    cssContent += generateCSSVarsString(sColorsLight);
    cssContent += `}\n\n`;

    // Dark theme overrides the semantics
    cssContent += `.dark {\n`;
    cssContent += `  /* Dark Theme Semantic Colors */\n`;
    cssContent += generateCSSVarsString(sColorsDark);
    cssContent += `}\n`;

    fs.mkdirSync(path.dirname(OUTPUT_CSS_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_CSS_PATH, cssContent, 'utf8');
    console.log(`Successfully generated CSS generic tokens at ${OUTPUT_CSS_PATH}`);


    // 2. Generate Tailwind TS Map
    const tailwindTokenMap = {
        ...generateTailwindConfigMap(pColors),
        ...generateTailwindConfigMap(sColorsLight) // Structure is same, just maps to var()
    };

    const outputTSContent = `// Automatically generated from Figma Tokens. Do not edit directly.
export const colors = ${JSON.stringify(tailwindTokenMap, null, 2)};
`;

    fs.mkdirSync(path.dirname(OUTPUT_TS_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_TS_PATH, outputTSContent, 'utf8');
    console.log(`Successfully generated Tailwind configuration variables at ${OUTPUT_TS_PATH}`);
}

generateTokens();
