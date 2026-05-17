import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Search, UserCheck, UserX, UserPlus, X, ShieldAlert } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Form inputs for new user
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [storeName, setStoreName] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/admin/users`, { headers })
            .then(r => setUsers(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const changeRole = async (userId: string, newRole: string) => {
        await axios.patch(`${API_BASE}/admin/users/${userId}/role`, { role: newRole }, { headers });
        setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x));
    };

    const toggleVerification = async (userId: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;
        await axios.patch(`${API_BASE}/admin/users/${userId}/verify`, { isVerified: nextStatus }, { headers });
        setUsers(u => u.map(x => x.id === userId ? { ...x, isVerified: nextStatus } : x));
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setFormLoading(true);

        try {
            const body: any = {
                name,
                email,
                password,
                role,
            };

            if (role === 'seller') {
                body.storeName = storeName;
                body.gstNumber = gstNumber;
            }

            const response = await axios.post(`${API_BASE}/admin/users`, body, { headers });
            
            // Success
            setFormSuccess('User successfully registered & added to admin panel!');
            setUsers(prev => [response.data, ...prev]);

            // Reset inputs
            setName('');
            setEmail('');
            setPassword('');
            setRole('customer');
            setStoreName('');
            setGstNumber('');

            // Gracefully close modal after a tiny delay
            setTimeout(() => {
                setModalOpen(false);
                setFormSuccess('');
            }, 1500);
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Error occurred while creating user');
        } finally {
            setFormLoading(false);
        }
    };

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                {/* Header bar */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-lg text-gray-800 tracking-wide">All Users</h2>
                        <p className="text-xs text-gray-400 font-medium">Manage and register platform accounts</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search field */}
                        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 bg-[#f8f9fa] focus-within:bg-white focus-within:border-gray-300 transition-colors w-full sm:w-64">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                placeholder="Search users by name or email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="outline-none text-xs bg-transparent flex-1 text-gray-700"
                            />
                        </div>

                        {/* Add User Button */}
                        <button
                            onClick={() => {
                                setFormError('');
                                setFormSuccess('');
                                setModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-[#2874f0] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-600 transition shadow-md shadow-blue-500/10 cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add New User
                        </button>
                    </div>
                </div>

                {/* Users List Table */}
                {loading ? (
                    <div className="py-24 text-center text-gray-400 text-sm font-semibold">Loading users list...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-[#f8f9fa] text-gray-400 uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3 text-left font-bold">Name</th>
                                    <th className="px-5 py-3 text-left font-bold">Email</th>
                                    <th className="px-5 py-3 text-left font-bold">Role</th>
                                    <th className="px-5 py-3 text-left font-bold">Verified</th>
                                    <th className="px-5 py-3 text-left font-bold">Joined</th>
                                    <th className="px-5 py-3 text-right font-bold">Action / Change Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400 font-medium text-sm">
                                            No registered users match your query
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3.5 font-bold text-gray-800">{u.name}</td>
                                            <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                                                    u.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    u.role === 'seller' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>{u.role}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => toggleVerification(u.id, u.isVerified)}
                                                    className="focus:outline-none transition-transform active:scale-90 cursor-pointer"
                                                    title="Toggle Verification"
                                                >
                                                    {u.isVerified
                                                        ? <UserCheck className="w-5 h-5 text-green-500 hover:text-green-600" />
                                                        : <UserX className="w-5 h-5 text-red-400 hover:text-red-500" />}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <select
                                                    value={u.role}
                                                    onChange={e => changeRole(u.id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white outline-none focus:border-[#2874f0] font-bold text-gray-600"
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="seller">Seller</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Premium "Add New User" Modal Popup Form */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-[#2874f0]" />
                                <h3 className="font-extrabold text-gray-800 text-[15px] tracking-wide">Register New Account</h3>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body Form */}
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                            {/* Alert Banners */}
                            {formError && (
                                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2 border border-red-100">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <span>{formError}</span>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-lg flex items-center gap-2 border border-green-100">
                                    <UserCheck className="w-4 h-4 shrink-0" />
                                    <span>{formSuccess}</span>
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter user's name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white transition-all font-semibold"
                                />
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white transition-all font-semibold"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter secure password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white transition-all font-semibold"
                                />
                            </div>

                            {/* Role Select */}
                            <div>
                                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Account Role</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Conditional Seller Fields */}
                            {role === 'seller' && (
                                <div className="space-y-4 p-4.5 bg-orange-50/50 border border-orange-100 rounded-lg transition-all duration-300">
                                    <h4 className="text-xs font-black text-orange-700 mb-2">Seller Store Information</h4>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-orange-700 uppercase tracking-wider mb-1.5">Store Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Guru Krupa Store"
                                            value={storeName}
                                            onChange={e => setStoreName(e.target.value)}
                                            className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-orange-400 transition-all font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-orange-700 uppercase tracking-wider mb-1.5">GST Number</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 24AAAAB1234C1Z1"
                                            value={gstNumber}
                                            onChange={e => setGstNumber(e.target.value)}
                                            className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-orange-400 transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {formLoading ? 'Creating...' : 'Register Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
