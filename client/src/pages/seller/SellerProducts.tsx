import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function SellerProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/products`, { headers })
            .then(r => setProducts(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const deleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await axios.delete(`${API_BASE}/seller/products/${id}`, { headers });
        setProducts(p => p.filter(x => x.id !== id));
    };

    return (
        <SellerLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">My Products ({products.length})</h2>
                    <Link to="/seller/products/new"
                        className="flex items-center gap-1.5 bg-[#fb641b] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#f35200] transition">
                        <Plus className="w-3.5 h-3.5" />Add Product
                    </Link>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-400 text-sm mb-4">You haven't listed any products yet.</p>
                        <Link to="/seller/products/new" className="bg-[#fb641b] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#f35200] transition">
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={p.images?.[0]} className="w-10 h-10 object-cover rounded border border-gray-100" alt="" />
                                            <span className="font-medium text-[13px] text-gray-800 max-w-[200px] truncate">{p.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{p.category?.name || '—'}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-700">₹{Math.round(Number(p.price) * 82)}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {p.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link to={`/seller/products/${p.id}/edit`}
                                                className="p-1.5 bg-blue-50 text-[#2874f0] rounded hover:bg-blue-100 transition">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Link>
                                            <button onClick={() => deleteProduct(p.id)}
                                                className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </SellerLayout>
    );
}
