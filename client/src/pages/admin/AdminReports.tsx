import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminReports() {
    const [reports, setReports] = useState<{ totalRevenue: number, totalOrders: number, revenueByDate: any[] }>({ totalRevenue: 0, totalOrders: 0, revenueByDate: [] });
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/admin/reports/sales`, { headers })
            .then(r => setReports(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Find max value for chart scaling
    const maxRevenue = Math.max(...reports.revenueByDate.map(r => r.amount), 1);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-semibold">Total Revenue</h3>
                            <div className="bg-green-100 p-2 rounded-full text-green-600"><DollarSign className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">₹{Math.round(reports.totalRevenue * 82).toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-2 flex items-center font-medium"><TrendingUp className="w-3 h-3 mr-1" /> +12.5% from last month</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-semibold">Total Delivered Orders</h3>
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><ShoppingBag className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{reports.totalOrders}</p>
                        <p className="text-xs text-green-600 mt-2 flex items-center font-medium"><TrendingUp className="w-3 h-3 mr-1" /> +8.2% from last month</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-semibold">Average Order Value</h3>
                            <div className="bg-purple-100 p-2 rounded-full text-purple-600"><TrendingUp className="w-5 h-5" /></div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            ₹{reports.totalOrders ? Math.round((reports.totalRevenue * 82) / reports.totalOrders).toLocaleString() : 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="font-semibold text-gray-800 mb-6">Revenue Trend (Delivered Orders)</h2>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
                    ) : reports.revenueByDate.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">No sales data available</div>
                    ) : (
                        <div className="h-64 flex items-end gap-2 px-4 pb-8 pt-4 border-b border-l border-gray-200 relative">
                            {reports.revenueByDate.slice(-14).map(item => {
                                const heightPercentage = (item.amount / maxRevenue) * 100;
                                return (
                                    <div key={item.date} className="flex-1 flex flex-col items-center group relative">
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                            ₹{Math.round(item.amount * 82).toLocaleString()}<br/>
                                            <span className="text-gray-300">{item.date}</span>
                                        </div>
                                        <div 
                                            className="w-full bg-[#2874f0] hover:bg-blue-600 transition-colors rounded-t-sm" 
                                            style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                                        ></div>
                                        <span className="absolute -bottom-6 text-[10px] text-gray-500 -rotate-45 origin-top-left truncate w-16 text-right">
                                            {item.date.slice(5)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
