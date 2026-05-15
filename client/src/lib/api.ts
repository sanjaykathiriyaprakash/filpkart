export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function buildProductsQuery(params: Record<string, string | number | undefined>) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) q.set(k, String(v));
    });
    const s = q.toString();
    return s ? `${API_BASE}/products?${s}` : `${API_BASE}/products`;
}
