const FIGMA_CATEGORY_ORDER = ['References', 'AI', 'Assets', 'Platforms', 'Production'] as const;

const CATEGORY_LABEL_RULES: Record<string, string> = {
  reference: 'References',
  references: 'References',
  ai: 'AI',
  asset: 'Assets',
  assets: 'Assets',
  platform: 'Platforms',
  platforms: 'Platforms',
  production: 'Production',
};

function normalizeCategoryKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');
}

export function formatCategoryLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  return CATEGORY_LABEL_RULES[normalizeCategoryKey(trimmed)] ?? trimmed;
}

export function getCategorySlug(value: string): string {
  return normalizeCategoryKey(formatCategoryLabel(value));
}

export function areSameCategory(a: string, b: string): boolean {
  return getCategorySlug(a) === getCategorySlug(b);
}

export function compareCategories(a: string, b: string): number {
  const labelA = formatCategoryLabel(a);
  const labelB = formatCategoryLabel(b);
  const indexA = FIGMA_CATEGORY_ORDER.indexOf(labelA as (typeof FIGMA_CATEGORY_ORDER)[number]);
  const indexB = FIGMA_CATEGORY_ORDER.indexOf(labelB as (typeof FIGMA_CATEGORY_ORDER)[number]);

  if (indexA === -1 && indexB === -1) {
    return labelA.localeCompare(labelB);
  }

  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
}
