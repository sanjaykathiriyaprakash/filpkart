import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Search, Store, CheckCircle, XCircle } from 'lucide-react';

interface Seller {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    sellerProfile?: {
        storeName: string;
        gstNumber: string;
    };
}

export default function AdminSellers() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/admin/sellers`, { headers })
            .then(r => setSellers(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const toggleVerification = async (sellerId: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;
        await axios.patch(`${API_BASE}/admin/users/${sellerId}/verify`, { isVerified: nextStatus }, { headers });
        setSellers(u => u.map(x => x.id === sellerId ? { ...x, isVerified: nextStatus } : x));
    };

    const filtered = sellers.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.sellerProfile?.storeName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-4">
                    <h2 className="font-semibold text-gray-800 mr-auto">Manage Sellers</h2>
                    <div className="flex items-center border border-gray-200 rounded-md px-3 py-1.5 gap-2 w-64">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            placeholder="Search sellers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="outline-none text-sm flex-1"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">Loading sellers...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">Store</th>
                                <th className="px-5 py-3 text-left">Owner</th>
                                <th className="px-5 py-3 text-left">GST Number</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-left">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Store className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-800">{s.sellerProfile?.storeName || 'Not Set'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="text-gray-800 font-medium">{s.name}</div>
                                        <div className="text-gray-500 text-xs">{s.email}</div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600 font-mono text-xs">
                                        {s.sellerProfile?.gstNumber || 'N/A'}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button
                                            onClick={() => toggleVerification(s.id, s.isVerified)}
                                            className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                            title="Toggle Verification Status"
                                        >
                                            {s.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition-colors">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-250 px-2.5 py-1 rounded-full hover:bg-yellow-100 transition-colors">
                                                    <XCircle className="w-3.5 h-3.5" /> Unverified
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 text-xs">
                                        {new Date(s.createdAt).toLocaleDateString()}
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
