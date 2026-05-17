import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Wallet, Landmark, Clock, CheckCircle } from 'lucide-react';

export default function SellerEarnings() {
    const [earnings, setEarnings] = useState<{ totalEarnings: number, thisMonthEarnings: number, pendingPayout: number, payouts: any[] }>({ totalEarnings: 0, thisMonthEarnings: 0, pendingPayout: 0, payouts: [] });
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/earnings`, { headers })
            .then(r => setEarnings(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <SellerLayout>
            <div className="space-y-6">
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className="w-5 h-5 text-green-500" />
                            <h3 className="text-sm font-semibold text-gray-600">Total Lifetime Earnings</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{Math.round(earnings.totalEarnings * 82).toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">After 10% platform fee</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Landmark className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm font-semibold text-gray-600">This Month's Earnings</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{Math.round(earnings.thisMonthEarnings * 82).toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-yellow-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-sm font-semibold text-gray-600">Pending Payout</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{Math.round(earnings.pendingPayout * 82).toLocaleString()}</p>
                        <button className="mt-3 text-xs font-semibold text-[#fb641b] hover:underline">View Schedule &rarr;</button>
                    </div>
                </div>

                {/* Payout History */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Payout History</h2>
                    </div>
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 text-sm">Loading earnings...</div>
                    ) : earnings.payouts.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm">No payout history yet.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Month</th>
                                    <th className="px-5 py-3 text-left">Amount</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {earnings.payouts.map((p, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3 font-medium text-gray-800">{p.month}</td>
                                        <td className="px-5 py-3 font-semibold text-gray-900">₹{Math.round(p.amount * 82).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            {p.status === 'Paid' ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Settled
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                                                    <Clock className="w-3.5 h-3.5" /> Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
