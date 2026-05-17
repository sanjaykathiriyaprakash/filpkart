import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export default function SellerOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/orders`, { headers })
            .then(r => setOrders(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const STATUS_COLORS: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        CONFIRMED: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

    return (
        <SellerLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">My Orders</h2>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">No orders yet.</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {orders.map(o => {
                            // Filter only products from this seller
                            const myProducts = o.products.filter((p: any) => p.seller?.id === useSelector((s: RootState) => s.auth.user?.id) || p.seller === useSelector((s: RootState) => s.auth.user?.id));
                            if (myProducts.length === 0) return null;

                            return (
                                <div key={o.id} className="p-5 hover:bg-gray-50/50 transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-mono">Order ID: {o.id}</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                                Customer: {o.user?.name || 'Guest'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100'}`}>
                                                {o.orderStatus}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded p-3 space-y-3 border border-gray-100">
                                        {myProducts.map((p: any, idx: number) => (
                                            <div key={idx} className="flex gap-4">
                                                <img src={p.images?.[0] || p.thumbnail || '/placeholder.png'} className="w-12 h-12 object-cover rounded border border-gray-200" alt={p.title} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-800">{p.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Qty: {p.quantity || 1}</p>
                                                </div>
                                                <div className="text-right font-semibold text-gray-900">
                                                    ₹{Math.round(Number(p.price) * 82 * (p.quantity || 1)).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
