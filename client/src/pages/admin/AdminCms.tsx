import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FileText, Save, Info, Globe, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminCms() {
    const [notice, setNotice] = useState('⚡ Big Billion Days Sale is coming soon! Get up to 80% off on Mobiles, Laptops, and Fashion.');
    const [contactPhone, setContactPhone] = useState('1800-208-9898');
    const [contactEmail, setContactEmail] = useState('support@flipkart.com');
    const [seoTitle, setSeoTitle] = useState('Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!');
    const [seoMeta, setSeoMeta] = useState('Flipkart.com: Explore online shopping site. Buy mobile phones, laptops, clothing, shoes, toys at best prices.');

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
            showToast('CMS changes successfully saved and applied globally!');
        }, 1500);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto relative">
                {/* Toast Notification */}
                {toastMsg && (
                    <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                        {toastMsg}
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">CMS Page Content Editor</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Manage global static text, contact channels, announcements, and SEO meta values</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Homepage Notice Segment */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Info className="w-5 h-5 text-[#2874f0]" />
                            <h3 className="font-bold text-gray-800 text-sm">Homepage Announcement Banner</h3>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Active Header Announcement Notice</label>
                            <textarea
                                value={notice}
                                onChange={e => setNotice(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm h-20 outline-none focus:border-[#2874f0] font-semibold resize-none"
                                placeholder="E.g. Free shipping on all products today!"
                            />
                            <p className="text-[10px] text-gray-400 font-semibold">This alert message displays at the top header banner of the buyer catalog store.</p>
                        </div>
                    </div>

                    {/* SEO Settings Segment */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Globe className="w-5 h-5 text-green-500" />
                            <h3 className="font-bold text-gray-800 text-sm">SEO Meta Configurations</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Page Title Tag</label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={e => setSeoTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    placeholder="Enter title text..."
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Meta Description Tag</label>
                                <textarea
                                    value={seoMeta}
                                    onChange={e => setSeoMeta(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm h-24 outline-none focus:border-[#2874f0] font-semibold resize-none"
                                    placeholder="Enter description summary..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Support Contact Settings Segment */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <ShieldAlert className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold text-gray-800 text-sm">Footer Contact Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Support Toll-Free Number</label>
                                <input
                                    type="text"
                                    value={contactPhone}
                                    onChange={e => setContactPhone(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    placeholder="e.g. 1800-123-4567"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Support Helpdesk Email</label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={e => setContactEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                    placeholder="e.g. support@store.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Action */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#2874f0] text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            {isSaving ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    <span>Saving Settings...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save and Publish Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
