import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { TrendingUp, Award, DollarSign } from 'lucide-react';

export default function SellerAnalytics() {
    const [analytics, setAnalytics] = useState<{ monthlySales: any[], topProducts: any[], totalRevenue: number }>({ monthlySales: [], topProducts: [], totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/analytics`, { headers })
            .then(r => setAnalytics(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const maxSales = Math.max(...analytics.monthlySales.map(m => m.sales), 1);

    return (
        <SellerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-800">Total Revenue</h2>
                        <div className="bg-orange-100 p-2 rounded-full text-[#fb641b]"><DollarSign className="w-5 h-5" /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹{Math.round(analytics.totalRevenue * 82).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-500" /> Monthly Sales Trend
                        </h2>
                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
                        ) : analytics.monthlySales.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-gray-400">No sales data available</div>
                        ) : (
                            <div className="h-64 flex items-end gap-4 px-4 pb-8 pt-4 border-b border-l border-gray-200 relative">
                                {analytics.monthlySales.slice(-6).map(item => {
                                    const heightPercentage = (item.sales / maxSales) * 100;
                                    return (
                                        <div key={item.month} className="flex-1 flex flex-col items-center group relative">
                                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                                ₹{Math.round(item.sales * 82).toLocaleString()}
                                            </div>
                                            <div 
                                                className="w-full bg-[#fb641b] hover:bg-[#e45a16] transition-colors rounded-t-sm" 
                                                style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                                            ></div>
                                            <span className="absolute -bottom-6 text-[10px] text-gray-500">
                                                {item.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-gray-500" /> Top Performing Products
                        </h2>
                        {loading ? (
                            <div className="py-20 text-center text-gray-400 text-sm">Loading...</div>
                        ) : analytics.topProducts.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 text-sm">No product sales yet</div>
                        ) : (
                            <div className="space-y-4">
                                {analytics.topProducts.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-orange-50 text-[#fb641b] flex items-center justify-center font-bold text-sm">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                                            <p className="text-xs text-gray-500">{p.count} units sold</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{Math.round(p.earnings * 82).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
