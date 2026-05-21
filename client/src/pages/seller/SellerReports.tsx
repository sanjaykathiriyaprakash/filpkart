import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { BarChart3, Download, FileText, CheckCircle, Clock, Plus, RefreshCw } from 'lucide-react';

interface Report {
    id: string;
    name: string;
    type: string;
    range: string;
    dateGenerated: string;
    status: 'Completed' | 'Processing';
    format: 'CSV';
    data: string; // CSV string content
}

export default function SellerReports() {
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState('30days');
    const [generating, setGenerating] = useState(false);
    const [reports, setReports] = useState<Report[]>([
        {
            id: 'REP-001',
            name: 'Monthly Sales Report - April 2026',
            type: 'Sales Report',
            range: '01 Apr 2026 - 30 Apr 2026',
            dateGenerated: '2026-05-01 10:15 AM',
            status: 'Completed',
            format: 'CSV',
            data: "Product Title,Units Sold,Earnings\nWireless Gaming Mouse,24,1968\nMechanical Keyboard,12,1800\nFHD Gaming Monitor,5,2250"
        },
        {
            id: 'REP-002',
            name: 'Inventory Value Report',
            type: 'Inventory Status',
            range: 'As of 15 May 2026',
            dateGenerated: '2026-05-15 03:42 PM',
            status: 'Completed',
            format: 'CSV',
            data: "Product Title,Stock Level,Unit Price,Total Stock Value\nWireless Gaming Mouse,45,82,3690\nMechanical Keyboard,18,150,2700\nFHD Gaming Monitor,8,450,3600"
        }
    ]);

    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, orderRes] = await Promise.all([
                    axios.get(`${API_BASE}/seller/products`, { headers }),
                    axios.get(`${API_BASE}/seller/orders`, { headers })
                ]);
                setProducts(prodRes.data || []);
                setOrders(orderRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const generateReport = () => {
        setGenerating(true);
        setTimeout(() => {
            const id = `REP-00${reports.length + 1}`;
            const dateStr = new Date().toLocaleString();
            let newReport: Report;

            if (reportType === 'sales') {
                // Calculate sales report based on orders
                let csvContent = "Product Title,Units Sold,Earnings\n";
                const salesMap: Record<string, { qty: number, earnings: number }> = {};
                
                orders.forEach(order => {
                    if (order.products && Array.isArray(order.products)) {
                        order.products.forEach((p: any) => {
                            const title = p.title || 'Unknown Product';
                            const price = Number(p.price) || 0;
                            const qty = p.quantity || 1;
                            
                            if (!salesMap[title]) {
                                salesMap[title] = { qty: 0, earnings: 0 };
                            }
                            salesMap[title].qty += qty;
                            salesMap[title].earnings += price * qty;
                        });
                    }
                });

                Object.keys(salesMap).forEach(title => {
                    const data = salesMap[title];
                    csvContent += `"${title.replace(/"/g, '""')}",${data.qty},₹${Math.round(data.earnings * 82)}\n`;
                });

                if (Object.keys(salesMap).length === 0) {
                    csvContent += "No Data Available,0,₹0\n";
                }

                newReport = {
                    id,
                    name: `Sales Report (${dateRange}) - Generated`,
                    type: 'Sales Report',
                    range: dateRange === '7days' ? 'Last 7 Days' : dateRange === '30days' ? 'Last 30 Days' : 'Custom Range',
                    dateGenerated: dateStr,
                    status: 'Completed',
                    format: 'CSV',
                    data: csvContent
                };
            } else if (reportType === 'inventory') {
                let csvContent = "Product Title,Stock Level,Unit Price,Total Stock Value\n";
                products.forEach(p => {
                    const val = Number(p.price) * p.stock;
                    csvContent += `"${p.title.replace(/"/g, '""')}",${p.stock},₹${Math.round(Number(p.price) * 82)},₹${Math.round(val * 82)}\n`;
                });

                if (products.length === 0) {
                    csvContent += "No Products Available,0,₹0,₹0\n";
                }

                newReport = {
                    id,
                    name: 'Inventory Level Summary',
                    type: 'Inventory Status',
                    range: 'Current Stock',
                    dateGenerated: dateStr,
                    status: 'Completed',
                    format: 'CSV',
                    data: csvContent
                };
            } else if (reportType === 'performance') {
                const totalOrdersCount = orders.length;
                const completedCount = orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;
                const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
                const pendingCount = totalOrdersCount - completedCount - cancelledCount;

                let csvContent = "Metric,Value\n";
                csvContent += `Total Orders,${totalOrdersCount}\n`;
                csvContent += `Completed Orders,${completedCount}\n`;
                csvContent += `Pending Orders,${pendingCount}\n`;
                csvContent += `Cancelled Orders,${cancelledCount}\n`;

                newReport = {
                    id,
                    name: 'Seller Order Performance Report',
                    type: 'Order Performance',
                    range: 'Lifetime',
                    dateGenerated: dateStr,
                    status: 'Completed',
                    format: 'CSV',
                    data: csvContent
                };
            } else {
                let csvContent = "Tax Label,Taxable Value,Tax Rate,Tax Calculated\n";
                let totalTaxVal = 0;
                orders.forEach(order => {
                    if (order.products && Array.isArray(order.products)) {
                        order.products.forEach((p: any) => {
                            const price = Number(p.price) || 0;
                            const qty = p.quantity || 1;
                            totalTaxVal += (price * qty);
                        });
                    }
                });

                const cgst = totalTaxVal * 0.09;
                const sgst = totalTaxVal * 0.09;

                csvContent += `CGST 9%,₹${Math.round(totalTaxVal * 82)},9%,₹${Math.round(cgst * 82)}\n`;
                csvContent += `SGST 9%,₹${Math.round(totalTaxVal * 82)},9%,₹${Math.round(sgst * 82)}\n`;
                csvContent += `Total GST,₹${Math.round(totalTaxVal * 82)},18%,₹${Math.round((cgst + sgst) * 82)}\n`;

                newReport = {
                    id,
                    name: `GST Tax Statement`,
                    type: 'Tax Summary',
                    range: 'Current Quarter',
                    dateGenerated: dateStr,
                    status: 'Completed',
                    format: 'CSV',
                    data: csvContent
                };
            }

            setReports(prev => [newReport, ...prev]);
            setGenerating(false);
        }, 1200);
    };

    const downloadCsv = (report: Report) => {
        const blob = new Blob([report.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${report.name.replace(/\s+/g, '_')}_${report.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#2874f0]" /> Reports & Statements
                        </h2>
                        <p className="text-xs font-medium text-gray-400 mt-1">Generate, track, and download CSV statements for your store’s finances, inventory, and order activity.</p>
                    </div>
                </div>

                {/* Report Generation Panel */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-500 mb-2 tracking-wider">Report Type</label>
                        <select 
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 px-3 py-2.5 outline-none focus:border-[#2874f0] transition-colors"
                        >
                            <option value="sales">Sales & Revenue Report</option>
                            <option value="inventory">Inventory Status Report</option>
                            <option value="performance">Order Performance Metrics</option>
                            <option value="tax">Tax Statement (GST Summary)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase text-gray-500 mb-2 tracking-wider">Date Range</label>
                        <select 
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 px-3 py-2.5 outline-none focus:border-[#2874f0] transition-colors"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                            <option value="quarter">Current Quarter</option>
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={generateReport}
                            disabled={generating}
                            className="w-full bg-[#fb641b] text-white hover:bg-[#e45a16] disabled:bg-orange-300 font-bold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 cursor-pointer transition-colors"
                        >
                            {generating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" /> Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Generated Reports Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-sm tracking-wide">Generated Reports</h3>
                    </div>
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 text-sm">Loading reports history...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-extrabold tracking-wider border-b border-gray-150">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left">Report ID</th>
                                        <th className="px-6 py-3.5 text-left">Name</th>
                                        <th className="px-6 py-3.5 text-left">Type</th>
                                        <th className="px-6 py-3.5 text-left">Date Range</th>
                                        <th className="px-6 py-3.5 text-left">Date Generated</th>
                                        <th className="px-6 py-3.5 text-left">Status</th>
                                        <th className="px-6 py-3.5 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#2874f0] text-xs">{report.id}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span>{report.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-gray-500">{report.type}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-400">{report.range}</td>
                                            <td className="px-6 py-4 text-xs text-gray-400 font-semibold">{report.dateGenerated}</td>
                                            <td className="px-6 py-4">
                                                {report.status === 'Completed' ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-150">
                                                        <CheckCircle className="w-3 h-3" /> Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-150">
                                                        <Clock className="w-3 h-3 animate-pulse" /> Processing
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => downloadCsv(report)}
                                                    className="p-1.5 bg-blue-50 text-[#2874f0] rounded-md hover:bg-blue-100 hover:text-blue-700 transition cursor-pointer"
                                                    title="Download CSV"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
