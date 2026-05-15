import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import type { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, ChevronDown, ChevronUp, Search, MapPin, Plane } from 'lucide-react';
import DeliveryLocationModal from './DeliveryLocationModal';

const LOGGED_IN_MENU = [
    { icon: '👤', label: 'My Profile', path: '/profile' },
    { icon: '💎', label: 'Flipkart Plus Zone', path: '/plus' },
    { icon: '📦', label: 'Orders', path: '/orders' },
    { icon: '❤️', label: 'Wishlist', path: '/wishlist' },
    { icon: '🏪', label: 'Become a Seller', path: '/seller' },
    { icon: '🎁', label: 'Rewards', path: '/rewards' },
    { icon: '🎴', label: 'Gift Cards', path: '/gift-cards' },
    { icon: '🔔', label: 'Notification Preferences', path: '/notifications' },
    { icon: '🎧', label: '24x7 Customer Care', path: '/help' },
    { icon: '📢', label: 'Advertise', path: '/advertise' },
    { icon: '📱', label: 'Download App', path: '/app' },
];

const LOGGED_OUT_MENU = [
    { icon: '👤', label: 'My Profile', path: '/login' },
    { icon: '📦', label: 'Orders', path: '/login' },
    { icon: '❤️', label: 'Wishlist', path: '/wishlist' },
    { icon: '🏪', label: 'Become a Seller', path: '/seller' },
    { icon: '🎴', label: 'Gift Cards', path: '/gift-cards' },
    { icon: '🔔', label: 'Notification Preferences', path: '/notifications' },
    { icon: '🎧', label: '24x7 Customer Care', path: '/help' },
    { icon: '📢', label: 'Advertise', path: '/advertise' },
    { icon: '📱', label: 'Download App', path: '/app' },
];

const MORE_MENU = [
    { icon: '🔔', label: 'Notification Preferences', path: '/notifications' },
    { icon: '🎧', label: '24x7 Customer Care', path: '/help' },
    { icon: '📢', label: 'Advertise', path: '/advertise' },
    { icon: '📱', label: 'Download App', path: '/app' },
    { icon: '🎴', label: 'Gift Cards', path: '/gift-cards' },
];

export default function Navbar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.cart);
    const delivery = useSelector((state: RootState) => state.location.delivery);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [loginOpen, setLoginOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const loginRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) setLoginOpen(false);
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setLoginOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(searchQuery.trim() ? `/?search=${encodeURIComponent(searchQuery.trim())}` : '/');
    };

    const menuItems = user ? LOGGED_IN_MENU : LOGGED_OUT_MENU;

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-4 h-14">
                    <Link to="/" className="flex-shrink-0 flex flex-col items-start leading-none mr-1">
                        <div className="flex items-center bg-[#2874f0] rounded-sm px-2 py-0.5 gap-1">
                            <span className="text-yellow-400 font-black text-lg leading-none">F</span>
                            <span className="text-white font-bold text-sm leading-none">lipkart</span>
                        </div>
                        <span className="text-[10px] text-[#2874f0] font-semibold italic ml-0.5 mt-0.5">
                            Explore <span className="text-yellow-500 font-bold">Plus</span>{' '}
                            <span className="text-yellow-500">+</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        className="flex-shrink-0 hidden sm:flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors"
                    >
                        <Plane className="w-3.5 h-3.5" />
                        Travel
                    </button>

                    <form onSubmit={handleSearch} className="flex-1 mx-2">
                        <div className="flex items-center bg-[#f0f5ff] border border-[#d0dff8] rounded-sm overflow-hidden hover:border-[#2874f0] focus-within:border-[#2874f0] transition-colors">
                            <Search className="w-4 h-4 text-[#2874f0] ml-3 flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for Products, Brands and More"
                                className="flex-1 bg-transparent text-gray-800 text-sm py-2 px-3 focus:outline-none placeholder-gray-400"
                            />
                        </div>
                    </form>

                    <button
                        type="button"
                        onClick={() => setLocationOpen(true)}
                        className="hidden lg:flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 hover:text-[#2874f0] text-left"
                    >
                        <MapPin className="w-4 h-4 text-[#2874f0] flex-shrink-0" />
                        <div className="leading-tight max-w-[140px]">
                            {delivery ? (
                                <>
                                    <div className="text-xs text-gray-800 font-semibold leading-none truncate">
                                        {delivery.city} {delivery.pincode}
                                    </div>
                                    <div className="text-[#2874f0] font-semibold text-xs leading-none truncate">
                                        {delivery.line1 || delivery.state}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-xs text-gray-400 leading-none">Location not set</div>
                                    <div className="text-[#2874f0] font-semibold text-xs leading-none whitespace-nowrap">
                                        Select delivery location ›
                                    </div>
                                </>
                            )}
                        </div>
                    </button>

                    <div className="relative flex-shrink-0" ref={loginRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginOpen((p) => !p);
                                setMoreOpen(false);
                            }}
                            className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-[#2874f0] transition-colors px-1"
                        >
                            <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
                            {loginOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {loginOpen && (
                            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-sm shadow-2xl text-gray-700 z-50 border border-gray-100">
                                {!user ? (
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                        <span className="text-sm text-gray-500">New customer?</span>
                                        <Link
                                            to="/register"
                                            onClick={() => setLoginOpen(false)}
                                            className="text-[#2874f0] font-bold text-sm hover:underline"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                        <span className="text-sm font-semibold text-gray-800 truncate">{user.name}</span>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="text-red-500 text-xs font-bold hover:underline ml-2 whitespace-nowrap"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                                <div className="py-1">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            onClick={() => setLoginOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-base">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                                {!user && (
                                    <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                                        <Link
                                            to="/login"
                                            onClick={() => setLoginOpen(false)}
                                            className="block w-full text-center bg-[#2874f0] text-white font-semibold py-2 rounded-sm hover:bg-blue-700 transition text-sm"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-shrink-0 hidden md:block" ref={moreRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setMoreOpen((p) => !p);
                                setLoginOpen(false);
                            }}
                            className="flex items-center gap-0.5 font-semibold text-sm text-gray-800 hover:text-[#2874f0] transition-colors"
                        >
                            More
                            {moreOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {moreOpen && (
                            <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-sm shadow-2xl z-50 border border-gray-100 py-1">
                                {MORE_MENU.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setMoreOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700"
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/cart"
                        className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-[#2874f0] transition-colors relative"
                    >
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </div>
                        Cart
                    </Link>
                </div>
            </nav>

            <DeliveryLocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />
        </>
    );
}
