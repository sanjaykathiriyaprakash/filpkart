import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { CheckCircle, XCircle, Search } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    price: number;
    stock: number;
    isApproved: boolean;
    images: string[];
    category?: { name: string };
    brand?: { name: string };
    seller?: { name: string };
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/admin/products`, { headers })
            .then(r => setProducts(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const approve = async (id: string) => {
        await axios.patch(`${API_BASE}/admin/products/${id}/approve`, {}, { headers });
        setProducts(p => p.map(x => x.id === id ? { ...x, isApproved: true } : x));
    };

    const remove = async (id: string) => {
        await axios.delete(`${API_BASE}/admin/products/${id}`, { headers });
        setProducts(p => p.filter(x => x.id !== id));
    };

    const filtered = products.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' ? true : filter === 'pending' ? !p.isApproved : p.isApproved;
        return matchSearch && matchFilter;
    });

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-gray-800 mr-auto">All Products</h2>
                    <div className="flex gap-1 bg-gray-100 rounded p-0.5">
                        {(['all', 'pending', 'approved'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded text-xs font-semibold transition ${filter === f ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center border border-gray-200 rounded px-3 py-1.5 gap-2 w-56">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="outline-none text-sm flex-1" />
                    </div>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">Loading products...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Seller</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={p.images?.[0] || '/placeholder.png'} className="w-10 h-10 object-cover rounded border border-gray-100" alt="" />
                                            <span className="font-medium text-gray-800 text-[13px] max-w-[200px] truncate">{p.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{p.category?.name || '—'}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{p.seller?.name || '—'}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-700">₹{Math.round(Number(p.price) * 82)}</td>
                                    <td className="px-4 py-3">
                                        {p.isApproved
                                            ? <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5" />Approved</span>
                                            : <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold"><XCircle className="w-3.5 h-3.5" />Pending</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {!p.isApproved && (
                                                <button onClick={() => approve(p.id)}
                                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition">
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => remove(p.id)}
                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
