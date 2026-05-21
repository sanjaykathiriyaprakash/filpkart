import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { Megaphone, Tag, Image, Sparkles, TrendingUp, BarChart2, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

interface CampaignItem {
    id: string;
    title: string;
    target: string;
    clicks: number;
    ctr: string;
    status: 'Active' | 'Inactive';
    startDate: string;
}

export default function AdminMarketing() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<CampaignItem[]>([
        { id: 'CAMP-401', title: 'Summer Special Electronics Fest', target: 'Mobiles & Laptops', clicks: 28450, ctr: '4.8%', status: 'Active', startDate: '2025-05-15' },
        { id: 'CAMP-402', title: 'Ethnic Fashion Clearance Sale', target: 'Sarees & Kurtas', clicks: 12340, ctr: '3.9%', status: 'Active', startDate: '2025-05-18' },
        { id: 'CAMP-403', title: 'Republic Day mega carnival', target: 'All Categories', clicks: 89760, ctr: '6.2%', status: 'Inactive', startDate: '2025-01-20' },
        { id: 'CAMP-404', title: 'Monsoon Home & Decor Deals', target: 'Furniture & Kitchen', clicks: 0, ctr: '0.0%', status: 'Inactive', startDate: '2025-06-10' }
    ]);

    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const toggleCampaignStatus = (id: string, currentStatus: 'Active' | 'Inactive', title: string) => {
        const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
        showToast(`Campaign "${title}" is now ${nextStatus.toLowerCase()}.`);
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
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Marketing & Promotions</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Manage discounts, promotional banners, and campaign performance</p>
                    </div>
                </div>

                {/* Redirect Control Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coupons Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-48">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                <Tag className="w-6 h-6 text-[#2874f0]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">Discount Coupons</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1">Create discount codes, set purchase thresholds, and configure coupon limits.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/coupons')}
                            className="w-full bg-[#2874f0] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-sm cursor-pointer"
                        >
                            Manage Coupons
                        </button>
                    </div>

                    {/* Banners Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-48">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                <Image className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">Homepage Banners</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1">Upload promo image slides, schedule display timers, and link banners to categories.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/banners')}
                            className="w-full bg-[#2874f0] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition shadow-sm cursor-pointer"
                        >
                            Manage Banner Slides
                        </button>
                    </div>
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Promo Impressions</p>
                            <p className="text-xl font-black text-gray-800 mt-1">1,24,560 clicks</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-cyan-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Average CTR</p>
                            <p className="text-xl font-black text-gray-800 mt-1">4.3%</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <BarChart2 className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Campaigns</p>
                            <p className="text-xl font-black text-gray-800 mt-1">
                                {campaigns.filter(c => c.status === 'Active').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Promotional Campaigns List */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Platform Campaigns</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 font-bold">Campaign Name</th>
                                    <th className="px-6 py-3.5 font-bold">Target Catalog</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Clicks</th>
                                    <th className="px-6 py-3.5 font-bold text-center">CTR</th>
                                    <th className="px-6 py-3.5 font-bold">Start Date</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Status</th>
                                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {campaigns.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 text-sm flex items-center gap-2">
                                            <Megaphone className="w-4 h-4 text-gray-400 shrink-0" />
                                            {c.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-bold">{c.target}</td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-800">{c.clicks.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center font-bold text-blue-600 bg-blue-50/50 rounded-lg py-1 px-2.5 w-max mx-auto block mt-3">
                                            {c.ctr}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-500 flex items-center gap-1.5 py-4">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            {c.startDate}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {c.status === 'Active' ? (
                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Active</span>
                                            ) : (
                                                <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleCampaignStatus(c.id, c.status, c.title)}
                                                className="p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                                                title="Toggle status"
                                            >
                                                {c.status === 'Active' ? (
                                                    <ToggleRight className="w-9 h-9 text-green-500" />
                                                ) : (
                                                    <ToggleLeft className="w-9 h-9 text-gray-300" />
                                                )}
                                            </button>
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
