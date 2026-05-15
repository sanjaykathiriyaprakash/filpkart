export type VariantOption = { type: string; name: string; options: string[] };

const DEFAULT_COLORS = ['Black', 'Blue', 'Red', 'White', 'Green'];
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

export function buildDefaultVariants(search = ''): VariantOption[] {
    const hint = search.toLowerCase();
    const isFashion =
        hint.includes('shirt') || hint.includes('men') || hint.includes('women') || hint.includes('dress');
    return [
        { type: 'color', name: 'Color', options: DEFAULT_COLORS.slice(0, 4) },
        { type: 'size', name: 'Size', options: isFashion ? DEFAULT_SIZES : ['Standard', 'Large'] },
    ];
}

export function parseVariants(raw: unknown, categoryOrSearch = ''): VariantOption[] {
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
        return buildDefaultVariants(categoryOrSearch);
    }

    const parsed: VariantOption[] = [];

    for (const entry of raw) {
        if (typeof entry !== 'object' || entry === null) continue;
        const o = entry as Record<string, unknown>;
        if (Array.isArray(o.options) && (o.options as unknown[]).length > 0) {
            parsed.push({
                type: String(o.type || o.name || 'option').toLowerCase(),
                name: String(o.name || o.type || 'Option'),
                options: (o.options as unknown[]).map(String),
            });
        }
    }

    if (parsed.length === 0) return buildDefaultVariants(categoryOrSearch);

    const hasColor = parsed.some((v) => v.type === 'color');
    const hasSize = parsed.some((v) => ['size', 'storage', 'ram'].includes(v.type));
    if (!hasColor || !hasSize) {
        const built = buildDefaultVariants(categoryOrSearch);
        if (!hasColor && built[0]) parsed.unshift(built[0]);
        if (!hasSize && built[1]) parsed.push(built[1]);
    }

    return parsed;
}

export function getVariantByType(variants: VariantOption[], type: string): VariantOption | undefined {
    return variants.find((v) => v.type === type || v.name.toLowerCase() === type);
}
