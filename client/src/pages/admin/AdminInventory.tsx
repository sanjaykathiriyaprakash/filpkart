import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { AlertTriangle, PackageX } from 'lucide-react';

interface ProductInventory {
    id: string;
    title: string;
    stock: number;
    price: string;
    category?: { name: string };
    seller?: { name: string };
}

export default function AdminInventory() {
    const [inventory, setInventory] = useState<{lowStock: ProductInventory[], outOfStock: ProductInventory[], all: ProductInventory[]}>({ lowStock: [], outOfStock: [], all: [] });
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/admin/reports/inventory`, { headers })
            .then(r => setInventory(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-5 flex items-center gap-4">
                        <div className="bg-red-100 text-red-600 p-3 rounded-full">
                            <PackageX className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-800">Out of Stock Products</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{inventory.outOfStock.length}</p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5 flex items-center gap-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">Low Stock Products (&lt; 10 items)</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{inventory.lowStock.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Low Stock Alerts</h2>
                    </div>
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 text-sm">Loading inventory...</div>
                    ) : inventory.lowStock.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">No low stock items!</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Product</th>
                                    <th className="px-5 py-3 text-left">Seller</th>
                                    <th className="px-5 py-3 text-left">Stock Remaining</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {inventory.lowStock.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3 font-medium text-gray-800">{p.title}</td>
                                        <td className="px-5 py-3 text-gray-500">{p.seller?.name || 'Flipkart'}</td>
                                        <td className="px-5 py-3">
                                            <span className="font-bold text-gray-800">{p.stock}</span> units
                                        </td>
                                        <td className="px-5 py-3">
                                            {p.stock === 0 ? (
                                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">Low Stock</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
