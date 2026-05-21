import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { TrendingUp, Award, Zap, CheckCircle2 } from 'lucide-react';

export default function SellerGrowth() {
    const [stats, setStats] = useState<any>(null);
    const [optInPrograms, setOptInPrograms] = useState<Record<string, boolean>>({
        assured: true,
        freeShipping: false,
        regional: false,
    });
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/stats`, { headers })
            .then(r => setStats(r.data))
            .catch(() => {});
    }, []);

    const toggleProgram = (key: string) => {
        setOptInPrograms(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const ordersCount = stats?.totalOrders || 78;
    const earningsAmount = stats?.totalEarnings || 5000;
    const earningsRupees = Math.round(earningsAmount * 82);

    // Tier criteria targets for Gold
    const targetOrders = 100;
    const targetRevenue = 500000;

    const ordersProgress = Math.min((ordersCount / targetOrders) * 100, 100);
    const revenueProgress = Math.min((earningsRupees / targetRevenue) * 100, 100);

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#2874f0]" /> Growth Portal
                        </h2>
                        <p className="text-xs font-medium text-gray-400 mt-1">Unlock programs, scale your operations, and qualify for higher seller tiers to boost your Flipkart sales visibility.</p>
                    </div>
                </div>

                {/* Tier Tracker */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm tracking-wide">Current Tier: <span className="text-[#2874f0]">Silver Seller</span></h3>
                                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Maintain Silver status and track requirements to upgrade to Gold Seller status.</p>
                            </div>
                        </div>
                        <span className="bg-blue-50 text-[#2874f0] border border-blue-100 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                            Silver Tier
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Orders requirement */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-600">
                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Orders Completed</span>
                                <span>{ordersCount} / {targetOrders}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-400 to-[#2874f0] h-full rounded-full transition-all duration-500" style={{ width: `${ordersProgress}%` }}></div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-semibold">{targetOrders - ordersCount > 0 ? `${targetOrders - ordersCount} more orders needed for Gold Tier` : 'Completed!'}</p>
                        </div>

                        {/* Revenue requirement */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-600">
                                <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-yellow-500" /> Revenue (INR)</span>
                                <span>₹{earningsRupees.toLocaleString()} / ₹{targetRevenue.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-400 to-[#2874f0] h-full rounded-full transition-all duration-500" style={{ width: `${revenueProgress}%` }}></div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-semibold">{targetRevenue - earningsRupees > 0 ? `₹${(targetRevenue - earningsRupees).toLocaleString()} more revenue needed for Gold Tier` : 'Completed!'}</p>
                        </div>
                    </div>
                </div>

                {/* Growth Programs Grid */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 text-sm tracking-wide">Flipkart Growth Programs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Flipkart Assured */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="bg-blue-50 text-[#2874f0] p-2 rounded-lg font-bold text-xs uppercase tracking-wide">
                                        F-Assured
                                    </div>
                                    {optInPrograms.assured && (
                                        <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm">Flipkart Assured Badge</h4>
                                <p className="text-xs text-gray-400 font-medium">Attach the trust badge to your listings. Boosts search result page views by up to 40%.</p>
                            </div>
                            <button
                                onClick={() => toggleProgram('assured')}
                                className={`w-full text-center py-2 rounded-lg font-bold text-xs mt-4 transition cursor-pointer ${
                                    optInPrograms.assured
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                        : 'bg-blue-50 text-[#2874f0] hover:bg-blue-100'
                                }`}
                            >
                                {optInPrograms.assured ? 'Deactivate Badge' : 'Opt In / Activate'}
                            </button>
                        </div>

                        {/* Free Shipping */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="bg-purple-50 text-purple-600 p-2 rounded-lg font-bold text-xs uppercase tracking-wide">
                                        Free Ship
                                    </div>
                                    {optInPrograms.freeShipping && (
                                        <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm">Free Shipping Promo</h4>
                                <p className="text-xs text-gray-400 font-medium">Fund shipping on orders over ₹499. Elevate user purchase conversion rate by 22%.</p>
                            </div>
                            <button
                                onClick={() => toggleProgram('freeShipping')}
                                className={`w-full text-center py-2 rounded-lg font-bold text-xs mt-4 transition cursor-pointer ${
                                    optInPrograms.freeShipping
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                        : 'bg-blue-50 text-[#2874f0] hover:bg-blue-100'
                                }`}
                            >
                                {optInPrograms.freeShipping ? 'Cancel Promo' : 'Opt In / Activate'}
                            </button>
                        </div>

                        {/* Regional Procurement */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="bg-orange-50 text-[#fb641b] p-2 rounded-lg font-bold text-xs uppercase tracking-wide">
                                        Fulfillment
                                    </div>
                                    {optInPrograms.regional && (
                                        <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm">Regional Hub Storage</h4>
                                <p className="text-xs text-gray-400 font-medium">Pre-stock items in regional warehouses. Accelerates local customer shipping to same-day delivery.</p>
                            </div>
                            <button
                                onClick={() => toggleProgram('regional')}
                                className={`w-full text-center py-2 rounded-lg font-bold text-xs mt-4 transition cursor-pointer ${
                                    optInPrograms.regional
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                        : 'bg-blue-50 text-[#2874f0] hover:bg-blue-100'
                                }`}
                            >
                                {optInPrograms.regional ? 'Deactivate Regional' : 'Opt In / Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
