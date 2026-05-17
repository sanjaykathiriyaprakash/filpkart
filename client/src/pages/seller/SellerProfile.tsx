import { useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { setCredentials } from '../../store/slices/authSlice';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function SellerProfile() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        businessName: user?.businessName || '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        try {
            const { data } = await axios.patch(`${API_BASE}/seller/profile`, form, { headers });
            dispatch(setCredentials({ user: { ...user, ...data }, token: token! }));
            setSuccess('Profile updated successfully.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SellerLayout>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#fb641b] rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">Seller Profile</h2>
                            <p className="text-xs text-gray-500">Manage your account details</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        {success && (
                            <div className="text-green-700 text-sm bg-green-50 p-3 rounded border-l-2 border-green-400">
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded border-l-2 border-red-400">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <User className="w-3 h-3 inline mr-1" />Full Name
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#fb641b]"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <Mail className="w-3 h-3 inline mr-1" />Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    disabled
                                    className="w-full border border-gray-100 rounded px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <Phone className="w-3 h-3 inline mr-1" />Phone
                                </label>
                                <input
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#fb641b]"
                                    placeholder="Your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Business Name
                                </label>
                                <input
                                    value={form.businessName}
                                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#fb641b]"
                                    placeholder="Your business / store name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                <MapPin className="w-3 h-3 inline mr-1" />Address
                            </label>
                            <textarea
                                rows={3}
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#fb641b] resize-none"
                                placeholder="Your business address"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-gray-500">Account role:</span>
                            <span className="text-xs font-bold bg-orange-100 text-[#fb641b] px-2 py-0.5 rounded uppercase">
                                {user?.role || 'seller'}
                            </span>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#fb641b] text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#f35200] transition disabled:opacity-60"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
