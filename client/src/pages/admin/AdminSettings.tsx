import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Settings, Save, ShieldAlert, Sparkles, Server, CheckSquare } from 'lucide-react';

export default function AdminSettings() {
    const [commissionRate, setCommissionRate] = useState(10);
    const [maxTransactionLimit, setMaxTransactionLimit] = useState(500000);
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
    const [smtpHost, setSmtpHost] = useState('smtp.flipkart-corp.internal');
    const [smtpPort, setSmtpPort] = useState(587);

    const [isSaving, setIsSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showToast('Global system configuration successfully updated.');
        }, 1500);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-4xl mx-auto relative">
                {/* Toast Notification */}
                {toastMsg && (
                    <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                        {toastMsg}
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">System Settings</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Configure global application variables, payment fees, limits, and server channels</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Settings className="w-5 h-5 text-[#2874f0]" />
                            <h3 className="font-bold text-gray-800 text-sm">E-Commerce Business Rules</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Commission Rate (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={commissionRate}
                                    onChange={e => setCommissionRate(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Max Order Transaction Limit (₹)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={maxTransactionLimit}
                                    onChange={e => setMaxTransactionLimit(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Server Settings */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Server className="w-5 h-5 text-green-500" />
                            <h3 className="font-bold text-gray-800 text-sm">SMTP Mail Server Config</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">SMTP Hostname</label>
                                <input
                                    type="text"
                                    value={smtpHost}
                                    onChange={e => setSmtpHost(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">SMTP Port Number</label>
                                <input
                                    type="number"
                                    value={smtpPort}
                                    onChange={e => setSmtpPort(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operational Toggles */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <CheckSquare className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold text-gray-800 text-sm">Platform Operational Toggles</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-700">Platform Maintenance Mode</h4>
                                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Toggle to place the buyer storefront database offline under a maintenance banner.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isMaintenance}
                                        onChange={e => setIsMaintenance(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2874f0]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-700">Guest Customer Checkout</h4>
                                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Allow non-registered anonymous shopping carts to proceed to order checkout steps.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={allowGuestCheckout}
                                        onChange={e => setAllowGuestCheckout(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2874f0]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Warning Alert */}
                    <div className="bg-red-50 border border-red-150 rounded-xl p-4 flex gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                            <h4 className="text-xs font-extrabold text-red-700 uppercase tracking-wide">Caution: Global State Impact</h4>
                            <p className="text-[10px] text-red-600 font-semibold mt-0.5 leading-normal">
                                Modifying these parameters affects active checkout validations, commission payouts, and mailer server alerts in real-time. Ensure settings comply with policy.
                            </p>
                        </div>
                    </div>

                    {/* Save Buttons */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#2874f0] text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            {isSaving ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    <span>Applying Updates...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Settings</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
