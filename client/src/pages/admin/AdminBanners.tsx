import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    position: 'hero' | 'sidebar' | 'footer';
    isActive: boolean;
    sortOrder: number;
}

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
    const headers = { Authorization: `Bearer ${token}` };

    const [form, setForm] = useState({
        title: '', imageUrl: '', link: '', position: 'hero', sortOrder: '0'
    });

    useEffect(() => {
        axios.get(`${API_BASE}/admin/banners`, { headers })
            .then(r => setBanners(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const createBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data } = await axios.post(`${API_BASE}/admin/banners`, {
            ...form,
            sortOrder: Number(form.sortOrder)
        }, { headers });
        setBanners([...banners, data].sort((a, b) => a.sortOrder - b.sortOrder));
        setForm({ title: '', imageUrl: '', link: '', position: 'hero', sortOrder: '0' });
    };

    const deleteBanner = async (id: string) => {
        await axios.delete(`${API_BASE}/admin/banners/${id}`, { headers });
        setBanners(b => b.filter(x => x.id !== id));
    };

    const toggleStatus = async (id: string, current: boolean) => {
        await axios.patch(`${API_BASE}/admin/banners/${id}`, { isActive: !current }, { headers });
        setBanners(b => b.map(x => x.id === id ? { ...x, isActive: !current } : x));
    };

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4">Add Banner</h2>
                        <form onSubmit={createBanner} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Summer Sale" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                                <input required value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Target Link</label>
                                <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder="/category/fashion" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Position</label>
                                    <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                                        className="w-full border border-gray-200 rounded px-2 py-2 text-sm">
                                        <option value="hero">Hero Slider</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="footer">Footer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Sort Order</label>
                                    <input required type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-[#2874f0] text-white py-2 rounded text-sm font-semibold flex justify-center items-center gap-1 hover:bg-blue-600 transition">
                                <Plus className="w-4 h-4" /> Add Banner
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4">Active Banners</h2>
                        {loading ? (
                            <div className="py-20 text-center text-gray-400 text-sm">Loading banners...</div>
                        ) : banners.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded">
                                <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No banners configured</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {banners.map(b => (
                                    <div key={b.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:border-blue-100 hover:bg-blue-50/50 transition">
                                        <img src={b.imageUrl} alt={b.title} className="w-24 h-12 object-cover rounded bg-gray-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 text-sm">{b.title}</p>
                                            <p className="text-xs text-gray-500 truncate">Link: {b.link || 'None'} · Pos: {b.position} · Order: {b.sortOrder}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => toggleStatus(b.id, b.isActive)}
                                                className={`px-2 py-1 rounded text-[11px] font-semibold ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {b.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                            <button onClick={() => deleteBanner(b.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
