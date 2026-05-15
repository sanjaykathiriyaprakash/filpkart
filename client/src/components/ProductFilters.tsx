import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../lib/api';
import { toInr } from '../lib/pricing';

export interface ProductFilterState {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    color?: string;
    size?: string;
    brand?: string;
    sortBy?: string;
}

interface FilterOptions {
    colors: string[];
    sizes: string[];
    brands: string[];
    priceRange: { min: number; max: number };
}

interface Props {
    search?: string;
    filters: ProductFilterState;
    onChange: (next: ProductFilterState) => void;
}

const SORT_OPTIONS = [
    { value: '', label: 'Relevance' },
    { value: 'price_asc', label: 'Price -- Low to High' },
    { value: 'price_desc', label: 'Price -- High to Low' },
    { value: 'rating_desc', label: 'Customer Rating' },
];

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
                const hint = search || '';
                const isFashion =
                    hint.includes('shirt') || hint.includes('men') || hint.includes('women');
                const fallbackColors = ['Black', 'Blue', 'Red', 'White', 'Green'];
                const fallbackSizes = isFashion ? ['S', 'M', 'L', 'XL'] : ['Standard', 'Large'];
                setOptions({
                    colors: data.colors?.length ? data.colors : fallbackColors,
                    sizes: data.sizes?.length ? data.sizes : fallbackSizes,
                    brands: data.brands || [],
                    priceRange: data.priceRange || { min: 0, max: 500 },
                });
            })
            .catch(() => {
                const isFashion = (search || '').includes('shirt') || (search || '').includes('men');
                setOptions({
                    colors: ['Black', 'Blue', 'Red', 'White', 'Green'],
                    sizes: isFashion ? ['S', 'M', 'L', 'XL'] : ['Standard', 'Large'],
                    brands: [],
                    priceRange: { min: 0, max: 500 },
                });
            });
    }, [search]);

    useEffect(() => {
        if (options) {
            setPriceMin(filters.minPrice != null ? String(toInr(filters.minPrice)) : '');
            setPriceMax(filters.maxPrice != null ? String(toInr(filters.maxPrice)) : '');
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
        onChange({ sortBy: filters.sortBy });
    };

    if (!options) {
        return (
            <aside className="w-full lg:w-56 bg-white rounded-sm shadow-sm p-4 h-fit animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-3 bg-gray-100 rounded" />
                    ))}
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-56 bg-white rounded-sm shadow-sm p-4 h-fit sticky top-32">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
                <h3 className="font-bold text-sm text-gray-800 uppercase">Filters</h3>
                <button type="button" onClick={clearAll} className="text-xs text-[#2874f0] font-semibold hover:underline">
                    CLEAR ALL
                </button>
            </div>

            <FilterBlock title="Sort By">
                <select
                    value={filters.sortBy || ''}
                    onChange={(e) => onChange({ ...filters, sortBy: e.target.value || undefined })}
                    className="w-full border border-gray-300 rounded-sm text-sm py-1.5 px-2 focus:border-[#2874f0] outline-none"
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </FilterBlock>

            <FilterBlock title="Price">
                <div className="flex gap-2 items-center text-xs">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full border rounded-sm px-2 py-1"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full border rounded-sm px-2 py-1"
                    />
                </div>
                <button
                    type="button"
                    onClick={applyPrice}
                    className="mt-2 w-full text-xs font-bold text-[#2874f0] border border-[#2874f0] py-1 rounded-sm hover:bg-blue-50"
                >
                    Apply
                </button>
                <p className="text-[10px] text-gray-400 mt-1">
                    ₹{toInr(options.priceRange.min)} – ₹{toInr(options.priceRange.max)}
                </p>
            </FilterBlock>

            {options.brands.length > 0 && (
                <FilterBlock title="Brand">
                    <CheckboxList
                        items={options.brands}
                        selected={filters.brand}
                        onSelect={(brand) => onChange({ ...filters, brand: filters.brand === brand ? undefined : brand })}
                    />
                </FilterBlock>
            )}

            <FilterBlock title="Color">
                <CheckboxList
                    items={options.colors}
                    selected={filters.color}
                    onSelect={(color) => onChange({ ...filters, color: filters.color === color ? undefined : color })}
                />
            </FilterBlock>

            <FilterBlock title="Size">
                <div className="flex flex-wrap gap-1.5">
                    {options.sizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => onChange({ ...filters, size: filters.size === size ? undefined : size })}
                            className={`text-xs px-2.5 py-1 border rounded-sm font-medium transition-colors ${
                                filters.size === size
                                    ? 'border-[#2874f0] bg-[#2874f0] text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-[#2874f0]'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterBlock>

            <FilterBlock title="Customer Ratings">
                {[4, 3, 2, 1].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                        <input
                            type="radio"
                            name="rating"
                            checked={filters.minRating === r}
                            onChange={() => onChange({ ...filters, minRating: filters.minRating === r ? undefined : r })}
                            className="accent-[#2874f0]"
                        />
                        <span>{r}★ & above</span>
                    </label>
                ))}
            </FilterBlock>
        </aside>
    );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-gray-100 py-3 last:border-0">
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">{title}</h4>
            {children}
        </div>
    );
}

function CheckboxList({
    items,
    selected,
    onSelect,
}: {
    items: string[];
    selected?: string;
    onSelect: (v: string) => void;
}) {
    return (
        <ul className="space-y-1 max-h-36 overflow-y-auto">
            {items.map((item) => (
                <li key={item}>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#2874f0]">
                        <input
                            type="checkbox"
                            checked={selected === item}
                            onChange={() => onSelect(item)}
                            className="accent-[#2874f0]"
                        />
                        <span className="capitalize">{item}</span>
                    </label>
                </li>
            ))}
        </ul>
    );
}
