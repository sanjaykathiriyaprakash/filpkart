import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FolderTree, Plus, Trash2, Calendar, ShoppingBag } from 'lucide-react';

interface CategoryItem {
    id: string;
    name: string;
    description: string;
    productCount: number;
    createdAt: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<CategoryItem[]>([
        { id: '1', name: 'Mobiles', description: 'Smartphones and accessories', productCount: 120, createdAt: '2024-05-10' },
        { id: '2', name: 'Electronics', description: 'Laptops, tablets, headphones, and home appliances', productCount: 45, createdAt: '2024-05-12' },
        { id: '3', name: 'Fashion', description: 'Clothing, footwear, and apparel accessories', productCount: 32, createdAt: '2024-05-14' },
        { id: '4', name: 'Home & Kitchen', description: 'Furniture, cookware, and kitchen appliances', productCount: 18, createdAt: '2024-05-15' },
        { id: '5', name: 'Books', description: 'Fiction, non-fiction, academic books, and literature', productCount: 8, createdAt: '2024-05-16' },
        { id: '6', name: 'Automotive', description: 'Car accessories, dashcams, and motorcycle gear', productCount: 4, createdAt: '2024-05-18' },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        const newCat: CategoryItem = {
            id: String(Date.now()),
            name: newCatName,
            description: newCatDesc || 'No description provided',
            productCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
        };

        setCategories([newCat, ...categories]);
        setNewCatName('');
        setNewCatDesc('');
        setIsAddModalOpen(false);
        showToast(`Category "${newCat.name}" created successfully!`);
    };

    const handleDeleteCategory = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
            setCategories(categories.filter(c => c.id !== id));
            showToast(`Category "${name}" deleted.`);
        }
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-800 tracking-wide">Categories</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Manage e-commerce catalog categories</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-[#2874f0] text-white rounded-lg px-4 py-2.5 shadow-sm text-xs font-bold hover:bg-blue-600 transition-colors self-start sm:self-center"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <FolderTree className="w-6 h-6 text-[#2874f0]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Categories</p>
                            <p className="text-xl font-black text-gray-800 mt-1">{categories.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Products Categorized</p>
                            <p className="text-xl font-black text-gray-800 mt-1">
                                {categories.reduce((acc, curr) => acc + curr.productCount, 0)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Last Modified</p>
                            <p className="text-xl font-black text-gray-800 mt-1">Today</p>
                        </div>
                    </div>
                </div>

                {/* Category Table */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-[15px] tracking-wide">Category List</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 font-bold">Category Name</th>
                                    <th className="px-6 py-3.5 font-bold">Description</th>
                                    <th className="px-6 py-3.5 font-bold text-center">Product Count</th>
                                    <th className="px-6 py-3.5 font-bold">Date Created</th>
                                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                                {categories.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 text-sm flex items-center gap-2">
                                            <FolderTree className="w-4 h-4 text-gray-400" />
                                            {c.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{c.description}</td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-gray-800">{c.productCount}</td>
                                        <td className="px-6 py-4 font-mono text-gray-500">{c.createdAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteCategory(c.id, c.name)}
                                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Category Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-150 animate-fadeIn">
                            <div className="bg-[#2874f0] text-white px-6 py-4">
                                <h3 className="font-extrabold text-sm uppercase tracking-wider">Add New Category</h3>
                            </div>
                            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCatName}
                                        onChange={e => setNewCatName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#2874f0] font-semibold"
                                        placeholder="e.g. Health & Fitness"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={newCatDesc}
                                        onChange={e => setNewCatDesc(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm h-24 outline-none focus:border-[#2874f0] font-semibold resize-none"
                                        placeholder="Brief description of category items..."
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#2874f0] text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
