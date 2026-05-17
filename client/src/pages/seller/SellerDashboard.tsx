import { useEffect, useState } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Tag,
    Mail,
    ArrowUpRight,
    ArrowDownRight,
    Plus
} from 'lucide-react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Link } from 'react-router-dom';

interface Stats {
    totalProducts: number;
    totalStock: number;
    totalEarnings: number;
    totalOrders: number;
}

function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    isPositive,
    iconBg,
    iconColor
}: {
    icon: any;
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-gray-800 mt-2 tracking-tight">{value}</p>
                </div>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-5.5 h-5.5 ${iconColor}`} />
                </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-[11px] font-bold">
                {isPositive ? (
                    <span className="flex items-center text-green-600">
                        <ArrowUpRight className="w-3.5 h-3.5" /> {trend}
                    </span>
                ) : (
                    <span className="flex items-center text-red-600">
                        <ArrowDownRight className="w-3.5 h-3.5" /> {trend}
                    </span>
                )}
                <span className="text-gray-400 font-semibold">vs yesterday</span>
            </div>
        </div>
    );
}

export default function SellerDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/stats`, { headers }).then(r => setStats(r.data)).catch(() => {});
        axios.get(`${API_BASE}/seller/products`, { headers }).then(r => setRecentProducts(r.data.slice(0, 5))).catch(() => {});
    }, []);

    // Projections matching the high-fidelity mock
    const ordersVal = stats?.totalOrders ? String(stats.totalOrders) : '128';
    const salesVal = stats?.totalEarnings ? `₹${Number(stats.totalEarnings * 82).toLocaleString('en-IN')}` : '₹1,72,369';
    const listingsVal = stats?.totalProducts ? String(stats.totalProducts) : '2,742';

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Dashboard Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={ShoppingBag}
                        label="Orders"
                        value={ordersVal}
                        trend="12%"
                        isPositive={true}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Sales"
                        value={salesVal}
                        trend="8%"
                        isPositive={true}
                        iconBg="bg-slate-100"
                        iconColor="text-slate-500"
                    />
                    <StatCard
                        icon={Tag}
                        label="Active Listings"
                        value={listingsVal}
                        trend="2%"
                        isPositive={false}
                        iconBg="bg-slate-100"
                        iconColor="text-slate-500"
                    />
                    <StatCard
                        icon={Mail}
                        label="Buyer Messages"
                        value="32"
                        trend="11%"
                        isPositive={false}
                        iconBg="bg-slate-100"
                        iconColor="text-slate-500"
                    />
                </div>

                {/* Sales Overview SVG Chart & Sales Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SVG Chart Area */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 text-sm tracking-wide">Sales Overview</h3>
                            <select className="bg-white border border-gray-200 rounded-md text-[11px] font-bold text-gray-600 px-2 py-1 outline-none">
                                <option>This Week</option>
                            </select>
                        </div>
                        <div className="relative h-56 w-full">
                            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="sellerGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2874f0" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#2874f0" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                                
                                <path
                                    d="M 10 100 C 60 70, 120 120, 180 90 C 240 70, 300 110, 360 85 C 420 70, 480 50, 590 30 L 590 180 L 10 180 Z"
                                    fill="url(#sellerGrad)"
                                />
                                <path
                                    d="M 10 100 C 60 70, 120 120, 180 90 C 240 70, 300 110, 360 85 C 420 70, 480 50, 590 30"
                                    fill="none"
                                    stroke="#2874f0"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <circle cx="10" cy="100" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                                <circle cx="100" cy="80" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                                <circle cx="200" cy="110" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                                <circle cx="300" cy="90" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                                <circle cx="400" cy="75" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                                <circle cx="500" cy="50" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                                <circle cx="590" cy="30" r="4" fill="#2874f0" stroke="#fff" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold px-2 mt-2">
                            <span>15 May</span>
                            <span>16 May</span>
                            <span>17 May</span>
                            <span>18 May</span>
                            <span>19 May</span>
                            <span>20 May</span>
                            <span>21 May</span>
                        </div>
                    </div>

                    {/* Sales Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 text-sm tracking-wide">Sales Summary</h3>
                                <span className="text-[11px] font-bold text-gray-400">This Week</span>
                            </div>
                            <div className="space-y-4 text-xs font-bold text-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 font-semibold text-[10px] uppercase block">GMV</span>
                                        <span className="text-gray-800 text-[13px] font-black">{salesVal}</span>
                                    </div>
                                    <span className="text-green-600 flex items-center text-[10px] bg-green-50 px-1 rounded"><ArrowUpRight className="w-3 h-3" /> 8%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 font-semibold text-[10px] uppercase block">Total Orders</span>
                                        <span className="text-gray-800 text-[13px] font-black">{ordersVal}</span>
                                    </div>
                                    <span className="text-green-600 flex items-center text-[10px] bg-green-50 px-1 rounded"><ArrowUpRight className="w-3 h-3" /> 12%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 font-semibold text-[10px] uppercase block">Units Sold</span>
                                        <span className="text-gray-800 text-[13px] font-black">145</span>
                                    </div>
                                    <span className="text-green-600 flex items-center text-[10px] bg-green-50 px-1 rounded"><ArrowUpRight className="w-3 h-3" /> 10%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 font-semibold text-[10px] uppercase block">Average Order Value</span>
                                        <span className="text-gray-800 text-[13px] font-black">₹1,346</span>
                                    </div>
                                    <span className="text-red-600 flex items-center text-[10px] bg-red-50 px-1 rounded"><ArrowDownRight className="w-3 h-3" /> 3%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Third Row Panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Overview */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-sm tracking-wide">Order Overview</h3>
                            <span className="text-[11px] font-bold text-gray-400">This Week</span>
                        </div>
                        <div className="space-y-3.5 text-xs font-bold text-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-semibold">Total Orders</span>
                                <div className="flex items-center gap-2">
                                    <span>{ordersVal}</span>
                                    <span className="text-green-600 flex items-center text-[9px] bg-green-50 px-1 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 12%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-semibold">Delivered</span>
                                <div className="flex items-center gap-2">
                                    <span>96</span>
                                    <span className="text-green-600 flex items-center text-[9px] bg-green-50 px-1 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 14%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-semibold">Cancelled</span>
                                <div className="flex items-center gap-2">
                                    <span>14</span>
                                    <span className="text-red-600 flex items-center text-[9px] bg-red-50 px-1 rounded font-extrabold"><ArrowDownRight className="w-3 h-3" /> 7%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-semibold">Returned</span>
                                <div className="flex items-center gap-2">
                                    <span>18</span>
                                    <span className="text-red-600 flex items-center text-[9px] bg-red-50 px-1 rounded font-extrabold"><ArrowDownRight className="w-3 h-3" /> 3%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-semibold">Pending</span>
                                <div className="flex items-center gap-2">
                                    <span>12</span>
                                    <span className="text-green-600 flex items-center text-[9px] bg-green-50 px-1 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 5%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Listings Panel */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm tracking-wide mb-4">Listings</h3>
                            <div className="space-y-4 text-xs font-bold text-gray-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Total Listings</span>
                                    <span>{listingsVal}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Active Listings</span>
                                    <div className="flex items-center gap-2">
                                        <span>2,317</span>
                                        <span className="text-green-600 flex items-center text-[9px] bg-green-50 px-1 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 16%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Inactive Listings</span>
                                    <div className="flex items-center gap-2">
                                        <span>425</span>
                                        <span className="text-red-600 flex items-center text-[9px] bg-red-50 px-1 rounded font-extrabold"><ArrowDownRight className="w-3 h-3" /> 4%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/seller/products" className="text-xs font-bold text-[#2874f0] hover:underline pt-3 border-t border-gray-100 block">Manage Listings</Link>
                    </div>

                    {/* Payments Panel */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 text-sm tracking-wide">Payments</h3>
                                <Link to="/seller/earnings" className="text-xs font-bold text-[#2874f0] hover:underline">View All</Link>
                            </div>
                            <div className="space-y-3.5 text-xs font-semibold text-gray-700">
                                <div>
                                    <span className="text-gray-400 font-semibold text-[9px] uppercase block">Pending</span>
                                    <span className="text-gray-800 text-[13px] font-black">₹24,680</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-semibold text-[9px] uppercase block">Next Payout</span>
                                    <span className="text-green-600 text-[13px] font-black">₹48,920</span>
                                    <span className="text-[10px] text-gray-400 block font-bold">23 May 2024</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-semibold text-[9px] uppercase block">Paid (This Month)</span>
                                    <span className="text-gray-800 text-[13px] font-black">₹3,24,780</span>
                                    <span className="text-[10px] text-gray-400 block font-bold">1 May - 21 May 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Products Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-sm tracking-wide">My Products</h3>
                        <Link to="/seller/products/add"
                            className="flex items-center gap-1.5 bg-[#fb641b] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#f35200] transition shadow-md shadow-orange-500/10">
                            <Plus className="w-4 h-4" /> Add Product
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentProducts.length === 0 ? (
                            <div className="py-16 text-center text-gray-400 text-sm font-semibold">No products yet. Add your first product to start earning!</div>
                        ) : recentProducts.map(p => (
                            <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                <img src={p.images?.[0] || '/placeholder.png'} className="w-11 h-11 object-cover rounded-lg border border-gray-200" alt="" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[13.5px] text-gray-800 truncate">{p.title}</p>
                                    <p className="text-xs text-gray-400 font-semibold mt-0.5">{p.category?.name} · Stock Units: {p.stock}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-800">₹{Math.round(Number(p.price) * 82)}</p>
                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border mt-1 block ${
                                        p.isApproved
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                    }`}>
                                        {p.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
