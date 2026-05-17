import { useEffect, useState } from 'react';
import {
    Users,
    Package,
    Store,
    ShoppingBag,
    TrendingUp,
    CheckCircle,
    Calendar,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface Stats {
    totalUsers: number;
    totalSellers: number;
    totalProducts: number;
    pendingApproval: number;
    totalOrders: number;
    totalRevenue: number;
}

interface PendingProduct {
    id: string;
    title: string;
    price: number;
    images: string[];
    seller?: { name: string };
    category?: { name: string };
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
        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-xl lg:text-2xl font-black text-gray-800 mt-2 tracking-tight">{value}</p>
                </div>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-5.5 h-5.5 ${iconColor}`} />
                </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
                {isPositive ? (
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        <ArrowUpRight className="w-3.5 h-3.5" /> {trend}
                    </span>
                ) : (
                    <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        <ArrowDownRight className="w-3.5 h-3.5" /> {trend}
                    </span>
                )}
                <span className="text-[11px] text-gray-400 font-semibold">vs last 7 days</span>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [pending, setPending] = useState<PendingProduct[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/admin/stats`, { headers }).then(r => setStats(r.data)).catch(() => {});
        axios.get(`${API_BASE}/admin/products/pending`, { headers }).then(r => setPending(r.data)).catch(() => {});
    }, []);

    const approve = async (id: string) => {
        await axios.patch(`${API_BASE}/admin/products/${id}/approve`, {}, { headers });
        setPending(p => p.filter(x => x.id !== id));
    };

    const reject = async (id: string) => {
        await axios.delete(`${API_BASE}/admin/products/${id}`, { headers });
        setPending(p => p.filter(x => x.id !== id));
    };

    // Projected numbers exactly like the design mockup
    const ordersVal = stats?.totalOrders ? Number(stats.totalOrders).toLocaleString('en-IN') : '1,25,689';
    const revenueVal = stats?.totalRevenue ? `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}` : '₹24,58,71,245';
    const usersVal = stats?.totalUsers ? Number(stats.totalUsers).toLocaleString('en-IN') : '45,68,932';
    const sellersVal = stats?.totalSellers ? Number(stats.totalSellers).toLocaleString('en-IN') : '98,765';
    const productsVal = stats?.totalProducts ? Number(stats.totalProducts).toLocaleString('en-IN') : '12,34,567';

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Dashboard Title & Date Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Dashboard</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Overview of Flipkart Platform</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors self-start sm:self-center">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>May 15, 2025 - May 21, 2025</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                    </button>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        icon={ShoppingBag}
                        label="Total Orders"
                        value={ordersVal}
                        trend="12.5%"
                        isPositive={true}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Total Revenue"
                        value={revenueVal}
                        trend="15.8%"
                        isPositive={true}
                        iconBg="bg-green-50"
                        iconColor="text-green-500"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={usersVal}
                        trend="10.3%"
                        isPositive={true}
                        iconBg="bg-purple-50"
                        iconColor="text-purple-500"
                    />
                    <StatCard
                        icon={Store}
                        label="Total Sellers"
                        value={sellersVal}
                        trend="8.7%"
                        isPositive={true}
                        iconBg="bg-orange-50"
                        iconColor="text-orange-500"
                    />
                    <StatCard
                        icon={Package}
                        label="Total Products"
                        value={productsVal}
                        trend="6.4%"
                        isPositive={true}
                        iconBg="bg-cyan-50"
                        iconColor="text-cyan-500"
                    />
                </div>

                {/* Sales Overview and Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Overview Chart (2/3 width) */}
                    <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Sales Overview</h3>
                            </div>
                            <select className="bg-white border border-gray-200 rounded-md text-[11px] font-bold text-gray-600 px-2.5 py-1.5 outline-none cursor-pointer">
                                <option>This Week</option>
                                <option>This Month</option>
                            </select>
                        </div>
                        {/* Custom High-Fidelity SVG Area Chart */}
                        <div className="relative h-64 w-full">
                            <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2874f0" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#2874f0" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="190" x2="600" y2="190" stroke="#f1f5f9" strokeWidth="1" />
                                
                                {/* Area */}
                                <path
                                    d="M 10 120 C 50 110, 100 130, 150 145 C 200 160, 250 110, 300 95 C 350 80, 400 120, 450 100 C 500 80, 550 50, 590 35 L 590 190 L 10 190 Z"
                                    fill="url(#chartGrad)"
                                />
                                {/* Line */}
                                <path
                                    d="M 10 120 C 50 110, 100 130, 150 145 C 200 160, 250 110, 300 95 C 350 80, 400 120, 450 100 C 500 80, 550 50, 590 35"
                                    fill="none"
                                    stroke="#2874f0"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                                {/* Points */}
                                <circle cx="10" cy="120" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                                <circle cx="100" cy="130" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                                <circle cx="200" cy="160" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                                <circle cx="300" cy="95" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                                <circle cx="400" cy="120" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                                <circle cx="500" cy="80" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                                <circle cx="590" cy="35" r="5" fill="#2874f0" stroke="#ffffff" strokeWidth="2.5" />
                            </svg>
                            {/* Y Axis Labels */}
                            <div className="absolute top-1.5 left-0 text-[10px] text-gray-400 font-bold">25M</div>
                            <div className="absolute top-14 left-0 text-[10px] text-gray-400 font-bold">20M</div>
                            <div className="absolute top-26 left-0 text-[10px] text-gray-400 font-bold">15M</div>
                            <div className="absolute top-38 left-0 text-[10px] text-gray-400 font-bold">10M</div>
                            <div className="absolute top-50 left-0 text-[10px] text-gray-400 font-bold">5M</div>
                            <div className="absolute bottom-1.5 left-0 text-[10px] text-gray-400 font-bold">0</div>
                        </div>
                        {/* X Axis Labels */}
                        <div className="flex justify-between items-center px-2 mt-2 text-[10px] text-gray-500 font-bold">
                            <span>15 May</span>
                            <span>16 May</span>
                            <span>17 May</span>
                            <span>18 May</span>
                            <span>19 May</span>
                            <span>20 May</span>
                            <span>21 May</span>
                        </div>
                    </div>

                    {/* Recent Orders (1/3 width) */}
                    <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Recent Orders</h3>
                                <button className="text-xs font-bold text-[#2874f0] hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                            <th className="py-2.5 font-bold">Order ID</th>
                                            <th className="py-2.5 font-bold">Customer</th>
                                            <th className="py-2.5 font-bold">Amount</th>
                                            <th className="py-2.5 font-bold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                        <tr>
                                            <td className="py-3 font-mono font-bold text-gray-800">OD125689</td>
                                            <td className="py-3">Rohit Sharma</td>
                                            <td className="py-3 font-bold text-gray-900">₹2,999</td>
                                            <td className="py-3 text-right">
                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Delivered</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono font-bold text-gray-800">OD125688</td>
                                            <td className="py-3">Priya Singh</td>
                                            <td className="py-3 font-bold text-gray-900">₹1,499</td>
                                            <td className="py-3 text-right">
                                                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Shipped</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono font-bold text-gray-800">OD125687</td>
                                            <td className="py-3">Amit Kumar</td>
                                            <td className="py-3 font-bold text-gray-900">₹3,599</td>
                                            <td className="py-3 text-right">
                                                <span className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Processing</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono font-bold text-gray-800">OD125686</td>
                                            <td className="py-3">Neha Verma</td>
                                            <td className="py-3 font-bold text-gray-900">₹899</td>
                                            <td className="py-3 text-right">
                                                <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Delivered</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono font-bold text-gray-800">OD125685</td>
                                            <td className="py-3">Vikram Das</td>
                                            <td className="py-3 font-bold text-gray-900">₹2,299</td>
                                            <td className="py-3 text-right">
                                                <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold">Cancelled</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Categories, Top Selling Products & System Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Top Categories */}
                    <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Top Categories</h3>
                            <button className="text-xs font-bold text-[#2874f0] hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                        <th className="py-2 font-bold">Category</th>
                                        <th className="py-2 font-bold">Orders</th>
                                        <th className="py-2 font-bold text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                    <tr>
                                        <td className="py-3 text-gray-800 font-bold">Mobiles</td>
                                        <td className="py-3">25,689</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹8,45,21,245</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-800 font-bold">Electronics</td>
                                        <td className="py-3">18,456</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹6,24,18,987</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-800 font-bold">Fashion</td>
                                        <td className="py-3">32,567</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹4,56,78,123</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-800 font-bold">Home & Kitchen</td>
                                        <td className="py-3">12,345</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹2,35,67,890</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-800 font-bold">Appliances</td>
                                        <td className="py-3">8,765</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹1,45,32,456</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Top Selling Products</h3>
                            <button className="text-xs font-bold text-[#2874f0] hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                        <th className="py-2 font-bold">Product</th>
                                        <th className="py-2 font-bold text-center">Orders</th>
                                        <th className="py-2 font-bold text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                    <tr>
                                        <td className="py-3 flex items-center gap-2">
                                            <span className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-gray-500">PH</span>
                                            <span className="text-gray-800 font-bold truncate max-w-[100px]">iPhone 15</span>
                                        </td>
                                        <td className="py-3 text-center">5,689</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹6,82,45,000</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 flex items-center gap-2">
                                            <span className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-gray-500">SG</span>
                                            <span className="text-gray-800 font-bold truncate max-w-[100px]">Galaxy S24</span>
                                        </td>
                                        <td className="py-3 text-center">4,578</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹4,56,78,900</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 flex items-center gap-2">
                                            <span className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-gray-500">AD</span>
                                            <span className="text-gray-800 font-bold truncate max-w-[100px]">Airdopes 141</span>
                                        </td>
                                        <td className="py-3 text-center">8,456</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹1,26,34,000</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 flex items-center gap-2">
                                            <span className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-gray-500">RN</span>
                                            <span className="text-gray-800 font-bold truncate max-w-[100px]">Narzo 70 Pro</span>
                                        </td>
                                        <td className="py-3 text-center">3,245</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹1,11,23,000</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 flex items-center gap-2">
                                            <span className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-gray-500">DI</span>
                                            <span className="text-gray-800 font-bold truncate max-w-[100px]">Inspiron 15</span>
                                        </td>
                                        <td className="py-3 text-center">2,987</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹98,76,500</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* System Overview */}
                    <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-gray-800 text-[15px] tracking-wide mb-4">System Overview</h3>
                            <div className="space-y-4 text-xs font-bold text-gray-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Total Active Users</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">23,456</span>
                                        <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-1 py-0.2 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 9.2%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Total Active Sellers</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">45,678</span>
                                        <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-1 py-0.2 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 7.6%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Total Active Products</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">8,76,543</span>
                                        <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-1 py-0.2 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 5.3%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Total Transactions</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">3,45,678</span>
                                        <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-1 py-0.2 rounded font-extrabold"><ArrowUpRight className="w-3 h-3" /> 11.8%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-semibold">Conversion Rate</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">2.45%</span>
                                        <span className="flex items-center text-[10px] text-red-600 bg-red-50 px-1 py-0.2 rounded font-extrabold"><ArrowDownRight className="w-3 h-3" /> 1.2%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Product Approvals List */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Pending Product Approvals</h3>
                        <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {pending.length} pending
                        </span>
                    </div>
                    {pending.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                            <p className="text-sm font-semibold">All products approved!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {pending.map(p => (
                                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                    <img
                                        src={p.images?.[0] || '/placeholder.png'}
                                        alt={p.title}
                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[13.5px] text-gray-800 truncate">{p.title}</p>
                                        <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                            {p.category?.name} · Seller: {p.seller?.name || 'Unknown'}
                                        </p>
                                        <p className="text-sm font-black text-gray-800 mt-1">₹{Math.round(Number(p.price) * 82)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => approve(p.id)}
                                            className="px-3.5 py-1.5 bg-[#2874f0] text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition shadow-sm"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => reject(p.id)}
                                            className="px-3.5 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-650 transition shadow-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold border-t border-gray-200 pt-5 mt-8">
                    <span>© 2007-2025 Flipkart.com. All rights reserved.</span>
                    <span>v4.2.1</span>
                </div>
            </div>
        </AdminLayout>
    );
}
