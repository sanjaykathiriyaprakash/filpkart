import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user?: { name: string; email: string };
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        axios.get(`${API_BASE}/admin/orders`, { headers })
            .then(r => setOrders(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await axios.patch(`${API_BASE}/admin/orders/${id}/status`, { status }, { headers });
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            // Reload to get exact DB state if needed
            fetchOrders();
        } catch (err) {
            console.error("Failed to update status");
        }
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">All Orders</h2>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">No orders yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">Order ID</th>
                                <th className="px-5 py-3 text-left">Customer</th>
                                <th className="px-5 py-3 text-left">Amount</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}...</td>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-gray-800 text-[13px]">{o.user?.name || 'Guest'}</p>
                                        <p className="text-xs text-gray-400">{o.user?.email}</p>
                                    </td>
                                    <td className="px-5 py-3 font-semibold text-gray-700">₹{Math.round(Number(o.totalAmount) * 82)}</td>
                                    <td className="px-5 py-3">
                                        <select
                                            value={o.status || 'PENDING'}
                                            onChange={e => updateStatus(o.id, e.target.value)}
                                            className={`text-xs font-semibold px-2 py-1 rounded-md outline-none border border-transparent hover:border-gray-300 focus:border-[#2874f0] ${STATUS_COLORS[o.status || 'PENDING'] || 'bg-gray-100 text-gray-600'}`}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="CONFIRMED">CONFIRMED</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                            <option value="RETURNED">RETURNED</option>
                                            <option value="REFUNDED">REFUNDED</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
