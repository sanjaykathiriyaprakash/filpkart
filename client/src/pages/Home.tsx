import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import BrandDirectory from '../components/BrandDirectory';
import ProductFilters, { type ProductFilterState } from '../components/ProductFilters';
import { CategoryNavIcon } from '../components/CategoryNavIcons';
import AutoCategoryLanding from '../components/AutoCategoryLanding';
import { buildProductsQuery } from '../lib/api';
import { API_BASE } from '../lib/api';

const NAV_CATEGORIES = [
    { title: 'For You', search: '' },
    { title: 'Fashion', search: 'mens-shirts' },
    { title: 'Mobiles', search: 'smartphones' },
    { title: 'Beauty', search: 'beauty' },
    { title: 'Electronics', search: 'laptops' },
    { title: 'Home', search: 'home-decoration' },
    { title: 'Appliances', search: 'kitchen-accessories' },
    { title: 'Toys, ba...', search: 'mobile-accessories' },
    { title: 'Food & H...', search: 'groceries' },
    { title: 'Auto Acc...', search: 'automotive' },
    { title: '2 Wheele...', search: 'motorcycle' },
    { title: 'Sports & ...', search: 'sports-accessories' },
    { title: 'Books & ...', search: 'books' },
    { title: 'Furniture', search: 'furniture' },
];

// Sections shown on "For You" as horizontal rows
const HOME_SECTIONS = [
    { title: 'Appliance for Cool Summer', search: 'kitchen-accessories', color: '#ff6161' },
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

// ─── SEO text ──────────────────────────────────────────────────────────────
const SEO_SECTIONS = [
    {
        heading: "Flipkart: India's Ultimate One-Stop Online Shopping Destination",
        body: "Welcome to Flipkart, India's trusted and beloved e-commerce platform, revolutionising online shopping since 2007. With over 200 million users, 150 million+ products across 80+ categories, and a relentless focus on customer satisfaction, Flipkart isn't just an online store — it's your digital shopping companion.",
    },
    {
        heading: 'What Can You Buy from Flipkart?',
        body: "Mobile and Electronics · Fashion · Home and Kitchen Appliances · Beauty and Grooming · Groceries and Daily Essentials · Sports & Outdoors · Furniture · Toys & Baby Products · Books & Stationery — and much more.",
    },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('For You');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [sectionData, setSectionData] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<ProductFilterState>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');

    useEffect(() => {
        if (!search) return;
        const match = NAV_CATEGORIES.find((c) => c.search === search);
        if (match) setActiveCategory(match.title);
    }, [search]);

    const isForYou = activeCategory === 'For You' && !search;
    const isAutoCategory =
        activeCategory === 'Auto Acc...' || search === 'automotive' || searchParams.get('search') === 'automotive';

    const resolveSearchTerm = () => {
        const cat = NAV_CATEGORIES.find((c) => c.title === activeCategory);
        return search || cat?.search || '';
    };

    // Fetch for category/search pages (with dynamic filters)
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
                    color: filters.color,
                    size: filters.size,
                    brand: filters.brand,
                    sortBy: filters.sortBy,
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

    // Fetch all sections for "For You" home
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
        setActiveCategory(cat.title);
        if (cat.search) navigate(`/?search=${encodeURIComponent(cat.search)}`);
        else navigate('/');
    };

    const getCat = (p: any) => (p.category as any)?.name || p.category || '';
    const getBrand = (p: any) => (p.brand as any)?.name || p.brand || '';

    return (
        <div className="min-h-screen bg-[#f1f3f6]">
            {/* ─── Category Nav Strip ─── */}
            <div className="bg-white shadow-sm sticky top-14 z-40">
                <div className="max-w-screen-xl mx-auto">
                    <div className="flex items-end overflow-x-auto no-scrollbar px-2">
                        {NAV_CATEGORIES.map(cat => (
                            <button
                                key={cat.title}
                                onClick={() => handleCategoryClick(cat)}
                                className={`flex flex-col items-center py-2 px-3 min-w-[72px] border-b-2 transition-all flex-shrink-0 ${activeCategory === cat.title && !search || (search && cat.search && search === cat.search)
                                    ? 'border-[#2874f0] text-[#2874f0]'
                                    : 'border-transparent text-gray-600 hover:text-[#2874f0]'}`}
                            >
                                <CategoryNavIcon
                                    name={cat.title}
                                    active={activeCategory === cat.title || (!!search && search === cat.search)}
                                />
                                <span className="text-[11px] font-semibold whitespace-nowrap mt-1">{cat.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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

                        <BrandDirectory />

                        <div className="bg-white rounded-sm shadow-sm p-6 mt-4 mb-4">
                            {SEO_SECTIONS.map((s, i) => (
                                <div key={i} className="mb-4">
                                    <h2 className="text-base font-bold text-gray-800 mb-1">{s.heading}</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
                                </div>
                            ))}
                        </div>
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
                                {(filters.color || filters.size || filters.brand) && (
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
                            <BrandDirectory />
                        </div>
                    </div>
                )}
            </div>

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
        <footer className="mt-6">
            {/* Seller bar */}
            <div className="bg-[#f0f0f0] border-t border-gray-300 py-4">
                <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-6">
                        {[
                            { icon: '🏪', label: 'Become a Seller' },
                            { icon: '📣', label: 'Advertise' },
                            { icon: '🎴', label: 'Gift Cards' },
                            { icon: '🎧', label: 'Help Center' },
                        ].map(item => (
                            <button key={item.label} className="flex items-center gap-2 hover:text-[#2874f0] transition-colors">
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="text-gray-400 text-xs">© 2007–2026 Flipkart.com</div>
                    {/* Payment icons */}
                    <div className="flex items-center gap-1.5">
                        {['VISA', 'MC', 'AMEX', 'UPI', 'EMI', 'NET'].map(p => (
                            <span key={p} className="bg-white border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded text-gray-600">{p}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main footer columns */}
            <div className="bg-[#172337] text-gray-400 py-10">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-xs">
                    {/* About */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">About</h4>
                        {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Group Companies */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Group Companies</h4>
                        {['Myntra', 'Cleartrip', 'Shopsy'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Help */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Help</h4>
                        {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Consumer Policy */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Consumer Policy</h4>
                        {['Cancellation & Returns', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal', 'EPF Compliance', 'FSSAI Food Safety Connect App'].map(l => (
                            <a key={l} href="#" className="block py-1 hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                    {/* Mail Us */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Mail Us</h4>
                        <p className="leading-relaxed text-gray-500">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &amp;<br />
                            Olive, Embassy Tech Village,<br />
                            Outer Ring Road,<br />
                            Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3 mt-4">
                            {[
                                { label: 'f', title: 'Facebook' },
                                { label: '𝕏', title: 'X/Twitter' },
                                { label: '▶', title: 'YouTube' },
                                { label: '◉', title: 'Instagram' },
                            ].map(s => (
                                <button key={s.title} title={s.title}
                                    className="w-7 h-7 rounded-full bg-gray-700 hover:bg-[#2874f0] flex items-center justify-center text-xs text-gray-300 hover:text-white transition-colors">
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Registered Office */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Registered Office Address</h4>
                        <p className="leading-relaxed text-gray-500">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &amp;<br />
                            Olive, Embassy Tech Village,<br />
                            Outer Ring Road,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India<br /><br />
                            CIN: U51109KA2012PTC066107<br />
                            Telephone: <span className="text-[#2874f0]">044-45614700</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
