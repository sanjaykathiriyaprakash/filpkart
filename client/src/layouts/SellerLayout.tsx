import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store/store';
import {
    Home,
    Layers,
    Warehouse,
    ShoppingBag,
    CreditCard,
    TrendingUp,
    BarChart3,
    Megaphone,
    Handshake,
    HelpCircle,
    Settings,
    LogOut,
    Search,
    Download,
    Bell,
    ChevronDown,
    GraduationCap
} from 'lucide-react';

const navItems = [
    { label: 'Home', icon: Home, to: '/seller' },
    { label: 'Listings', icon: Layers, to: '/seller/products', hasSub: true },
    { label: 'Inventory', icon: Warehouse, to: '/seller/inventory', hasSub: true },
    { label: 'Orders', icon: ShoppingBag, to: '/seller/orders', hasSub: true },
    { label: 'Payments', icon: CreditCard, to: '/seller/earnings', hasSub: true },
    { label: 'Growth', icon: TrendingUp, to: '/seller/growth', isNew: true },
    { label: 'Reports', icon: BarChart3, to: '/seller/reports', hasSub: true },
    { label: 'Advertising', icon: Megaphone, to: '/seller/advertising', hasSub: true },
    { label: 'Partner Services', icon: Handshake, to: '/seller/partners', hasSub: true },
    { label: 'Buyer Questions', icon: HelpCircle, to: '/seller/questions' },
    { label: 'Help Center', icon: HelpCircle, to: '/seller/help' },
    { label: 'Account Settings', icon: Settings, to: '/seller/profile' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        navigate('/seller/hub', { replace: true });
        setTimeout(() => {
            dispatch(logout());
        }, 100);
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans antialiased text-gray-800">
            {/* Top Royal Blue Header */}
            <header className="bg-[#2874f0] h-16 px-6 flex items-center justify-between text-white shadow-md shrink-0 z-10">
                {/* Logo Section */}
                <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 bg-gradient-to-tr from-[#ffe500] to-[#ffd700] rounded-md flex items-center justify-center shadow-md">
                        <span className="font-black text-[#2874f0] text-lg italic tracking-tighter">f</span>
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2874f0] rounded-full border border-yellow-400"></div>
                    </div>
                    <div>
                        <span className="font-black text-lg italic leading-none tracking-wide">Flipkart</span>
                        <span className="text-[11px] font-bold text-white/90 block -mt-1 tracking-wide">Seller Hub</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-lg mx-6 hidden md:block">
                    <input
                        type="text"
                        placeholder="Search for products, orders and more"
                        className="w-full bg-white text-gray-800 pl-4 pr-10 py-2 rounded-md text-sm placeholder-gray-400 border border-transparent outline-none shadow-inner"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <Search className="w-4 h-4 cursor-pointer hover:text-[#2874f0] transition-colors" />
                    </span>
                </div>

                {/* Header Action Items */}
                <div className="flex items-center gap-5">
                    {/* Download */}
                    <button className="p-1 hover:text-white/80 transition-colors" title="Downloads">
                        <Download className="w-5 h-5" />
                    </button>

                    {/* Help Selector */}
                    <button className="flex items-center gap-1 text-sm font-semibold hover:text-white/80 transition-colors">
                        <span>Help</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-1 hover:text-white/80 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#2874f0]">
                            15
                        </span>
                    </button>

                    <div className="h-5 w-px bg-white/20"></div>

                    {/* Seller Dropdown */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-extrabold text-sm shadow-md">
                            {(user?.name || 'S').substring(0, 1).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold truncate max-w-[120px] hidden sm:inline">{user?.name || 'Seller Store'}</span>
                    </div>
                </div>
            </header>

            {/* Sidebar + Main Content Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    <nav className="flex-1 py-4 px-3 space-y-0.5">
                        {navItems.map(item => {
                            const active = location.pathname === item.to || (item.to === '/seller' && location.pathname === '/seller/');
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                                        active
                                            ? 'bg-blue-50/70 text-[#2874f0]'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#2874f0]' : 'text-gray-400'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {item.isNew && (
                                            <span className="bg-blue-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">New</span>
                                        )}
                                        {item.hasSub && (
                                            <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Free Learning Card & Logout */}
                    <div className="p-3 border-t border-gray-150 space-y-1 bg-slate-50/50">
                        <Link
                            to="/seller/learning"
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold text-green-600 hover:bg-green-50 transition-colors"
                        >
                            <div className="flex items-center gap-3.5">
                                <GraduationCap className="w-4 h-4 shrink-0 text-green-500" />
                                <span>FREE Learning</span>
                            </div>
                            <span className="bg-blue-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">New</span>
                        </Link>

                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-gray-500 hover:text-gray-800 text-[13px] font-semibold hover:bg-gray-100 transition-all cursor-pointer"
                        >
                            <Home className="w-4 h-4 text-gray-400" />
                            Back to Store
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-red-500 hover:text-red-700 text-[13px] font-bold hover:bg-red-50 transition-all cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 text-red-400" />
                            Logout Account
                        </button>
                    </div>
                </aside>

                {/* Main page content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
