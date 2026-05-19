export type ProductVariant = { type: string; name: string; options: string[] };

export function buildVariants(category: string, title = ''): ProductVariant[] {
    const cat = (category || '').toLowerCase();
    const t = (title || '').toLowerCase();
    
    // Determine highly realistic colors matching actual catalog images
    let selectedColors = ['Black'];
    const colorsPool = ['Black', 'Blue', 'Red', 'White', 'Green', 'Gold', 'Silver', 'Grey'];

    if (t.includes('blue') || t.includes('short sleeve') || t.includes('levi\'s')) {
        selectedColors = ['Blue'];
    } else if (t.includes('red') || t.includes('plaid')) {
        selectedColors = ['Red'];
    } else if (t.includes('black')) {
        selectedColors = ['Black'];
    } else if (t.includes('white') || t.includes('jockey')) {
        selectedColors = ['White'];
    } else if (t.includes('green') || (t.includes('check') && !t.includes('blue'))) {
        selectedColors = ['Green'];
    } else if (t.includes('gold')) {
        selectedColors = ['Gold'];
    } else if (t.includes('silver')) {
        selectedColors = ['Silver'];
    } else if (t.includes('grey') || t.includes('gray') || t.includes('aorus')) {
        selectedColors = ['Grey'];
    } else {
        // Deterministic fallback color based on product title length/hash
        const charSum = t.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        selectedColors = [colorsPool[charSum % colorsPool.length]];
        // 30% of items have a secondary color to keep the filter UI rich
        if (charSum % 10 < 3) {
            selectedColors.push(colorsPool[(charSum + 3) % colorsPool.length]);
        }
    }

    let selectedSizes = ['S', 'M', 'L', 'XL'];
    if (cat.includes('shoe') || cat.includes('footwear')) {
        const charSum = t.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        selectedSizes = charSum % 2 === 0 ? ['7', '8', '9'] : ['9', '10', '11'];
    } else if (cat.includes('phone') || cat.includes('laptop') || cat.includes('tablet') || cat.includes('mobile')) {
        const charSum = t.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        selectedSizes = charSum % 2 === 0 ? ['128GB', '256GB'] : ['64GB', '128GB'];
    } else {
        if (t.includes('plaid')) {
            selectedSizes = ['L', 'XL'];
        } else if (t.includes('short sleeve')) {
            selectedSizes = ['S', 'M'];
        } else if (t.includes('levi\'s')) {
            selectedSizes = ['M', 'L'];
        } else if (t.includes('jockey')) {
            selectedSizes = ['S', 'M', 'L'];
        } else {
            const charSum = t.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
            if (charSum % 3 === 0) {
                selectedSizes = ['M', 'L'];
            } else if (charSum % 3 === 1) {
                selectedSizes = ['S', 'M', 'XL'];
            } else {
                selectedSizes = ['L', 'XL'];
            }
        }
    }

    const variants: ProductVariant[] = [
        { type: 'color', name: 'Color', options: selectedColors },
    ];

    if (cat.includes('phone') || cat.includes('laptop') || cat.includes('tablet') || cat.includes('mobile')) {
        variants.push({ type: 'storage', name: 'Storage', options: selectedSizes });
    } else {
        variants.push({ type: 'size', name: 'Size', options: selectedSizes });
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
