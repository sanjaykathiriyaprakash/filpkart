import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, Star, ChevronRight, ChevronLeft, Search, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import ProductFilters, { type ProductFilterState } from '../components/ProductFilters';
import { CategoryNavIcon } from '../components/CategoryNavIcons';
import AutoCategoryLanding from '../components/AutoCategoryLanding';
import { buildProductsQuery } from '../lib/api';
import { API_BASE } from '../lib/api';
import type { RootState } from '../store/store';
import DeliveryLocationModal from '../components/DeliveryLocationModal';
import BrandDirectory from '../components/BrandDirectory';

const NAV_CATEGORIES = [
    { title: 'For You', search: '', path: '/' },
    { title: 'Fashion', search: 'mens-shirts', path: '/aw-base-new-inline-2025-at-store' },
    { title: 'Mobiles', search: 'smartphones', path: '/mobile-phones-sasa-lele-2026-ab-inline-at-store' },
    { title: 'Beauty', search: 'beauty', path: '/bpc-bau-new-inline-at-store' },
    { title: 'Electronics', search: 'laptops', path: '/new-elec-clp-march-at-store' },
    { title: 'Home', search: 'home-decoration', path: '/home-kitchen-25-at-store' },
    { title: 'Appliances', search: 'appliances', path: '/tv-and-appliances-inline-ab-at-store' },
    { title: 'Toys, ba...', search: 'mobile-accessories', path: '/toys-baby-2025-new-at-store' },
    { title: 'Food & H...', search: 'groceries', path: '/fnhc-2025-new-at-store' },
    { title: 'Auto Acc...', search: 'automotive', path: '/aa-2025-new-at-store' },
    { title: '2 Wheele...', search: 'motorcycle', path: '/twowheelers-at-store' },
    { title: 'Sports & ...', search: 'sports-accessories', path: '/sf-inline-2025-at-store' },
    { title: 'Books & ...', search: 'books', path: '/booksmedia-2025-at-store' },
    { title: 'Furniture', search: 'furniture', path: '/india-ka-furniture-studio-inlines-at-store' },
];

// Sections shown on "For You" as horizontal rows
const HOME_SECTIONS = [
    { title: 'Appliance for Cool Summer', search: 'appliances', color: '#ff6161' },
    { title: 'Top Smartphones', search: 'smartphones', color: '#2874f0' },
    { title: 'Fashion Picks', search: 'mens-shirts', color: '#ff7f3f' },
    { title: 'Beauty & Skincare', search: 'beauty', color: '#e91e8c' },
    { title: 'Fresh Groceries', search: 'groceries', color: '#26a541' },
    { title: 'Home Décor', search: 'home-decoration', color: '#6c47ff' },
    { title: 'Furniture Sale', search: 'furniture', color: '#ff9f00' },
];

// ─── Ad Banner Data ────────────────────────────────────────────────────────
const AD_BANNERS = [
    {
        brand: 'SAMSUNG',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        title: 'Galaxy S25 FE',
        subtitle: 'Just ₹43,999',
        desc: 'Shoot every night in clear details',
        badge: '50 MP CAMERA',
        sbi: true,
        accent: '#f5c518',
    },
    {
        brand: 'motorola',
        bg: 'linear-gradient(135deg, #1c1c3a 0%, #0d1b4b 100%)',
        title: 'Bring the cinema home',
        subtitle: 'From ₹11,499*',
        desc: 'Google TV 5.0 | Dolby Vision & Atmos',
        badge: 'SASA LELE',
        sbi: true,
        accent: '#00aaff',
    },
    {
        brand: 'SASA LELE',
        bg: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
        title: 'Beat The Price Hike',
        subtitle: 'Shop Now →',
        desc: 'POCO · Motorola · vivo — Only With SASA LELE',
        badge: 'SALE',
        sbi: true,
        accent: '#ffcc00',
    },
];

const WIDE_BANNER = {
    bg: 'linear-gradient(90deg, #f5f0e8 0%, #ede8dd 100%)',
    headline: '14″ 2.8K OLED display',
    subline: 'From ₹54,990*',
    note: '*T&C apply. Including all offers.',
    brand: 'motorola',
    accent: '#000',
};

const SEO_SECTIONS = [
    {
        heading: "Flipkart: India's Ultimate One-Stop Online Shopping Destination",
        body: "Welcome to Flipkart, India's trusted and beloved e-commerce platform, revolutionising online shopping since 2007. With over 200 million users, 150 million+ products across 80+ categories, and a relentless focus on customer satisfaction, Flipkart isn't just an online store; it's your digital shopping companion. Be it the Flipkart app or the comprehensive Flipkart website, discover an unmatched universe of products, incredible Flipkart offers, blockbuster Flipkart sale events, and seamless service. From the latest gadgets to daily groceries, fashion must-haves to furniture solutions, Flipkart is your definitive destination for e-commerce in India, offering convenience, value, and reliability at every click. Experience the joy of buying online with India's homegrown leader!"
    },
    {
        heading: "What Can You Buy From Flipkart?",
        body: "Flipkart's strength lies in its incredible diversity. With offerings for every need, aspiration, and budget, you can dive into the meticulously curated categories for your needs: Mobile and Electronics · Fashion · Home and Kitchen Appliances · Beauty and Grooming · Groceries and Daily Essentials · Sports & Outdoors · Furniture · Toys & Baby Products · Books & Stationery — and much more."
    },
    {
        heading: "Flipkart Flights",
        body: "Planning your next trip? Look no further than Flipkart Flights. Book domestic and international flights at the best prices with exclusive offers and zero convenience fee on cancellations. Enjoy a seamless booking experience and travel the world with Flipkart."
    },
    {
        heading: "Flipkart Minutes",
        body: "Need it now? Get it now with Flipkart Minutes. Experience hyper-local, ultra-fast delivery of groceries, fresh produce, and daily essentials delivered right to your doorstep in minutes. Quality and convenience, guaranteed."
    },
    {
        heading: "Flipkart Reset",
        body: "Give your old devices a new life and get the best value with Flipkart Reset. Buy expertly refurbished smartphones, laptops, and electronics that undergo rigorous quality checks. Enjoy premium tech at a fraction of the cost, completely certified and warrantied."
    },
    {
        heading: "Flipkart Kilos",
        body: "Stock up and save big with Flipkart Kilos. Buy your daily staples, groceries, and household essentials in bulk and enjoy wholesale prices. Perfect for large families or anyone looking to maximize savings on their monthly shopping."
    },
    {
        heading: "Why Choose Flipkart?",
        body: "Beyond the massive selection, we offer a range of benefits to enhance your shopping experience: No Cost EMI, Debit Card EMI, UPI, Pay Later, Flipkart Plus, and Priority Delivery. Our dedicated customer support is always here to help you."
    },
    {
        heading: "Get Exclusive Offers",
        body: "Download the Flipkart app today to unlock mobile-exclusive deals, personalized recommendations, and early access to our legendary Big Billion Days and Big Saving Days sales."
    }
];


export default function Home() {
    const { pathname } = useLocation();
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [sectionData, setSectionData] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<ProductFilterState>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loginOpen, setLoginOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const loginRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);
    const loginTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.cart);
    const delivery = useSelector((state: RootState) => state.location.delivery);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');

    // Derivate activeCategory from path matching
    const matchedCategory = NAV_CATEGORIES.find(c => c.path === pathname) || NAV_CATEGORIES[0];
    const activeCategory = matchedCategory.title;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
                if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
                setLoginOpen(false);
            }
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
        };
    }, []);

    const isForYou = activeCategory === 'For You' && !search;
    const isAutoCategory =
        activeCategory === 'Auto Acc...' || search === 'automotive' || searchParams.get('search') === 'automotive';

    const resolveSearchTerm = () => {
        const cat = NAV_CATEGORIES.find((c) => c.title === activeCategory);
        return search || cat?.search || '';
    };

    useEffect(() => {
        if (isForYou) return;
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const q = resolveSearchTerm();
                const url = buildProductsQuery({
                    search: q || undefined,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    minRating: filters.minRating,
                    brand: filters.brand,
                    sortBy: filters.sortBy,
                    color: filters.color,
                    size: filters.size,
                });
                const { data } = await axios.get(url);
                setSearchResults(data);
            } catch {
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [search, activeCategory, isForYou, filters]);

    useEffect(() => {
        if (!isForYou) return;
        const fetchAll = async () => {
            const result: Record<string, any[]> = {};
            await Promise.all(HOME_SECTIONS.map(async sec => {
                try {
                    const { data } = await axios.get(`${API_BASE}/products?search=${encodeURIComponent(sec.search)}`);
                    result[sec.search] = data.slice(0, 8);
                } catch { result[sec.search] = []; }
            }));
            setSectionData(result);
        };
        fetchAll();
    }, [isForYou]);

    const handleCategoryClick = (cat: typeof NAV_CATEGORIES[0]) => {
        navigate(cat.path);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(searchQuery.trim() ? `/?search=${encodeURIComponent(searchQuery.trim())}` : '/');
    };

    const closeLoginMenu = () => {
        if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
        setLoginOpen(false);
    };

    const toggleLoginMenu = () => {
        if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
        setLoginOpen(p => !p);
        setMoreOpen(false);
    };

    const onLoginEnter = () => {
        if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
        setLoginOpen(true);
        setMoreOpen(false);
    };

    const onLoginLeave = () => {
        loginTimeoutRef.current = setTimeout(() => {
            setLoginOpen(false);
        }, 3000); // stay open for 3 seconds so user has time to hover and click items
    };

    const handleLogout = () => {
        dispatch(logout());
        closeLoginMenu();
    };

    const getCat = (p: any) => (p.category as any)?.name || p.category || '';
    const getBrand = (p: any) => (p.brand as any)?.name || p.brand || '';

    const MORE_MENU = [
        { icon: '�', label: 'Notification Preferences', path: '/notifications' },
        { icon: '🎧', label: '24x7 Customer Care', path: '/help' },
        { icon: '📢', label: 'Advertise', path: '/advertise' },
        { icon: '📱', label: 'Download App', path: '/app' },
    ];

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">

            {/* ── Home Page Header (White, matches Flipkart home) ── */}
            <header className="bg-white sticky top-0 z-50 shadow-sm">

                {/* Row 1: [🟡 Flipkart] [✈️ Travel]  ·····  📍 Location not set  Select delivery location › */}
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-12 border-b border-gray-100">
                    {/* Left: Logo + Travel */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-1.5 bg-[#ffea00] rounded-full px-4 py-2 hover:bg-yellow-300 transition shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5 3h-2.5C9.24 3 7.5 4.74 7.5 7v3H5v3.5h2.5v7h4v-7h3l.5-3.5H11.5V7.5c0-.28.22-.5.5-.5h2.5V3z" fill="#0047b3"/>
                                <path d="M6.5 10H2M5.5 13.5H1" stroke="#0047b3" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-gray-900 font-extrabold italic text-[15px] leading-none">Flipkart</span>
                        </Link>
                        <button className="flex items-center gap-1.5 bg-[#f0f0f0] rounded-full px-5 py-2 hover:bg-gray-200 transition">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff5722" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                            </svg>
                            <span className="text-gray-900 font-bold italic text-[15px] leading-none">Travel</span>
                        </button>
                    </div>
                    {/* Right: Location */}
                    <button onClick={() => setLocationOpen(true)}
                        className="flex items-center gap-1 text-sm hover:opacity-80 transition">
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        {delivery ? (
                            <>
                                <span className="text-gray-800 font-semibold">{delivery.city}, {delivery.pincode}</span>
                                <span className="text-[#2874f0] font-semibold ml-1.5">Change ›</span>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-800 font-semibold">Location not set</span>
                                <span className="text-[#2874f0] font-semibold ml-1.5">Select delivery location ›</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Row 2: [Search bar full width]  ·····  [👤 Login ▾] [More ▾] [🛒 Cart] */}
                <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-6 h-14">
                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="flex items-center bg-white border border-gray-300 rounded-sm overflow-hidden hover:border-[#2874f0] focus-within:border-[#2874f0] transition-colors">
                            <Search className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search for Products, Brands and More"
                                className="flex-1 bg-transparent text-gray-800 text-sm py-2.5 px-3 focus:outline-none placeholder-gray-400"
                            />
                        </div>
                    </form>

                    {/* Login dropdown — Flipkart style with SVG icons */}
                    <div className="relative flex-shrink-0 group" ref={loginRef} onMouseEnter={onLoginEnter} onMouseLeave={onLoginLeave}>
                        <button onClick={toggleLoginMenu}
                            className="flex items-center gap-1.5 text-gray-800 font-semibold text-[15px] hover:text-[#2874f0] transition group px-2 py-2">
                            {/* Circle person icon */}
                            <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-[#2874f0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </span>
                            {user ? user.name.split(' ')[0] : 'Login'}
                            {loginOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {loginOpen && (
                            <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-md shadow-2xl z-50 border border-gray-100">
                                {/* Triangle pointer (Blue) */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2874f0] transform rotate-45 rounded-sm"></div>
                                
                                {/* Header */}
                                {!user ? (
                                    <div className="relative z-10 border-b border-gray-100">
                                        <Link to="/login" onClick={closeLoginMenu}
                                            className="block w-full text-center bg-[#2874f0] text-white font-medium py-3 rounded-t-md hover:bg-[#2874f0]/90 transition-colors">Login</Link>
                                        <div className="flex items-center justify-between px-5 py-3 bg-white">
                                            <span className="text-sm text-gray-500 font-medium">New customer?</span>
                                            <Link to="/register" onClick={closeLoginMenu}
                                                className="text-[#2874f0] font-bold text-sm hover:underline">Sign Up</Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 relative z-10 bg-white rounded-t-md">
                                        <span className="text-sm font-semibold truncate text-gray-800">{user.name}</span>
                                        <button onClick={handleLogout} className="text-red-500 text-xs font-bold hover:underline ml-2">Logout</button>
                                    </div>
                                )}
                                {/* Menu items with blue SVG icons — same as Flipkart */}
                                <div className="py-2">
                                    {[
                                        { path: user ? '/profile' : '/login', label: 'My Profile',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg> },
                                        { path: '/plus', label: 'Flipkart Plus Zone',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                                        { path: user ? '/orders' : '/login', label: 'Orders',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg> },
                                        { path: '/wishlist', label: 'Wishlist',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> },
                                        { path: '/seller/login', label: 'Become a Seller',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> },
                                        { path: '/rewards', label: 'Rewards',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg> },
                                        { path: '/gift-cards', label: 'Gift Cards',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M20 6h-2.18c.07-.23.18-.46.18-.71C18 3.47 16.53 2 14.71 2c-.87 0-1.66.36-2.24.93L12 3.4l-.47-.47C10.95 2.36 10.16 2 9.29 2 7.47 2 6 3.47 6 5.29c0 .25.11.48.18.71H4c-1.11 0-2 .89-2 2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5.29-2c.39 0 .71.32.71.71S15.1 5.42 14.71 5.42h-2.54c.38-.98 1.31-1.42 2.54-1.42zM9.29 4c1.23 0 2.16.44 2.54 1.42H9.29c-.39 0-.71-.32-.71-.71S8.9 4 9.29 4zM20 19H4v-2h16v2zm0-5H4V8h16v6z"/></svg> },
                                        { path: '/notifications', label: 'Notification Preferences',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg> },
                                        { path: '/help', label: '24x7 Customer Care',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm-1 16v-6h2v6h-2zm0-8V7h2v2h-2z"/></svg> },
                                        { path: '/advertise', label: 'Advertise',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> },
                                        { path: '/app', label: 'Download App',
                                          icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg> },
                                    ].map(item => (
                                        <Link key={item.label} to={item.path} onClick={closeLoginMenu}
                                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* More */}
                    <div className="relative flex-shrink-0 hidden md:block" ref={moreRef}>
                        <button onClick={() => { setMoreOpen(p => !p); closeLoginMenu(); }}
                            className="flex items-center gap-0.5 text-gray-800 font-semibold text-sm hover:text-[#2874f0] transition">
                            More {moreOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {moreOpen && (
                            <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-sm shadow-2xl z-50 border border-gray-100 py-1">
                                {MORE_MENU.map(item => (
                                    <Link key={item.label} to={item.path} onClick={() => setMoreOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700">
                                        <span>{item.icon}</span><span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className="flex-shrink-0 flex items-center gap-1.5 text-gray-800 font-semibold text-sm hover:text-[#2874f0] transition relative">
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
            </header>

            <main className="flex-1 flex flex-col">
            {/* ── Category Icons Strip ── */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-screen-xl mx-auto">
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar px-4 py-3">
                        {NAV_CATEGORIES.map(cat => (
                            <button key={cat.title} onClick={() => handleCategoryClick(cat)}
                                className={`flex flex-col items-center min-w-[70px] flex-shrink-0 transition-all ${
                                    (activeCategory === cat.title && !search) || (search && cat.search && search === cat.search)
                                        ? 'text-[#2874f0]' : 'text-gray-700 hover:text-[#2874f0]'
                                }`}>
                                <CategoryNavIcon name={cat.title}
                                    active={(activeCategory === cat.title && !search) || (!!search && search === cat.search)} />
                                <span className="text-[11px] font-medium whitespace-nowrap mt-1">{cat.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Quick Links Strip ── */}
            <div className="bg-white border-b border-gray-200 shadow-sm py-2.5 hidden md:block">
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-center gap-6 text-[13px] font-medium text-gray-700">
                    <span className="hover:text-[#2874f0] cursor-pointer transition-colors">No Cost EMI</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="hover:text-[#2874f0] cursor-pointer transition-colors">Debit Card EMI</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="hover:text-[#2874f0] cursor-pointer transition-colors">UPI / Pay Later</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="hover:text-[#2874f0] cursor-pointer transition-colors">SuperCoin Pay</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="hover:text-[#2874f0] cursor-pointer transition-colors">Flipkart Wholesale</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="hover:text-[#2874f0] cursor-pointer transition-colors">Flipkart Creator Studio</span>
                </div>
            </div>

            <DeliveryLocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />

            <div className="max-w-screen-xl mx-auto px-3 py-3">
                {/* ─── FOR YOU: Banners + Sections ─── */}
                {isForYou ? (
                    <>
                        <BannerCarousel slides={AD_BANNERS} />

                        {/* Wide Banner */}
                        <div
                            className="rounded-sm overflow-hidden h-44 flex items-center px-10 gap-6 mb-4 relative cursor-pointer hover:shadow-md transition-shadow"
                            style={{ background: WIDE_BANNER.bg }}
                        >
                            <div className="flex-1">
                                <div className="text-gray-800 text-3xl font-black leading-tight">{WIDE_BANNER.headline}</div>
                                <div className="text-gray-900 text-2xl font-black mt-1">{WIDE_BANNER.subline}</div>
                                <div className="text-gray-400 text-xs mt-2">{WIDE_BANNER.note}</div>
                            </div>
                            <div className="flex flex-col items-end justify-between h-full py-2">
                                <div className="text-[10px] text-gray-400 font-semibold border border-gray-300 px-1.5 py-0.5 rounded-sm">AD</div>
                                <div className="text-2xl font-black text-gray-800 italic">{WIDE_BANNER.brand}</div>
                            </div>
                        </div>

                        {/* Horizontal Product Sections */}
                        {HOME_SECTIONS.map(sec => (
                            <HorizontalSection
                                key={sec.search}
                                title={sec.title}
                                color={sec.color}
                                products={sectionData[sec.search] || []}
                                onAddToCart={(p) => dispatch(addToCart(p))}
                                onViewAll={() => navigate(`/?search=${encodeURIComponent(sec.search)}`)}
                                getBrand={getBrand}
                                getCat={getCat}
                            />
                        ))}

                    </>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4">
                        <ProductFilters
                            search={resolveSearchTerm() || undefined}
                            filters={filters}
                            onChange={setFilters}
                        />
                        <div className="flex-1 min-w-0">
                            {isAutoCategory && <AutoCategoryLanding />}
                            <h2 className="text-base font-bold text-gray-800 mb-3 bg-white px-4 py-3 rounded-sm shadow-sm border-l-4 border-[#2874f0]">
                                {search ? `Results for "${search}"` : `${activeCategory} — Best Sellers`}
                                {(filters.brand || filters.attributes) && (
                                    <span className="text-xs font-normal text-gray-500 ml-2">(filtered)</span>
                                )}
                            </h2>
                            {loading ? (
                                <div className="flex justify-center items-center h-64 bg-white rounded-sm">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2874f0]" />
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 bg-white rounded-sm">
                                    <div className="text-5xl mb-3">🔍</div>
                                    <p className="font-semibold text-gray-600">No products found</p>
                                    <p className="text-sm mt-1">Try changing filters or search term</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {searchResults.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={() => dispatch(addToCart(product))}
                                            getBrand={getBrand}
                                            getCat={getCat}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* ── Brand Directory & SEO ── */}
                <BrandDirectory />
                <div className="bg-white rounded-sm shadow-sm p-6 mb-4 mt-4">
                    {SEO_SECTIONS.map((s, i) => (
                        <div key={i} className="mb-5 last:mb-0">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                                {s.heading}
                            </h2>
                            <p className="text-[11px] text-gray-500 leading-relaxed text-justify">
                                {s.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            </main>

            {/* ─── Footer ─── */}
            <SiteFooter />
        </div>
    );
}

// ─── Horizontal Section ─────────────────────────────────────────────────────
function HorizontalSection({
    title, color, products, onAddToCart, onViewAll, getBrand, getCat
}: {
    title: string; color: string; products: any[]; onAddToCart: (p: any) => void;
    onViewAll: () => void; getBrand: (p: any) => string; getCat: (p: any) => string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
    };

    return (
        <div className="bg-white rounded-sm shadow-sm mb-3 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: color }}>
                <h2 className="text-white font-bold text-base">{title}</h2>
                <button
                    onClick={onViewAll}
                    className="bg-white text-sm font-bold px-4 py-1.5 rounded-sm flex items-center gap-1 hover:bg-gray-50 transition-colors"
                    style={{ color }}
                >
                    View All <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Scrollable product row */}
            <div className="relative group">
                {/* Left arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-8 h-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 rounded-r-sm"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-3">
                    {products.length === 0 ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-36 h-52 bg-gray-100 rounded-sm animate-pulse" />
                        ))
                    ) : (
                        products.map(p => (
                            <div key={p.id} className="flex-shrink-0 w-36 group/card">
                                <Link to={`/product/${p.id}`} className="block">
                                    <div className="h-36 flex items-center justify-center p-2 bg-gray-50 rounded-sm overflow-hidden">
                                        <img
                                            src={p.images?.[0] || p.thumbnail}
                                            alt={p.title}
                                            className="max-h-full max-w-full object-contain group-hover/card:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-snug">{p.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{getBrand(p) || getCat(p)}</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">₹{Math.floor(Number(p.price) * 82)}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => onAddToCart(p)}
                                    className="w-full mt-1.5 flex items-center justify-center gap-1 text-[#2874f0] border border-[#2874f0] text-xs font-semibold py-1 rounded-sm hover:bg-[#2874f0] hover:text-white transition-colors"
                                >
                                    <ShoppingCart className="w-3 h-3" /> Add
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Right arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-8 h-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 rounded-l-sm"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </div>
    );
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, getBrand, getCat }: {
    product: any; onAddToCart: () => void;
    getBrand: (p: any) => string; getCat: (p: any) => string;
}) {
    return (
        <div className="bg-white rounded-sm p-3 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-0.5">
            <Link to={`/product/${product.id}`} className="block relative h-44 overflow-hidden flex items-center justify-center p-2">
                <img
                    src={product.images?.[0] || product.thumbnail}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
                {product.stock < 30 && (
                    <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-sm">
                        Only {product.stock} left!
                    </span>
                )}
            </Link>
            <div className="mt-2 flex-grow flex flex-col text-center">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 hover:text-[#2874f0] transition-colors leading-snug">{product.title}</h3>
                    <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{getBrand(product) || getCat(product)}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="inline-flex items-center text-xs text-white bg-green-600 px-1.5 py-0.5 rounded-sm font-bold">
                            {Number(product.rating).toFixed(1)} <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
                        </span>
                    </div>
                    <div className="mt-1.5 flex items-baseline justify-center gap-2">
                        <span className="text-base font-bold text-gray-900">₹{Math.floor(Number(product.price) * 82)}</span>
                        <span className="text-xs text-gray-400 line-through">₹{Math.floor(Number(product.price) * 82 * 1.35)}</span>
                        <span className="text-xs font-bold text-green-600">26% off</span>
                    </div>
                </Link>
                <button
                    onClick={onAddToCart}
                    className="w-full mt-2.5 flex items-center justify-center gap-1.5 bg-white text-gray-700 border border-gray-200 text-sm font-medium py-1.5 rounded hover:bg-[#ff9f00] hover:text-white hover:border-[#ff9f00] transition-colors"
                >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
            </div>
        </div>
    );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function SiteFooter() {
    return (
        <footer className="mt-0">
            {/* Main footer columns */}
            <div className="bg-[#212121] text-white py-10">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-xs">
                    {/* About */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-[#878787] uppercase tracking-wider mb-3">About</h4>
                        {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:underline transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Group Companies */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-[#878787] uppercase tracking-wider mb-3">Group Companies</h4>
                        {['Myntra', 'Cleartrip', 'Shopsy'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:underline transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Help */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-[#878787] uppercase tracking-wider mb-3">Help</h4>
                        {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:underline transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Consumer Policy */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-[#878787] uppercase tracking-wider mb-3">Consumer Policy</h4>
                        {['Cancellation & Returns', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal', 'EPR Compliance', 'FSSAI Food Safety Connect App'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:underline transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Mail Us */}
                    <div className="border-l border-[#454545] pl-6 -ml-2 hidden lg:block">
                        <h4 className="text-[11px] font-semibold text-[#878787] mb-3">Mail Us:</h4>
                        <p className="leading-relaxed">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &amp;<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India
                        </p>
                        {/* Social icons */}
                        <div className="mt-4">
                            <h4 className="text-[11px] font-semibold text-[#878787] mb-2">Social:</h4>
                            <div className="flex gap-4">
                                {[
                                    { label: 'f', title: 'Facebook', cls: 'font-serif text-lg font-bold' },
                                    { label: '𝕏', title: 'X/Twitter', cls: 'text-lg' },
                                    { label: '▶', title: 'YouTube', cls: 'text-sm' },
                                    { label: '◉', title: 'Instagram', cls: 'text-lg' },
                                ].map(s => (
                                    <button key={s.title} title={s.title} className={`text-white hover:text-[#2874f0] transition-colors ${s.cls}`}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Registered Office */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-[#878787] mb-3">Registered Office Address:</h4>
                        <p className="leading-relaxed">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &amp;<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India<br />
                            CIN : U51109KA2012PTC066107<br />
                            Telephone: <span className="text-[#2874f0]">044-45614700</span> / <span className="text-[#2874f0]">044-67415800</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Seller bar */}
            <div className="bg-[#212121] border-t border-[#454545] py-4">
                <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-sm text-white">
                    <div className="flex flex-wrap gap-8">
                        {[
                            { icon: '🏪', label: 'Become a Seller' },
                            { icon: '📣', label: 'Advertise' },
                            { icon: '🎴', label: 'Gift Cards' },
                            { icon: '🎧', label: 'Help Center' },
                        ].map(item => (
                            <button key={item.label} className="flex items-center gap-2 hover:underline transition-colors text-[13px]">
                                <span className="text-yellow-400">{item.icon}</span>
                                <span className="font-semibold text-white">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="text-white font-medium text-[13px]">© 2007–2026 Flipkart.com</div>
                    {/* Payment icons */}
                    <div className="flex items-center gap-1.5 opacity-80">
                        {['VISA', 'MC', 'AMEX', 'UPI', 'EMI', 'NET'].map(p => (
                            <span key={p} className="bg-white border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-sm text-gray-800">{p}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
