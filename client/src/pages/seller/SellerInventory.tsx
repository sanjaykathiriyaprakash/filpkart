import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { RefreshCw } from 'lucide-react';

export default function SellerInventory() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/products`, { headers })
            .then(r => setProducts(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const updateStock = async (id: string, newStock: number) => {
        setUpdating(id);
        try {
            await axios.patch(`${API_BASE}/seller/products/${id}`, { stock: newStock }, { headers });
            setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <SellerLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">Inventory Management</h2>
                    <span className="text-sm text-gray-500">Total Items: {products.length}</span>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">Loading inventory...</div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">You haven't added any products yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">Product</th>
                                <th className="px-5 py-3 text-left">SKU</th>
                                <th className="px-5 py-3 text-left">Price</th>
                                <th className="px-5 py-3 text-left">Current Stock</th>
                                <th className="px-5 py-3 text-left">Quick Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={p.images?.[0] || p.thumbnail || '/placeholder.png'} className="w-10 h-10 object-cover rounded" alt="" />
                                            <div>
                                                <p className="font-medium text-gray-800">{p.title}</p>
                                                {p.stock < 10 && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">Low Stock</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.sku || 'N/A'}</td>
                                    <td className="px-5 py-3 font-semibold text-gray-800">₹{Math.round(p.price * 82).toLocaleString()}</td>
                                    <td className="px-5 py-3">
                                        <span className={`font-bold ${p.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>{p.stock}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                min="0"
                                                defaultValue={p.stock}
                                                onBlur={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val) && val !== p.stock) updateStock(p.id, val);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = parseInt(e.currentTarget.value);
                                                        if (!isNaN(val) && val !== p.stock) updateStock(p.id, val);
                                                    }
                                                }}
                                                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#fb641b]"
                                            />
                                            {updating === p.id && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
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
