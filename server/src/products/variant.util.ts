export type ProductVariant = { type: string; name: string; options: string[] };

export function buildVariants(category: string): ProductVariant[] {
    const cat = (category || '').toLowerCase();
    const colors = ['Black', 'Blue', 'Red', 'White', 'Green'];
    const fashionSizes = ['S', 'M', 'L', 'XL'];
    const shoeSizes = ['7', '8', '9', '10', '11'];
    const storage = ['64GB', '128GB', '256GB'];

    const variants: ProductVariant[] = [
        { type: 'color', name: 'Color', options: colors.slice(0, 3 + (cat.length % 3)) },
    ];

    if (
        cat.includes('shirt') ||
        cat.includes('dress') ||
        cat.includes('jacket') ||
        cat.includes('women') ||
        cat.includes('men') ||
        cat.includes('tops') ||
        cat.includes('clothing')
    ) {
        variants.push({ type: 'size', name: 'Size', options: fashionSizes });
    } else if (cat.includes('shoe') || cat.includes('footwear')) {
        variants.push({ type: 'size', name: 'Size', options: shoeSizes });
    } else if (cat.includes('phone') || cat.includes('laptop') || cat.includes('tablet') || cat.includes('mobile')) {
        variants.push({ type: 'storage', name: 'Storage', options: storage });
    } else {
        variants.push({ type: 'size', name: 'Size', options: fashionSizes });
    }

    return variants;
}

/** Normalize DB / DummyJSON variant shapes into { type, name, options[] } */
export function normalizeVariants(raw: unknown, categoryName = ''): ProductVariant[] {
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
        return buildVariants(categoryName);
    }

    const parsed: ProductVariant[] = [];

    for (const entry of raw) {
        if (typeof entry === 'string') continue;

        if (typeof entry === 'object' && entry !== null) {
            const o = entry as Record<string, unknown>;
            if (Array.isArray(o.options) && o.options.length > 0) {
                const type = String(o.type || o.name || 'option').toLowerCase();
                parsed.push({
                    type,
                    name: String(o.name || o.type || 'Option'),
                    options: o.options.map(String),
                });
                continue;
            }
            // DummyJSON-style: { color: "Red" } or { sizes: ["S","M"] }
            for (const [key, val] of Object.entries(o)) {
                const type = key.toLowerCase();
                if (Array.isArray(val) && val.length) {
                    parsed.push({ type, name: key, options: val.map(String) });
                } else if (typeof val === 'string') {
                    const existing = parsed.find((p) => p.type === type);
                    if (existing) existing.options.push(val);
                    else parsed.push({ type, name: key, options: [val] });
                }
            }
        }
    }

    const hasColor = parsed.some((v) => v.type === 'color');
    const hasSize = parsed.some((v) => ['size', 'storage', 'ram'].includes(v.type));

    if (!hasColor || !hasSize) {
        const built = buildVariants(categoryName);
        if (!hasColor) parsed.unshift(built.find((v) => v.type === 'color')!);
        if (!hasSize) {
            const sizeBlock = built.find((v) => v.type !== 'color');
            if (sizeBlock) parsed.push(sizeBlock);
        }
    }

    return parsed.length ? parsed : buildVariants(categoryName);
}

export function collectFilterValues(variants: ProductVariant[]) {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    for (const v of variants) {
        const type = v.type.toLowerCase();
        v.options.forEach((opt) => {
            if (type === 'color') colors.add(opt);
            else if (['size', 'storage', 'ram'].includes(type)) sizes.add(opt);
        });
    }
    return { colors: [...colors].sort(), sizes: [...sizes].sort() };
}
