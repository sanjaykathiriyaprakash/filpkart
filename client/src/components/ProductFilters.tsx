import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../lib/api';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface ProductFilterState {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    brand?: string;
    sortBy?: string;
    color?: string;
    size?: string;
    attributes?: Record<string, string>;
}

interface FilterOptions {
    brands: string[];
    colors: string[];
    sizes: string[];
    attributes: Record<string, string[]>;
    priceRange: { min: number; max: number };
}

interface Props {
    search?: string;
    category?: string;
    filters: ProductFilterState;
    onChange: (next: ProductFilterState) => void;
}

const SORT_OPTIONS = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price_asc', label: 'Price — Low to High' },
    { value: 'price_desc', label: 'Price — High to Low' },
    { value: 'rating_desc', label: 'Customer Rating' },
    { value: '', label: 'Newest First' },
];

function CollapsibleBlock({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 py-3">
            <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setOpen(o => !o)}
            >
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{title}</span>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {open && <div className="mt-2">{children}</div>}
        </div>
    );
}

function BrandSearch({ brands, selected, onSelect }: { brands: string[]; selected?: string; onSelect: (b: string) => void }) {
    const [q, setQ] = useState('');
    const filtered = brands.filter(b => b.toLowerCase().includes(q.toLowerCase()));
    return (
        <div>
            <div className="flex items-center border border-gray-200 rounded px-2 py-1 mb-2">
                <input
                    type="text"
                    placeholder="Search Brand"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="flex-1 outline-none text-xs"
                />
            </div>
            <ul className="space-y-1 max-h-40 overflow-y-auto">
                {filtered.slice(0, 20).map(brand => (
                    <li key={brand}>
                        <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2874f0]">
                            <input
                                type="checkbox"
                                checked={selected === brand}
                                onChange={() => onSelect(brand)}
                                className="accent-[#2874f0] w-3.5 h-3.5"
                            />
                            <span className="capitalize text-[13px]">{brand}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function ProductFilters({ search, filters, onChange }: Props) {
    const [options, setOptions] = useState<FilterOptions | null>(null);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        axios
            .get(`${API_BASE}/products/filter-options?${params}`)
            .then(({ data }) => {
                setOptions({
                    brands: data.brands || [],
                    colors: data.colors || [],
                    sizes: data.sizes || [],
                    attributes: data.attributes || {},
                    priceRange: data.priceRange || { min: 0, max: 100000 },
                });
            })
            .catch(() => {
                setOptions({ brands: [], colors: [], sizes: [], attributes: {}, priceRange: { min: 0, max: 100000 } });
            });
    }, [search]);

    useEffect(() => {
        if (options) {
            setPriceMin(filters.minPrice != null ? String(Math.round(Number(filters.minPrice) * 82)) : '');
            setPriceMax(filters.maxPrice != null ? String(Math.round(Number(filters.maxPrice) * 82)) : '');
        }
    }, [options, filters.minPrice, filters.maxPrice]);

    const applyPrice = () => {
        onChange({
            ...filters,
            minPrice: priceMin ? Number(priceMin) / 82 : undefined,
            maxPrice: priceMax ? Number(priceMax) / 82 : undefined,
        });
    };

    const clearAll = () => {
        setPriceMin('');
        setPriceMax('');
        onChange({});
    };

    const setAttr = (key: string, val: string) => {
        const existing = filters.attributes?.[key];
        const next = { ...(filters.attributes || {}) };
        if (existing === val) delete next[key];
        else next[key] = val;
        onChange({ ...filters, attributes: Object.keys(next).length ? next : undefined });
    };

    if (!options) {
        return (
            <aside className="w-[228px] shrink-0 bg-white shadow-sm animate-pulse">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-4 bg-gray-100 rounded" />)}
                </div>
            </aside>
        );
    }

    const priceSliderMax = Math.ceil(options.priceRange.max * 82);

    return (
        <aside className="w-[228px] shrink-0 bg-white shadow-sm sticky top-[60px] self-start max-h-[calc(100vh-60px)] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="font-semibold text-[15px] text-gray-900">Filters</span>
                <button
                    onClick={clearAll}
                    className="text-[13px] text-[#2874f0] font-semibold hover:underline"
                >
                    CLEAR ALL
                </button>
            </div>

            <div className="px-4">
                {/* Sort By */}
                <CollapsibleBlock title="Sort By">
                    <ul className="space-y-1">
                        {SORT_OPTIONS.map(opt => (
                            <li key={opt.value}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sortBy"
                                        checked={(filters.sortBy ?? '') === opt.value}
                                        onChange={() => onChange({ ...filters, sortBy: opt.value || undefined })}
                                        className="accent-[#2874f0] w-3.5 h-3.5"
                                    />
                                    <span className={`text-[13px] ${(filters.sortBy ?? '') === opt.value ? 'text-[#2874f0] font-semibold' : 'text-gray-700'}`}>
                                        {opt.label}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </CollapsibleBlock>

                {/* Price */}
                <CollapsibleBlock title="Price">
                    <input
                        type="range"
                        min={0}
                        max={priceSliderMax}
                        value={priceMax || priceSliderMax}
                        onChange={e => setPriceMax(e.target.value)}
                        onMouseUp={applyPrice}
                        onTouchEnd={applyPrice}
                        className="w-full accent-[#2874f0]"
                    />
                    <div className="flex gap-2 mt-2 text-xs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceMin}
                            onChange={e => setPriceMin(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-[#2874f0]"
                        />
                        <span className="self-center text-gray-400">to</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceMax}
                            onChange={e => setPriceMax(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-[#2874f0]"
                        />
                    </div>
                    <button
                        onClick={applyPrice}
                        className="mt-2 w-full text-xs font-semibold text-[#2874f0] border border-[#2874f0] py-1 rounded hover:bg-blue-50 transition"
                    >
                        Apply
                    </button>
                </CollapsibleBlock>

                {/* Customer Rating */}
                <CollapsibleBlock title="Customer Ratings">
                    {[4, 3, 2].map(r => (
                        <label key={r} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.minRating === r}
                                onChange={() => onChange({ ...filters, minRating: filters.minRating === r ? undefined : r })}
                                className="accent-[#2874f0] w-3.5 h-3.5"
                            />
                            <span className="text-[13px]">{r}★ & above</span>
                        </label>
                    ))}
                </CollapsibleBlock>

                {/* Brand */}
                {options.brands.length > 0 && (
                    <CollapsibleBlock title="Brand">
                        <BrandSearch
                            brands={options.brands}
                            selected={filters.brand}
                            onSelect={(brand) => onChange({ ...filters, brand: filters.brand === brand ? undefined : brand })}
                        />
                    </CollapsibleBlock>
                )}

                {/* Color */}
                {options.colors.length > 0 && (
                    <CollapsibleBlock title="Color" defaultOpen={true}>
                        <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                            {options.colors.map(c => (
                                <li key={c}>
                                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-[#2874f0]">
                                        <input
                                            type="checkbox"
                                            checked={filters.color === c}
                                            onChange={() => onChange({ ...filters, color: filters.color === c ? undefined : c })}
                                            className="accent-[#2874f0] w-3.5 h-3.5"
                                        />
                                        <span className="text-[13px] capitalize text-gray-700">{c}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleBlock>
                )}

                {/* Size */}
                {options.sizes.length > 0 && (
                    <CollapsibleBlock title="Size / Variant" defaultOpen={true}>
                        <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                            {options.sizes.map(s => (
                                <li key={s}>
                                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-[#2874f0]">
                                        <input
                                            type="checkbox"
                                            checked={filters.size === s}
                                            onChange={() => onChange({ ...filters, size: filters.size === s ? undefined : s })}
                                            className="accent-[#2874f0] w-3.5 h-3.5"
                                        />
                                        <span className="text-[13px] uppercase text-gray-700">{s}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleBlock>
                )}

                {/* Dynamic Attributes (Fabric, RAM, Occasion, etc.) */}
                {Object.entries(options.attributes).map(([key, values]) => (
                    values.length > 0 && (
                        <CollapsibleBlock key={key} title={key} defaultOpen={false}>
                            <ul className="space-y-1">
                                {values.map(val => (
                                    <li key={val}>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.attributes?.[key] === val}
                                                onChange={() => setAttr(key, val)}
                                                className="accent-[#2874f0] w-3.5 h-3.5"
                                            />
                                            <span className="text-[13px] text-gray-700">{val}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </CollapsibleBlock>
                    )
                ))}
            </div>
        </aside>
    );
}
