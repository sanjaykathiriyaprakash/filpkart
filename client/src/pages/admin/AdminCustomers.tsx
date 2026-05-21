import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Users, ShieldAlert, ShieldCheck, Search, ShoppingCart, Ban, CheckCircle } from 'lucide-react';

interface CustomerRecord {
    id: string;
    name: string;
    email: string;
    ordersCount: number;
    totalSpent: number;
    status: 'Active' | 'Suspended';
    joinedDate: string;
}

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<CustomerRecord[]>([
        { id: 'CUST-301', name: 'Rohit Sharma', email: 'rohit.sharma@gmail.com', ordersCount: 18, totalSpent: 45800, status: 'Active', joinedDate: '2024-02-15' },
        { id: 'CUST-302', name: 'Priya Singh', email: 'priya.singh@yahoo.com', ordersCount: 12, totalSpent: 28900, status: 'Active', joinedDate: '2024-03-01' },
        { id: 'CUST-303', name: 'Amit Kumar', email: 'amit.kumar@outlook.com', ordersCount: 22, totalSpent: 62400, status: 'Active', joinedDate: '2023-11-20' },
        { id: 'CUST-304', name: 'Neha Verma', email: 'neha.verma@gmail.com', ordersCount: 5, totalSpent: 7890, status: 'Suspended', joinedDate: '2024-04-10' },
        { id: 'CUST-305', name: 'Vikram Das', email: 'vikram.das@hotmail.com', ordersCount: 14, totalSpent: 31200, status: 'Active', joinedDate: '2024-01-05' }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const toggleStatus = (id: string, currentStatus: 'Active' | 'Suspended', name: string) => {
        const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
        showToast(`Customer account for "${name}" has been ${nextStatus === 'Suspended' ? 'suspended' : 're-activated'}.`);
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = customers.filter(c => c.status === 'Active').length;
    const suspendedCount = customers.filter(c => c.status === 'Suspended').length;

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-7xl mx-auto relative">
                {/* Toast Notification */}
                {toastMsg && (
                    <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                        {toastMsg}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Customers</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Review and manage registered user accounts</p>
                    </div>
                    
                    {/* Search Field */}
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#2874f0] font-semibold transition-colors"
                        />
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <Search className="w-4 h-4" />
                        </span>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#2874f0]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Customers</p>
                            <p className="text-xl font-black text-gray-800 mt-1">{customers.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Status</p>
                            <p className="text-xl font-black text-gray-800 mt-1">{activeCount} accounts</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Suspended Status</p>
                            <p className="text-xl font-black text-gray-800 mt-1">{suspendedCount} accounts</p>
                        </div>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Customer Directory</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 font-bold">Customer ID</th>
                                    <th className="px-6 py-3.5 font-bold">Full Name</th>
                                    <th className="px-6 py-3.5 font-bold">Email Address</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Orders Placed</th>
                                    <th className="px-6 py-3.5 font-bold">Total Spent</th>
                                    <th className="px-6 py-3.5 font-bold">Joined Date</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Account Status</th>
                                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                                            No customers found matching "{searchQuery}".
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.id}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{c.name}</td>
                                            <td className="px-6 py-4 font-mono text-gray-500">{c.email}</td>
                                            <td className="px-6 py-4 text-center text-gray-800 text-sm font-bold flex items-center justify-center gap-1.5 py-4">
                                                <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                                                {c.ordersCount}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-extrabold">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4 font-mono text-gray-500">{c.joinedDate}</td>
                                            <td className="px-6 py-4 text-center">
                                                {c.status === 'Active' ? (
                                                    <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Active</span>
                                                ) : (
                                                    <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Suspended</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {c.status === 'Active' ? (
                                                    <button
                                                        onClick={() => toggleStatus(c.id, c.status, c.name)}
                                                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto cursor-pointer"
                                                        title="Suspend Customer"
                                                    >
                                                        <Ban className="w-3.5 h-3.5" />
                                                        <span>Block</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleStatus(c.id, c.status, c.name)}
                                                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto cursor-pointer"
                                                        title="Re-activate Customer"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Unblock</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
