import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Plus, Trash2 } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchase: number;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    const [form, setForm] = useState({
        code: '', discountType: 'percentage', discountValue: '', minPurchase: '0', usageLimit: '100'
    });

    useEffect(() => {
        axios.get(`${API_BASE}/admin/coupons`, { headers })
            .then(r => setCoupons(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const createCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data } = await axios.post(`${API_BASE}/admin/coupons`, {
            ...form,
            discountValue: Number(form.discountValue),
            minPurchase: Number(form.minPurchase),
            usageLimit: Number(form.usageLimit)
        }, { headers });
        setCoupons([data, ...coupons]);
        setForm({ code: '', discountType: 'percentage', discountValue: '', minPurchase: '0', usageLimit: '100' });
    };

    const deleteCoupon = async (id: string) => {
        await axios.delete(`${API_BASE}/admin/coupons/${id}`, { headers });
        setCoupons(c => c.filter(x => x.id !== id));
    };

    const toggleStatus = async (id: string, current: boolean) => {
        await axios.patch(`${API_BASE}/admin/coupons/${id}`, { isActive: !current }, { headers });
        setCoupons(c => c.map(x => x.id === id ? { ...x, isActive: !current } : x));
    };

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4">Create Coupon</h2>
                        <form onSubmit={createCoupon} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Code</label>
                                <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm uppercase" placeholder="e.g. SUMMER50" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                                    <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value as any }))}
                                        className="w-full border border-gray-200 rounded px-2 py-2 text-sm">
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Value</label>
                                    <input required type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder={form.discountType === 'percentage' ? '%' : '₹'} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Purchase Amount (₹)</label>
                                <input required type="number" value={form.minPurchase} onChange={e => setForm(f => ({ ...f, minPurchase: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Usage Limit</label>
                                <input required type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                            </div>
                            <button type="submit" className="w-full bg-[#2874f0] text-white py-2 rounded text-sm font-semibold flex justify-center items-center gap-1 hover:bg-blue-600 transition">
                                <Plus className="w-4 h-4" /> Create Coupon
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">All Coupons</h2>
                        </div>
                        {loading ? (
                            <div className="py-20 text-center text-gray-400 text-sm">Loading coupons...</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-5 py-3 text-left">Code</th>
                                        <th className="px-5 py-3 text-left">Discount</th>
                                        <th className="px-5 py-3 text-left">Usage</th>
                                        <th className="px-5 py-3 text-left">Status</th>
                                        <th className="px-5 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {coupons.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50">
                                            <td className="px-5 py-3 font-bold text-gray-800">{c.code}</td>
                                            <td className="px-5 py-3 text-gray-600">
                                                {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                                                <div className="text-[10px] text-gray-400">Min: ₹{c.minPurchase}</div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                                    <div className="bg-[#2874f0] h-1.5 rounded-full" style={{ width: `${(c.usedCount / c.usageLimit) * 100}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500">{c.usedCount} / {c.usageLimit}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => toggleStatus(c.id, c.isActive)}
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {c.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => deleteCoupon(c.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {coupons.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-400">No coupons found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
