import { useState, useEffect } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useNavigate, useParams } from 'react-router-dom';

const CATEGORIES = [
    'smartphones', 'laptops', 'mens-shirts', 'womens-dresses', 'mens-shoes',
    'womens-shoes', 'mens-watches', 'womens-watches', 'beauty', 'fragrances',
    'furniture', 'groceries', 'home-decoration', 'kitchen-accessories',
    'mobile-accessories', 'motorcycle', 'skin-care', 'sports-accessories',
    'sunglasses', 'tablets', 'tops', 'vehicle', 'General',
];

const CATEGORY_ATTRIBUTES: Record<string, string[]> = {
    'smartphones': ['RAM', 'Processor', 'Battery', 'Display'],
    'laptops': ['RAM', 'Processor', 'Storage', 'Display'],
    'womens-dresses': ['Fabric', 'Occasion', 'Pattern', 'Fit'],
    'mens-shirts': ['Fabric', 'Pattern', 'Fit', 'Occasion'],
    'default': ['Color', 'Size', 'Material'],
};

export default function SellerEditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: 'General',
        brand: '',
        images: '',
    });
    const [attributes, setAttributes] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`${API_BASE}/products/${id}`)
            .then(res => {
                const p = res.data;
                setForm({
                    title: p.title || '',
                    description: p.description || '',
                    price: p.price ? String(Math.round(Number(p.price) * 82)) : '', // Convert back to INR
                    stock: p.stock ? String(p.stock) : '',
                    category: p.category?.name || 'General',
                    brand: typeof p.brand === 'object' && p.brand !== null ? (p.brand.name || '') : (p.brand || ''),
                    images: p.images ? p.images.join(', ') : '',
                });
                setAttributes(p.attributes || {});
            })
            .catch(err => {
                setError('Failed to fetch product details.');
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const attrKeys = CATEGORY_ATTRIBUTES[form.category] || CATEGORY_ATTRIBUTES['default'];

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await axios.patch(`${API_BASE}/seller/products/${id}`, {
                title: form.title,
                description: form.description,
                price: Number(form.price) / 82,   // convert ₹ to USD for storage
                stock: Number(form.stock),
                category: form.category,
                brand: form.brand || form.category,
                images: form.images.split(',').map(s => s.trim()).filter(Boolean),
                attributes,
            }, { headers });
            
            setSuccess('Product details updated successfully!');
            setTimeout(() => navigate('/seller/products'), 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SellerLayout>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 text-[15px]">Edit Product Details</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Modify fields and submit. Product will go live after admin approval.</p>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-gray-400 text-sm">Loading product details...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            {error && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border-l-2 border-red-400">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-green-700 text-sm bg-green-50 p-3 rounded border-l-2 border-green-400">
                                    {success}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Title *</label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={set('title')}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] transition-colors"
                                    placeholder="e.g. Samsung Galaxy S24"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.description}
                                    onChange={set('description')}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] resize-none transition-colors"
                                    placeholder="Describe your product..."
                                />
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={form.price}
                                        onChange={set('price')}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] transition-colors"
                                        placeholder="Price in INR"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Stock *</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={set('stock')}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] transition-colors"
                                        placeholder="Stock quantity"
                                    />
                                </div>
                            </div>

                            {/* Category + Brand */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={e => { set('category')(e); setAttributes({}); }}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] transition-colors bg-white"
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>
                                                {c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Brand</label>
                                    <input
                                        value={form.brand}
                                        onChange={set('brand')}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] transition-colors"
                                        placeholder="Brand name"
                                    />
                                </div>
                            </div>

                            {/* Image URLs */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URLs (comma separated)</label>
                                <input
                                    value={form.images}
                                    onChange={set('images')}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#2874f0] transition-colors"
                                    placeholder="URLs separated by commas"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">Paste direct image URLs separated by commas</p>
                            </div>

                            {/* Dynamic Attributes */}
                            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <p className="text-xs font-semibold text-gray-600 mb-3">Product Attributes</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {attrKeys.map(key => (
                                        <div key={key}>
                                            <label className="block text-xs text-gray-500 mb-1">{key}</label>
                                            <input
                                                value={attributes[key] || ''}
                                                onChange={e => setAttributes(a => ({ ...a, [key]: e.target.value }))}
                                                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2874f0] bg-white transition-colors"
                                                placeholder={key}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/seller/products')}
                                    className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded font-semibold text-sm hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-[#fb641b] text-white py-2.5 rounded font-semibold text-sm hover:bg-[#f35200] transition disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
