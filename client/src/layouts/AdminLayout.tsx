import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
    LayoutDashboard,
    Users,
    Package,
    FolderTree,
    ShoppingBag,
    CreditCard,
    RotateCcw,
    Tag,
    Store,
    HeartHandshake,
    Megaphone,
    BarChart3,
    FileText,
    Bell,
    Settings,
    ScrollText,
    LogOut,
    Menu,
    Search,
    HelpCircle
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { label: 'Users', icon: Users, to: '/admin/users' },
    { label: 'Products', icon: Package, to: '/admin/products' },
    { label: 'Categories', icon: FolderTree, to: '/admin/categories' },
    { label: 'Orders', icon: ShoppingBag, to: '/admin/orders' },
    { label: 'Payments', icon: CreditCard, to: '/admin/payments' },
    { label: 'Returns', icon: RotateCcw, to: '/admin/returns' },
    { label: 'Inventory', icon: Tag, to: '/admin/inventory' },
    { label: 'Sellers', icon: Store, to: '/admin/sellers' },
    { label: 'Customers', icon: HeartHandshake, to: '/admin/customers' },
    { label: 'Marketing', icon: Megaphone, to: '/admin/marketing' },
    { label: 'Reports', icon: BarChart3, to: '/admin/reports' },
    { label: 'CMS', icon: FileText, to: '/admin/cms' },
    { label: 'Notifications', icon: Bell, to: '/admin/notifications' },
    { label: 'Settings', icon: Settings, to: '/admin/settings' },
    { label: 'Logs', icon: ScrollText, to: '/admin/logs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex font-sans antialiased text-gray-800">
            {/* Sidebar */}
            <aside className="w-[260px] bg-[#172337] text-white flex flex-col shrink-0 border-r border-[#24334a]">
                {/* Brand Header */}
                <div className="px-6 py-5 border-b border-[#24334a] flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {/* Custom Yellow Flipkart Bag Logo */}
                        <div className="relative w-9 h-9 bg-gradient-to-tr from-[#ffe500] to-[#ffd700] rounded-md flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <span className="font-black text-[#2874f0] text-xl italic tracking-tighter">f</span>
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2874f0] rounded-full border-2 border-yellow-400"></div>
                        </div>
                        <div>
                            <p className="font-black text-xl italic tracking-wide text-white leading-none">
                                Flipkart
                            </p>
                            <p className="text-[10px] text-[#ffe500] font-extrabold uppercase tracking-[0.15em] mt-1 leading-none">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                    {navItems.map(item => {
                        const active = location.pathname === item.to || (item.to === '/admin' && location.pathname === '/admin/');
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-md text-[13px] font-semibold tracking-wide transition-all duration-150 ${
                                    active
                                        ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/25'
                                        : 'text-gray-400 hover:text-white hover:bg-[#203047]'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-white' : 'text-gray-400'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer Controls */}
                <div className="p-4 border-t border-[#24334a] space-y-2">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-md text-gray-400 hover:text-white hover:bg-[#203047] text-[13px] font-semibold transition-all"
                    >
                        <LogOut className="w-4 h-4 shrink-0 rotate-180 text-gray-500" />
                        Back to Store
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-md text-red-400 hover:text-white hover:bg-red-950/20 text-[13px] font-bold transition-all"
                    >
                        <LogOut className="w-4 h-4 shrink-0 text-red-500" />
                        Logout Panel
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm px-6 flex items-center justify-between border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        
                        {/* Search Input */}
                        <div className="relative w-full max-w-md hidden md:block">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search for users, orders, products..."
                                className="w-full bg-[#f0f2f5] pl-9 pr-4 py-2 rounded-lg text-sm text-gray-800 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:bg-white outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Side Icons & Profile */}
                    <div className="flex items-center gap-5">
                        {/* Notification Bell */}
                        <button className="relative p-1 text-gray-500 hover:text-gray-800 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                12
                            </span>
                        </button>

                        {/* Help Circle */}
                        <button className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
                            <HelpCircle className="w-5 h-5" />
                        </button>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 shadow-inner">
                                AD
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="font-bold text-gray-800 text-sm leading-none">Admin</p>
                                <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-none">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sub-page content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
