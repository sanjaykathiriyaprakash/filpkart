import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle, RefreshCw } from 'lucide-react';

interface PayoutRecord {
    id: string;
    sellerName: string;
    amount: number;
    commission: number;
    netAmount: number;
    status: 'Pending' | 'Processing' | 'Completed';
    date: string;
}

export default function AdminPayments() {
    const [payouts, setPayouts] = useState<PayoutRecord[]>([
        { id: 'PAY-1001', sellerName: 'Super Seller Store', amount: 85400, commission: 8540, netAmount: 76860, status: 'Pending', date: '2025-05-20' },
        { id: 'PAY-1002', sellerName: 'Fashion Hub Outlet', amount: 32900, commission: 3290, netAmount: 29610, status: 'Pending', date: '2025-05-21' },
        { id: 'PAY-1003', sellerName: 'BookWorm Publishers', amount: 14600, commission: 1460, netAmount: 13140, status: 'Completed', date: '2025-05-18' },
        { id: 'PAY-1004', sellerName: 'GadgetZone Tech', amount: 189000, commission: 18900, netAmount: 170100, status: 'Completed', date: '2025-05-15' },
        { id: 'PAY-1005', sellerName: 'HomeStyle Furnishings', amount: 48500, commission: 4850, netAmount: 43650, status: 'Completed', date: '2025-05-12' }
    ]);

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const processPayout = (id: string, seller: string, amount: number) => {
        setProcessingId(id);
        
        // Mock processing delay
        setTimeout(() => {
            setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'Completed', date: new Date().toISOString().split('T')[0] } : p));
            setProcessingId(null);
            showToast(`Payout of ₹${amount.toLocaleString('en-IN')} released to ${seller} successfully!`);
        }, 1500);
    };

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
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Payments</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Platform commissions, fees, and seller payouts</p>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Commission Earned (10%)</p>
                            <p className="text-2xl font-black text-gray-800 mt-2">₹24,58,712</p>
                            <span className="flex items-center text-[10px] font-extrabold text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-2.5 w-max">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2% vs last month
                            </span>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-[#2874f0]" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Settled Payouts</p>
                            <p className="text-2xl font-black text-gray-800 mt-2">₹1,84,56,900</p>
                            <span className="flex items-center text-[10px] font-extrabold text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-2.5 w-max">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +8.9% payouts completed
                            </span>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Pending Settlements</p>
                            <p className="text-2xl font-black text-gray-800 mt-2">₹1,18,300</p>
                            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded mt-2.5 w-max block">
                                Requires authorization
                            </span>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Seller Payout Table */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Payout Settlement Queue</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 font-bold">Payout ID</th>
                                    <th className="px-6 py-3.5 font-bold">Seller Store</th>
                                    <th className="px-6 py-3.5 font-bold">Gross Sales</th>
                                    <th className="px-6 py-3.5 font-bold">Commission Deducted</th>
                                    <th className="px-6 py-3.5 font-bold">Net Payout</th>
                                    <th className="px-6 py-3.5 font-bold">Date Initiated</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Status</th>
                                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {payouts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-900">{p.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{p.sellerName}</td>
                                        <td className="px-6 py-4 text-gray-700">₹{p.amount.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-red-500 font-bold">₹{p.commission.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-gray-900 font-extrabold">₹{p.netAmount.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 font-mono text-gray-500">{p.date}</td>
                                        <td className="px-6 py-4 text-center">
                                            {p.status === 'Completed' ? (
                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Completed</span>
                                            ) : p.status === 'Processing' ? (
                                                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Processing</span>
                                            ) : (
                                                <span className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {p.status === 'Pending' ? (
                                                <button
                                                    onClick={() => processPayout(p.id, p.sellerName, p.netAmount)}
                                                    disabled={processingId !== null}
                                                    className="px-3.5 py-1.5 bg-[#2874f0] text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5 ml-auto cursor-pointer"
                                                >
                                                    {processingId === p.id && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                                    <span>Release Payout</span>
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Settled</span>
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
