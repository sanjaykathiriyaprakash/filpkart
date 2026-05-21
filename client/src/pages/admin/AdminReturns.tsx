import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { RotateCcw, AlertTriangle, Check, X, RefreshCw } from 'lucide-react';

interface ReturnRequest {
    id: string;
    orderId: string;
    customerName: string;
    productTitle: string;
    refundAmount: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
}

export default function AdminReturns() {
    const [requests, setRequests] = useState<ReturnRequest[]>([
        { id: 'RET-201', orderId: 'OD125689', customerName: 'Rohit Sharma', productTitle: '70mai Pro Dashcam 4K Front & Rear', refundAmount: 10578, reason: 'Device fails to boot, screen stays black', status: 'Pending', date: '2025-05-20' },
        { id: 'RET-202', orderId: 'OD125695', customerName: 'Neha Verma', productTitle: 'Wings of Fire - APJ Abdul Kalam', refundAmount: 1476, reason: 'Received torn pages in the book', status: 'Pending', date: '2025-05-21' },
        { id: 'RET-203', orderId: 'OD125680', customerName: 'Vikram Das', productTitle: 'Steelbird SBA-1 Flip-Up Helmet', refundAmount: 7298, reason: 'Size too small, does not fit comfortably', status: 'Approved', date: '2025-05-18' },
        { id: 'RET-204', orderId: 'OD125672', customerName: 'Aman Deep', productTitle: 'Wrangler Men Regular Fit Jeans', refundAmount: 2460, reason: 'Color differs significantly from images', status: 'Rejected', date: '2025-05-14' }
    ]);

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleAction = (id: string, action: 'Approved' | 'Rejected', customer: string, amount: number) => {
        setProcessingId(id + '_' + action);
        setTimeout(() => {
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
            setProcessingId(null);
            showToast(`Return request ${id} (₹${amount.toLocaleString('en-IN')}) for ${customer} has been ${action.toLowerCase()}.`);
        }, 1200);
    };

    const pendingCount = requests.filter(r => r.status === 'Pending').length;

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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Returns & Refunds</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Review and process platform refund/return request tickets</p>
                    </div>
                </div>

                {/* Return Dashboard Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Pending Returns</p>
                            <p className="text-xl font-black text-gray-800 mt-1">{pendingCount} requests</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Refunds Approved</p>
                            <p className="text-xl font-black text-gray-800 mt-1">
                                {requests.filter(r => r.status === 'Approved').length} requests
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-[#2874f0]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Return Rate</p>
                            <p className="text-xl font-black text-gray-800 mt-1">1.8%</p>
                        </div>
                    </div>
                </div>

                {/* Returns Table */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Customer Return Requests</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 font-bold">Return ID</th>
                                    <th className="px-6 py-3.5 font-bold">Order ID</th>
                                    <th className="px-6 py-3.5 font-bold">Customer</th>
                                    <th className="px-6 py-3.5 font-bold">Product</th>
                                    <th className="px-6 py-3.5 font-bold">Refund Amount</th>
                                    <th className="px-6 py-3.5 font-bold">Reason</th>
                                    <th className="px-6 py-3.5 font-bold">Request Date</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Status</th>
                                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {requests.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-900">{r.id}</td>
                                        <td className="px-6 py-4 font-mono font-bold text-gray-500">{r.orderId}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{r.customerName}</td>
                                        <td className="px-6 py-4 text-gray-800 truncate max-w-xs">{r.productTitle}</td>
                                        <td className="px-6 py-4 text-gray-900 font-black">₹{r.refundAmount.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={r.reason}>{r.reason}</td>
                                        <td className="px-6 py-4 font-mono text-gray-500">{r.date}</td>
                                        <td className="px-6 py-4 text-center">
                                            {r.status === 'Approved' ? (
                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Approved</span>
                                            ) : r.status === 'Rejected' ? (
                                                <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Rejected</span>
                                            ) : (
                                                <span className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.status === 'Pending' ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleAction(r.id, 'Approved', r.customerName, r.refundAmount)}
                                                        disabled={processingId !== null}
                                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Approve Refund"
                                                    >
                                                        {processingId === r.id + '_Approved' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(r.id, 'Rejected', r.customerName, r.refundAmount)}
                                                        disabled={processingId !== null}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Reject Request"
                                                    >
                                                        {processingId === r.id + '_Rejected' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic block text-right">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
