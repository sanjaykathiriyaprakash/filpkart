import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { buildProductsQuery } from '../lib/api';
import BrandDirectory from '../components/BrandDirectory';
import ProductFilters, { type ProductFilterState } from '../components/ProductFilters';

interface ProductType {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    images?: string[];
    thumbnail?: string;
    category?: { name?: string } | string;
    brand?: { name?: string } | string;
    attributes?: Record<string, string>;
}

function getSidebarConfig(query: string, products: any[]) {
    const q = query.toLowerCase();
    
    // Check if the query or products is related to Mobiles/Electronics
    const isMobile = q.includes('infinix') || q.includes('mobile') || q.includes('phone') || q.includes('smartphone') || q.includes('apple') || q.includes('samsung') || q.includes('realme') || q.includes('oppo') || q.includes('vivo') || q.includes('motorola') || q.includes('poco') || products.some(p => {
        const cat = ((p.category as any)?.name || '').toLowerCase();
        return cat.includes('mobile') || cat.includes('smartphone');
    });

    const isLaptop = q.includes('laptop') || q.includes('hp') || q.includes('dell') || q.includes('lenovo') || q.includes('asus') || q.includes('acer') || q.includes('macbook') || q.includes('computer') || products.some(p => {
        const cat = ((p.category as any)?.name || '').toLowerCase();
        return cat.includes('laptop');
    });

    const isTVOrAppliance = q.includes('tv') || q.includes('television') || q.includes('lg') || q.includes('sony') || q.includes('washing') || q.includes('fridge') || q.includes('refrigerator') || q.includes('ac') || q.includes('air conditioner') || q.includes('launch') || q.includes('screen') || q.includes('size') || q.includes('brand') || q.includes('guide') || q.includes('appliance') || products.some(p => {
        const cat = ((p.category as any)?.name || '').toLowerCase();
        return cat.includes('television') || cat.includes('washing') || cat.includes('refrigerator') || cat.includes('appliance') || cat.includes('kitchen');
    });

    if (isMobile) {
        return {
            layout: 'list',
            categoryParent: 'Mobiles & Accessories',
            categoryChildren: ['Mobiles', 'Mobile Accessories', 'Smart Wearable Tech'],
            activeCategory: 'Mobiles',
            brands: ['Infinix', 'Apple', 'Samsung', 'Realme', 'OPPO', 'Vivo', 'Motorola'],
            extraFilterName: 'RAM',
            extraFilterOptions: ['2 GB', '3 GB', '4 GB', '6 GB', '8 GB and Above']
        };
    } else if (isLaptop) {
        return {
            layout: 'list',
            categoryParent: 'Computers & Laptops',
            categoryChildren: ['Laptops', 'Gaming Laptops', 'Desktop PCs', 'Computer Accessories'],
            activeCategory: 'Laptops',
            brands: ['HP', 'Apple', 'Dell', 'Lenovo', 'Asus', 'Acer'],
            extraFilterName: 'Processor',
            extraFilterOptions: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2/M3']
        };
    } else if (isTVOrAppliance) {
        return {
            layout: 'list',
            categoryParent: 'TVs & Appliances',
            categoryChildren: ['Television', 'Washing Machine', 'Refrigerators', 'Air Conditioners'],
            activeCategory: q.includes('washing') ? 'Washing Machine' : q.includes('refrigerator') ? 'Refrigerators' : 'Television',
            brands: ['Samsung', 'LG', 'Sony', 'Mi', 'Whirlpool', 'Voltas'],
            extraFilterName: 'Energy Rating',
            extraFilterOptions: ['5 Star', '4 Star', '3 Star', '2 Star']
        };
    }

    // Default Clothing/General Grid Layout
    return {
        layout: 'grid',
        categoryParent: 'Clothing and Accessories',
        categoryChildren: ['Winter Wear', 'Topwear', 'Bottomwear', 'Raincoats', 'Clothing Accessories'],
        activeCategory: 'Topwear',
        brands: ['Jockey', 'Levi\'s', 'Wrangler', 'Biba', 'Aurelia', 'Harpa'],
        extraFilterName: 'Ideal For',
        extraFilterOptions: ['Men', 'Women', 'Kids', 'Unisex']
    };
}

const getSeoText = (config: ReturnType<typeof getSidebarConfig>) => {
    if (config.categoryParent.includes('Mobiles')) {
        return `Explore the wide collection of premium smartphones and mobiles. Buy Infinix, Apple, Samsung, and other brand mobiles online at the best prices in India. Compare specifications, ratings, reviews, and features of latest mobiles to find the perfect device matching your budget and lifestyle.`;
    } else if (config.categoryParent.includes('Computers')) {
        return `Discover top-tier laptops from major global brands. Whether you need an elite gaming machine, an ultra-slim student laptop, or a powerful workstation, we have HP, Apple MacBooks, Dell, and Lenovo systems designed to fuel your productivity and entertainment.`;
    } else if (config.categoryParent.includes('Appliances')) {
        return `Upgrade your smart home with cutting-edge televisions and household appliances. Find outstanding deals on 4K Google TVs, smart inverter washing machines, double door refrigerators, split air conditioners, and more from leaders like Samsung, LG, and Sony.`;
    }
    // Default Clothing SEO text
    return `Upgrade your wardrobe with clothing that blends fashion and functionality. For a more polished look, explore checked shirts. Look into these checked shirts to add a hint of sophistication to your casual wear. They can be dressed up or down depending on the occasion. For a relaxed fit, check out track pants. These men's clothing are ideal for lounging at home, running errands, or hitting the gym. Check out co-ord sets for women, which offer a chic and trendy option. These sets usually include a matching top and bottom. Explore the range of bodycon dresses. These women's clothing offer a sleek and confident look. Ideal for a special occasion, bodycon dresses come in various styles and fabrics. If you love making a bold statement with your outfit, then check out bodycon dresses for a stunning, form-fitting style. If you need a wardrobe that works for every occasion, then explore the range of clothing and accessories available. If you're dressing for a festive or grand wedding event, consider adding a lehenga to your collection, or choose an Anarkali for a simple function to keep your look traditionally elegant. If you want to add a touch of elegance to your formal wear, then explore different types of ties.`;
};

const getRatingsCount = (p: any) => {
    const titleLength = p.title ? p.title.length : 10;
    const base = Math.floor(((Number(p.price) || 100) * 149 + titleLength * 17) % 8000) + 150;
    const reviews = Math.floor(base * 0.08) + 12;
    return `${base.toLocaleString()} Ratings & ${reviews.toLocaleString()} Reviews`;
};

const getSpecList = (p: any) => {
    const attrs = p.attributes || {};
    const specs: string[] = [];
    if (attrs.RAM && attrs.ROM) specs.push(`${attrs.RAM} | ${attrs.ROM}`);
    else if (attrs.RAM) specs.push(attrs.RAM);
    
    if (attrs.Display) specs.push(attrs.Display);
    if (attrs.Camera) specs.push(attrs.Camera);
    if (attrs.Battery) specs.push(attrs.Battery);
    if (attrs.Processor) specs.push(attrs.Processor);
    if (attrs.Warranty) specs.push(attrs.Warranty);
    
    // Fallbacks if attributes are empty but it is in list view
    if (specs.length === 0) {
        specs.push('6 GB RAM | 128 GB ROM');
        specs.push('16.76 cm (6.6 inch) Full HD+ Display');
        specs.push('50MP + 2MP | 8MP Front Camera');
        specs.push('5000 mAh Battery');
        specs.push('Dimensity 7020 Processor');
        specs.push('1 Year Manufacturer Warranty for Phone');
    }
    return specs;
};

export default function Search() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<ProductFilterState>({});
    const [prevQ, setPrevQ] = useState(q);

    if (q !== prevQ) {
        setPrevQ(q);
        setFilters({});
    }

    useEffect(() => {
        setLoading(true);
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
        axios.get(url)
            .then(r => setProducts(r.data))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [q, filters]);

    const getCat = (p: ProductType) => (p.category as { name?: string })?.name || (typeof p.category === 'string' ? p.category : '');
    const getBrand = (p: ProductType) => (p.brand as { name?: string })?.name || (typeof p.brand === 'string' ? p.brand : '');

    const config = getSidebarConfig(q, products);
    const seoText = getSeoText(config);

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-2 pb-8">
            <div className="max-w-screen-xl mx-auto px-2">
                <div className="flex flex-col md:flex-row gap-2 items-start">
                    
                    <ProductFilters
                        search={q || undefined}
                        filters={filters}
                        onChange={setFilters}
                    />

                    {/* Right Main Content */}
                    <div className="flex-1 w-full bg-white rounded-sm shadow-sm p-4 border border-gray-100 min-h-screen">
                        
                        {/* Breadcrumbs */}
                        <div className="text-[12px] text-gray-500 mb-3 flex items-center">
                            <Link to="/" className="hover:text-[#2874f0] transition-colors">Home</Link>
                            <span className="mx-1.5 opacity-60">›</span>
                            <span className="hover:text-[#2874f0] cursor-pointer">{config.categoryParent}</span>
                            <span className="mx-1.5 opacity-60">›</span>
                            <span className="text-gray-800 font-medium">{config.activeCategory}</span>
                        </div>

                        {/* SEO Text Block */}
                        <div className="text-[12px] text-gray-600 mb-5 leading-relaxed bg-white text-left">
                            {seoText}
                        </div>

                        {/* Header and Sort Bar */}
                        <div className="flex flex-col border-b border-gray-200 pb-2 mb-4">
                            <h1 className="text-base font-bold text-gray-800 flex items-center gap-2 text-left">
                                {config.categoryParent === 'Clothing and Accessories' ? 'Clothing And Accessories' : config.activeCategory}
                                <span className="text-[12px] font-normal text-gray-500 mt-0.5">
                                    (Showing 1 - {products.length} products of {products.length} products)
                                </span>
                            </h1>
                            <div className="flex items-center gap-6 mt-3 text-[14px] text-gray-800">
                                <span className="font-semibold text-gray-800">Sort By</span>
                                <button 
                                    onClick={() => setFilters(f => ({ ...f, sortBy: 'popularity' }))}
                                    className={`pb-1.5 transition-colors ${(!filters.sortBy || filters.sortBy === 'popularity') ? 'text-[#2874f0] font-semibold border-b-[3px] border-[#2874f0] -mb-[9px]' : 'hover:text-[#2874f0]'}`}
                                >
                                    Popularity
                                </button>
                                <button 
                                    onClick={() => setFilters(f => ({ ...f, sortBy: 'price_asc' }))}
                                    className={`pb-1.5 transition-colors ${filters.sortBy === 'price_asc' ? 'text-[#2874f0] font-semibold border-b-[3px] border-[#2874f0] -mb-[9px]' : 'hover:text-[#2874f0]'}`}
                                >
                                    Price -- Low to High
                                </button>
                                <button 
                                    onClick={() => setFilters(f => ({ ...f, sortBy: 'price_desc' }))}
                                    className={`pb-1.5 transition-colors ${filters.sortBy === 'price_desc' ? 'text-[#2874f0] font-semibold border-b-[3px] border-[#2874f0] -mb-[9px]' : 'hover:text-[#2874f0]'}`}
                                >
                                    Price -- High to Low
                                </button>
                                <button 
                                    onClick={() => setFilters(f => ({ ...f, sortBy: '' }))}
                                    className={`pb-1.5 transition-colors ${filters.sortBy === '' ? 'text-[#2874f0] font-semibold border-b-[3px] border-[#2874f0] -mb-[9px]' : 'hover:text-[#2874f0]'}`}
                                >
                                    Newest First
                                </button>
                            </div>
                        </div>

                        {/* Products dynamic layouts */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2874f0]" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <div className="text-5xl mb-3">🔍</div>
                                <p className="font-semibold text-gray-600">No products found</p>
                                <p className="text-sm mt-1">Try a different search term</p>
                            </div>
                        ) : config.layout === 'list' ? (
                            /* ── LIST LAYOUT ── */
                            <div className="flex flex-col gap-0 divide-y divide-gray-200 border-t border-b border-gray-200">
                                {products.map((product) => {
                                    const rating = Number(product.rating || 4.2).toFixed(1);
                                    const priceINR = Math.floor(Number(product.price) * 82);
                                    const mfgPrice = Math.floor(priceINR * 1.35);
                                    const discount = 26;
                                    const specs = getSpecList(product);
                                    
                                    return (
                                        <div key={product.id} className="group flex flex-col md:flex-row gap-6 bg-white p-6 hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] transition-shadow duration-300 relative">
                                            
                                            {/* Left Column: Image, Compare, Heart */}
                                            <div className="w-full md:w-[200px] flex-shrink-0 flex flex-col items-center">
                                                <div className="relative h-[200px] w-full flex items-center justify-center mb-4">
                                                    <Link to={`/product/${product.id}`} className="block h-full w-full flex items-center justify-center">
                                                        <img
                                                            src={product.images?.[0] || product.thumbnail}
                                                            alt={product.title}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </Link>
                                                    {/* Wishlist Heart */}
                                                    <div className="absolute top-0 right-0 text-gray-300 hover:text-red-500 cursor-pointer transition-colors">
                                                        <Heart className="w-5 h-5 fill-current" />
                                                    </div>
                                                </div>
                                                
                                                {/* Compare Checkbox */}
                                                <label className="flex items-center gap-2 cursor-pointer mt-2 text-[13px] text-gray-600 hover:text-gray-900">
                                                    <input type="checkbox" className="w-3.5 h-3.5 border-gray-300 rounded-[3px] text-[#2874f0] focus:ring-[#2874f0] cursor-pointer" />
                                                    <span>Add to Compare</span>
                                                </label>
                                            </div>

                                            {/* Middle Column: Title, Ratings, Specs */}
                                            <div className="flex-1 text-left">
                                                <Link to={`/product/${product.id}`} className="hover:text-[#2874f0] transition-colors">
                                                    <h2 className="text-[18px] font-bold text-gray-900 leading-snug group-hover:text-[#2874f0] transition-colors">
                                                        {product.title}
                                                    </h2>
                                                </Link>
                                                
                                                {/* Ratings block */}
                                                <div className="flex items-center mt-1.5">
                                                    <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">
                                                        {rating} <Star className="w-3 h-3 fill-current" />
                                                    </span>
                                                    <span className="text-[13px] text-gray-500 font-medium ml-2.5">
                                                        {getRatingsCount(product)}
                                                    </span>
                                                </div>

                                                {/* Specifications */}
                                                <ul className="mt-3.5 space-y-1.5 text-[14px] text-gray-600 list-disc pl-4 leading-normal font-sans">
                                                    {specs.map((spec, i) => (
                                                        <li key={i} className="pl-0.5">{spec}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Right Column: Prices, Assured, Delivery */}
                                            <div className="w-full md:w-[240px] flex-shrink-0 text-left md:pl-6 md:border-l border-gray-100 flex flex-col justify-start">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-[#212121]">
                                                        ₹{priceINR.toLocaleString()}
                                                    </span>
                                                    {/* Assured Badge */}
                                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-[18px] ml-1" />
                                                </div>
                                                
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-[14px] text-gray-500 line-through">
                                                        ₹{mfgPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-[13px] font-bold text-[#388e3c]">
                                                        {discount}% off
                                                    </span>
                                                </div>

                                                <div className="text-[12px] text-gray-600 mt-2 font-medium">
                                                    Free delivery
                                                </div>
                                                
                                                <div className="text-[12px] font-bold text-[#388e3c] mt-2.5">
                                                    Upto ₹15,000 Off on Exchange
                                                </div>

                                                <div className="text-[12px] text-gray-500 mt-1">
                                                    Bank Offer
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* ── GRID LAYOUT ── */
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-gray-200">
                                {products.map((product, index) => (
                                    <div key={product.id} className="group relative bg-white p-4 border-b border-r border-gray-200 hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] transition-shadow duration-300 flex flex-col hover:z-10 bg-white">
                                        
                                        {/* Wishlist Heart */}
                                        <div className="absolute top-4 right-4 z-10 text-gray-300 hover:text-red-500 cursor-pointer">
                                            <Heart className="w-5 h-5 fill-current" />
                                        </div>

                                        {/* Product Image */}
                                        <Link to={`/product/${product.id}`} className="block relative h-[280px] w-full flex items-center justify-center mb-4">
                                            <img
                                                src={product.images?.[0] || product.thumbnail}
                                                alt={product.title}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                            {/* Bestseller Tag - Add to first item as example */}
                                            {index === 3 && (
                                                <span className="absolute top-0 left-0 bg-[#008c00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                                    Bestseller
                                                </span>
                                            )}
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-grow flex flex-col text-left">
                                            <Link to={`/product/${product.id}`} className="flex-grow">
                                                {/* Sponsored text - Add to first few items as example */}
                                                {(index === 0 || index === 1 || index === 2) && (
                                                    <div className="text-[11px] text-gray-400 mb-1">Sponsored</div>
                                                )}
                                                
                                                <div className="text-[14px] text-gray-500 font-medium mb-1 line-clamp-1">
                                                    {getBrand(product) || getCat(product)}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <h3 className="text-[#212121] text-[14px] line-clamp-1 hover:text-[#2874f0] transition-colors" title={product.title}>
                                                        {product.title}
                                                    </h3>
                                                    {/* Assured Badge */}
                                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-[18px] ml-auto" />
                                                </div>

                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-[16px] font-bold text-[#212121]">
                                                        ₹{Math.floor(Number(product.price) * 82).toLocaleString()}
                                                    </span>
                                                    <span className="text-[14px] text-gray-500 line-through">
                                                        ₹{Math.floor(Number(product.price) * 82 * 1.35).toLocaleString()}
                                                    </span>
                                                    <span className="text-[13px] font-bold text-[#388e3c]">
                                                        26% off
                                                    </span>
                                                </div>
                                                
                                                {/* Sale Tag */}
                                                <div className="text-[12px] font-bold text-[#8728df] mt-1.5 tracking-wide">
                                                    SALE PE SALE
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8">
                            <BrandDirectory />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom scrollbar styles for brand filter */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c2c2c2;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a0a0a0;
                }
            `}</style>
        </div>
    );
}
