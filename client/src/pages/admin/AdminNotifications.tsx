import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Bell, Send, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface NotificationLog {
    id: string;
    title: string;
    message: string;
    target: string;
    recipientCount: number;
    sentAt: string;
}

export default function AdminNotifications() {
    const [target, setTarget] = useState('All Users');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    
    const [logs, setLogs] = useState<NotificationLog[]>([
        { id: 'NOTIF-1', title: 'System Maintenance Scheduled', message: 'The seller hub services will undergo a 1-hour scheduled maintenance window starting Sunday at 2 AM IST.', target: 'Sellers Only', recipientCount: 98765, sentAt: '2025-05-18 10:45 AM' },
        { id: 'NOTIF-2', title: 'Big Billion Days Coupons Released', message: 'New flat 10% discount codes are now active for categories including Electronics and Mobiles.', target: 'Customers Only', recipientCount: 4568932, sentAt: '2025-05-15 03:20 PM' },
        { id: 'NOTIF-3', title: 'Platform Fee policy Update', message: 'Refer to the updated terms outlining changes in logistics charges and category commissions.', target: 'Sellers Only', recipientCount: 98700, sentAt: '2025-05-12 09:15 AM' }
    ]);

    const [isSending, setIsSending] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleBroadcast = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) return;

        setIsSending(true);

        setTimeout(() => {
            const count = target === 'All Users' ? 4667697 : target === 'Sellers Only' ? 98765 : 4568932;
            const newLog: NotificationLog = {
                id: 'NOTIF-' + (logs.length + 1),
                title,
                message,
                target,
                recipientCount: count,
                sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };

            setLogs([newLog, ...logs]);
            setTitle('');
            setMessage('');
            setIsSending(false);
            showToast(`Broadcast "${newLog.title}" delivered to ${newLog.recipientCount.toLocaleString()} users successfully!`);
        }, 1500);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-6xl mx-auto relative">
                {/* Toast Notification */}
                {toastMsg && (
                    <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                        {toastMsg}
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">System Notifications</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Broadcast system alerts, platform updates, and promo newsletters</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Broadcast Form (2/3 width) */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Send className="w-5 h-5 text-[#2874f0]" />
                            <h3 className="font-bold text-gray-800 text-sm">Send New Broadcast Notification</h3>
                        </div>

                        <form onSubmit={handleBroadcast} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Target Recipient Audience</label>
                                <select
                                    value={target}
                                    onChange={e => setTarget(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold cursor-pointer"
                                >
                                    <option>All Users</option>
                                    <option>Sellers Only</option>
                                    <option>Customers Only</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Notification Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    placeholder="Enter subject header..."
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Message Description</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm h-32 outline-none focus:border-[#2874f0] font-semibold resize-none"
                                    placeholder="Type broadcast message details..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="flex items-center gap-2 bg-[#2874f0] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-md disabled:opacity-50 cursor-pointer"
                                >
                                    {isSending ? (
                                        <>
                                            <Sparkles className="w-4 h-4 animate-spin" />
                                            <span>Sending Alert...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Send Broadcast Alert</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick Stats sidebar (1/3 width) */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between h-80">
                        <div>
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                                <Bell className="w-5 h-5 text-green-500" />
                                <h3 className="font-bold text-gray-800 text-sm">Audience Metrics</h3>
                            </div>
                            <div className="space-y-4 text-xs font-bold text-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 font-semibold">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>Total Platform Reach</span>
                                    </div>
                                    <span className="text-gray-800 text-sm">4,667,697</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 font-semibold">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>Sellers Database</span>
                                    </div>
                                    <span className="text-gray-800 text-sm">98,765</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 font-semibold">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>Customers Database</span>
                                    </div>
                                    <span className="text-gray-800 text-sm">4,568,932</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 flex gap-2.5">
                            <ShieldAlert className="w-5 h-5 text-[#2874f0] shrink-0" />
                            <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                                Alerts published on this console trigger real-time device push notices and appear in user/seller notifications dashboards.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Historic Logs */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Historic Alert Delivery Logs</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {logs.map(log => (
                            <div key={log.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                <div className="space-y-1.5 flex-1 max-w-3xl">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-[#2874f0] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">{log.target}</span>
                                        <h4 className="font-bold text-gray-800 text-sm">{log.title}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium leading-normal">{log.message}</p>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between md:items-end text-xs font-semibold shrink-0 text-gray-400">
                                    <span className="font-mono">{log.sentAt}</span>
                                    <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full mt-1.5 w-max">
                                        {log.recipientCount.toLocaleString()} delivered
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
