import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ScrollText, Search, Trash2, ShieldAlert, Calendar, RefreshCw } from 'lucide-react';

interface AuditLogRecord {
    id: string;
    timestamp: string;
    operator: string;
    category: 'Auth' | 'Products' | 'Orders' | 'Users' | 'System';
    description: string;
    ipAddress: string;
}

export default function AdminLogs() {
    const [logs, setLogs] = useState<AuditLogRecord[]>([
        { id: 'LOG-001', timestamp: '2025-05-21 11:05 AM', operator: 'admin@flipkart.com', category: 'Products', description: 'Approved product ID 4958 ("70mai Pro Dashcam 4K")', ipAddress: '192.168.1.102' },
        { id: 'LOG-002', timestamp: '2025-05-21 10:42 AM', operator: 'admin@flipkart.com', category: 'Auth', description: 'Successful administrator login', ipAddress: '192.168.1.102' },
        { id: 'LOG-003', timestamp: '2025-05-20 04:15 PM', operator: 'admin@flipkart.com', category: 'Orders', description: 'Updated order status to Shipped for OD125688', ipAddress: '192.168.1.102' },
        { id: 'LOG-004', timestamp: '2025-05-20 02:30 PM', operator: 'admin@flipkart.com', category: 'Users', description: 'Suspended user account neha.verma@gmail.com', ipAddress: '10.0.12.44' },
        { id: 'LOG-005', timestamp: '2025-05-19 09:12 AM', operator: 'admin@flipkart.com', category: 'System', description: 'Modified commission rate from 8% to 10%', ipAddress: '192.168.1.102' },
        { id: 'LOG-006', timestamp: '2025-05-18 01:25 PM', operator: 'admin@flipkart.com', category: 'Products', description: 'Rejected product ID 4956 ("Fake Brand Shoes")', ipAddress: '10.0.12.44' }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleClearLogs = () => {
        if (confirm('Are you sure you want to clear all administrative audit logs? This action is permanent.')) {
            setLogs([]);
            showToast('Audit logs database successfully cleared.');
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              log.ipAddress.includes(searchQuery);
        const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Audit logs</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Platform administrative events and login security history logs</p>
                    </div>
                    {logs.length > 0 && (
                        <button
                            onClick={handleClearLogs}
                            className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg px-4 py-2.5 shadow-sm text-xs font-bold hover:bg-red-100 transition-colors self-start sm:self-center cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear Audit Logs</span>
                        </button>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 self-start md:self-center">
                        {['All', 'Auth', 'Products', 'Orders', 'Users', 'System'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-[#172337] text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Filter by operator, IP, or keywords..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 pl-9 pr-4 py-2 border border-transparent rounded-lg text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-gray-200 focus:bg-white transition-all font-semibold"
                        />
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                        <ScrollText className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Audit Trail</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 font-bold">Timestamp</th>
                                    <th className="px-6 py-3.5 font-bold">Operator</th>
                                    <th className="px-6 py-3.5 font-bold">Category</th>
                                    <th className="px-6 py-3.5 font-bold">Event Description</th>
                                    <th className="px-6 py-3.5 font-bold">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                                            No audit logs found matching selected criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-500 flex items-center gap-1.5 py-4">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {log.timestamp}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-bold">{log.operator}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                                    log.category === 'Auth'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                        : log.category === 'Products'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                        : log.category === 'Orders'
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : log.category === 'Users'
                                                        ? 'bg-red-50 text-red-700 border-red-100'
                                                        : 'bg-orange-50 text-orange-700 border-orange-100'
                                                }`}>
                                                    {log.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-800 font-semibold">{log.description}</td>
                                            <td className="px-6 py-4 font-mono text-gray-500">{log.ipAddress}</td>
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
