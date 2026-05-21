import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Megaphone, Plus, Power, Trash2, X, AlertCircle } from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
    productTitle: string;
    status: 'Active' | 'Paused';
    dailyBudget: number;
    totalSpend: number;
    clicks: number;
    conversions: number;
}

export default function SellerAdvertising() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        {
            id: 'CAM-101',
            name: 'Summer Electronics Blitz',
            productTitle: 'Wireless Gaming Mouse',
            status: 'Active',
            dailyBudget: 500,
            totalSpend: 4200,
            clicks: 1420,
            conversions: 89
        },
        {
            id: 'CAM-102',
            name: 'Smart Gadget Boost',
            productTitle: 'Mechanical Keyboard',
            status: 'Paused',
            dailyBudget: 250,
            totalSpend: 1850,
            clicks: 520,
            conversions: 31
        }
    ]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [productId, setProductId] = useState('');
    const [dailyBudget, setDailyBudget] = useState(300);

    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get(`${API_BASE}/seller/products`, { headers })
            .then(r => {
                setProducts(r.data || []);
                if (r.data?.length > 0) {
                    setProductId(r.data[0].id);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const toggleCampaignStatus = (id: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    status: c.status === 'Active' ? 'Paused' : 'Active'
                };
            }
            return c;
        }));
    };

    const deleteCampaign = (id: string) => {
        if (!confirm('Are you sure you want to stop and delete this campaign?')) return;
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const handleCreateCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const selectedProd = products.find(p => p.id === productId);
        const productTitle = selectedProd ? selectedProd.title : 'Selected Product';

        const newCampaign: Campaign = {
            id: `CAM-${101 + campaigns.length}`,
            name,
            productTitle,
            status: 'Active',
            dailyBudget,
            totalSpend: 0,
            clicks: 0,
            conversions: 0
        };

        setCampaigns(prev => [newCampaign, ...prev]);
        setShowModal(false);
        setName('');
        setDailyBudget(300);
    };

    // Aggregate statistics
    const totalSpend = campaigns.reduce((acc, c) => acc + c.totalSpend, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
    const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
    const averageROAS = totalConversions > 0 ? '4.8x' : '0.0x';

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-[#2874f0]" /> Advertising Campaigns
                        </h2>
                        <p className="text-xs font-medium text-gray-400 mt-1">Run CPC campaigns to highlight your items inside search results and gain maximum buyer conversions.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#fb641b] text-white hover:bg-[#e45a16] font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create Campaign
                    </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 block tracking-wider">Total Ad Spend</span>
                        <p className="text-2xl font-black text-gray-800 mt-1">₹{(totalSpend * 82).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 block tracking-wider">Total Clicks</span>
                        <p className="text-2xl font-black text-gray-800 mt-1">{totalClicks.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 block tracking-wider">Ad Conversions</span>
                        <p className="text-2xl font-black text-gray-800 mt-1">{totalConversions.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 block tracking-wider">Avg Return on Spend</span>
                        <p className="text-2xl font-black text-green-600 mt-1">{averageROAS}</p>
                    </div>
                </div>

                {/* Campaigns List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm tracking-wide">My Campaigns</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-extrabold tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3.5 text-left">Campaign Name</th>
                                    <th className="px-6 py-3.5 text-left">Product</th>
                                    <th className="px-6 py-3.5 text-left">Status</th>
                                    <th className="px-6 py-3.5 text-left">Daily Budget</th>
                                    <th className="px-6 py-3.5 text-left">Total Spend</th>
                                    <th className="px-6 py-3.5 text-left">Clicks</th>
                                    <th className="px-6 py-3.5 text-left">Conversions</th>
                                    <th className="px-6 py-3.5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaigns.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">{c.name}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-gray-500 max-w-[180px] truncate">{c.productTitle}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                                c.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border-green-150'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-150'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">₹{(c.dailyBudget * 82).toLocaleString('en-IN')}/day</td>
                                        <td className="px-6 py-4 text-gray-600">₹{(c.totalSpend * 82).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-gray-600">{c.clicks}</td>
                                        <td className="px-6 py-4 text-gray-600 font-bold text-[#2874f0]">{c.conversions}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => toggleCampaignStatus(c.id)}
                                                    className={`p-1.5 rounded-md border transition cursor-pointer ${
                                                        c.status === 'Active'
                                                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100'
                                                            : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                    }`}
                                                    title={c.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
                                                >
                                                    <Power className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCampaign(c.id)}
                                                    className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-md hover:bg-red-100 transition cursor-pointer"
                                                    title="Delete Campaign"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Campaign Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-150">
                            <div className="bg-[#2874f0] px-5 py-4 text-white flex items-center justify-between">
                                <h3 className="font-bold text-sm tracking-wide">Create Advertising Campaign</h3>
                                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateCampaign} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Campaign Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Festival Season Kickoff"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 px-3 py-2 outline-none focus:border-[#2874f0] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Select Product to Advertise</label>
                                    {loading ? (
                                        <div className="text-xs text-gray-400">Loading products...</div>
                                    ) : products.length === 0 ? (
                                        <div className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Please add a product to your listings first!</div>
                                    ) : (
                                        <select
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 px-3 py-2 outline-none focus:border-[#2874f0] transition-colors"
                                        >
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.title}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Daily Budget (INR)</label>
                                    <input
                                        type="number"
                                        min="100"
                                        max="10000"
                                        required
                                        value={dailyBudget}
                                        onChange={(e) => setDailyBudget(Number(e.target.value))}
                                        className="w-full bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 px-3 py-2 outline-none focus:border-[#2874f0] transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={products.length === 0}
                                    className="w-full bg-[#fb641b] text-white hover:bg-[#e45a16] disabled:bg-gray-300 disabled:cursor-not-allowed font-bold text-sm py-2 px-4 rounded-lg cursor-pointer transition-colors mt-2"
                                >
                                    Activate Campaign
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
