import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import type { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, ChevronDown, Search } from 'lucide-react';
import DeliveryLocationModal from './DeliveryLocationModal';



const MORE_MENU = [
    { icon: '🔔', label: 'Notification Preferences', path: '/notifications' },
    { icon: '🎧', label: '24x7 Customer Care', path: '/help' },
    { icon: '📢', label: 'Advertise', path: '/advertise' },
    { icon: '📱', label: 'Download App', path: '/app' },
    { icon: '🎴', label: 'Gift Cards', path: '/gift-cards' },
];

// Mega-dropdown data — each category has columns, each column has a heading + items
type MegaCol = { heading?: string; bold?: boolean; items: string[] };
type Category = { label: string; search: string; cols: MegaCol[] };

const CATEGORIES: Category[] = [
    {
        label: 'Electronics', search: 'laptops',
        cols: [
            {
                items: ['Mobiles', 'Mi', 'Realme', 'Samsung', 'Infinix', 'OPPO', 'Apple', 'Vivo', 'Honor', 'Asus', 'Poco X2', 'realme Narzo 10', 'Infinix Hot S', 'iQOO 3', 'iPhone SE', 'Motorola razr', 'realme Narzo 30A', 'Motorola g8 power lite'],
            },
            {
                items: ['Mobile Accessories', 'Mobile Cases', 'Headphones & Headsets', 'Power Banks', 'Screenguards', 'Memory Cards', 'Smart Headphones', 'Mobile Cables', 'Mobile Chargers', 'Mobile Holders',
                    'Smart Wearable Tech', 'Smart Watches', 'Smart Glasses (VR)', 'Smart Bands',
                    'Health Care Appliances', 'Bp Monitors', 'Weighing Scale'],
            },
            {
                items: ['Laptops', 'Gaming Laptops',
                    'Desktop PCs',
                    'Gaming & Accessories',
                    'Computer Accessories', 'External Hard Disks', 'Pendrives', 'Laptop Skins & Decals', 'Laptop Bags', 'Mouse',
                    'Computer Peripherals', 'Printers & Ink Cartridges', 'Monitors',
                    'Tablets', 'Apple iPads'],
            },
            {
                items: ['Televisions', 'Speakers', 'Home Audio Speakers', 'Home Theatre', 'Soundbars', 'Bluetooth Speakers', 'DTH Set Top Box',
                    'Smart Home Automation', 'Google Nest',
                    'Camera', 'DSLR & Mirrorless', 'Compact & Bridge Cameras', 'Sports & Action',
                    'Camera Accessories', 'Lens', 'Tripods',
                    'Network Components', 'Routers'],
            },
            {
                heading: 'Featured',
                items: ['Google Assistant Store', 'Laptops on Buyback Guarantee', 'Flipkart SmartBuy', 'Li-Polymer Power Banks', 'Sony, PS4 Pro & Slim', 'Apple Products', 'Microsoft Store', 'Lenovo Phab Series', 'JBL Speakers', 'Smartphones On Buyback Guarantee', 'Philips', 'Dr. Morepen', 'Complete Mobile Protection', 'Mobiles No Cost EMI', 'Huawei Watch Gt 2e Smart Watch'],
            },
        ],
    },
    {
        label: 'TVs & Appliances', search: 'kitchen-accessories',
        cols: [
            {
                items: ['Television', 'New Launches', 'Smart & Ultra HD',
                    'Top Brands', 'Mi', 'Vu', 'Thomson', 'IFFALCON by TCL', 'Nokia', 'LG', 'realme', 'Motorola',
                    'Shop by Screen Size', '24 & below', '28 - 32', '39 - 43', '49 - 55', '60 & above'],
            },
            {
                items: ['Washing Machine', 'Fully Automatic Front Load', 'Semi Automatic Top Load', 'Fully Automatic Top Load',
                    'Air Conditioners', 'Inverter AC', 'Split ACs', 'Window ACs',
                    'Shop By Brand', 'LG', 'Hitachi', 'Carrier',
                    'Refrigerators', 'Single Door', 'Double Door', 'Triple door', 'Side by Side', 'Convertible'],
            },
            {
                items: ['Kitchen Appliances', 'Microwave Ovens', 'Oven Toaster Grills (OTG)', 'Juicer/Mixer/Grinder', 'Electric Kettle', 'Induction Cooktops', 'Chimneys', 'Hand Blenders', 'Sandwich Makers', 'Pop Up Toasters', 'Electric Cookers', 'Wet Grinders', 'Food Processors', 'Coffee Makers', 'Dishwashers',
                    'Healthy Living Appliances'],
            },
            {
                items: ['Small Home Appliances', 'Fans', 'Water Purifiers', 'Air Coolers', 'Inverters', 'Vacuum Cleaners', 'Sewing Machines', 'Voltage Stabilizers', 'Water Geysers', 'Immersion Rods',
                    'Top Brands', 'Livpure', 'Philips', 'Bajaj', 'IFB', 'Eureka Forbes', 'Kent'],
            },
            {
                heading: 'Buying Guides',
                items: ['Televisions', 'Washing Machines', 'Refrigerators', 'Air Conditioners', 'Water Purifiers', 'Air Purifiers', 'Chimneys', 'Water Geysers',
                    'New Launches', 'Crocaa Smart TVs', 'Nokia (55) 4K Android TV', 'Mi (32) 4A Pro Android TV', 'MarQ (43) FHD Smart TV', 'LG Refrigerators', 'Thomson (40) 4K Smart TV', 'Whirlpool Refrigerators', 'Kodak (22) (32) LED TVs'],
            },
        ],
    },
    {
        label: 'Men', search: 'mens-shirts',
        cols: [
            {
                items: ['Footwear', 'Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals & Floaters', 'Flip-Flops', 'Loafers', 'Boots', 'Running Shoes', 'Sneakers',
                    "Men's Grooming", 'Deodorants', 'Perfumes', 'Beard Care & Grooming', 'Shaving & Aftershave', 'Sexual Wellness'],
            },
            {
                items: ['Clothing', 'Top wear', 'T-Shirts', 'Formal Shirts', 'Casual Shirts',
                    'Bottom wear', 'Jeans', 'Casual Trousers', 'Formal Trousers', 'Track pants', 'Shorts', 'Cargos', 'Three Fourths',
                    'Suits, Blazers & Waistcoats',
                    'Ties, Socks, Caps & More',
                    'Fabrics'],
            },
            {
                items: ['Winter Wear', 'Sweatshirts', 'Jackets', 'Sweater', 'Tracksuits',
                    'Ethnic wear', 'Kurta', 'Ethnic Sets', 'Sherwanis', 'Ethnic Pyjama', 'Dhoti', 'Lungi',
                    'Innerwear & Loungewear', 'Briefs & Trunks', 'Vests', 'Boxers', 'Pyjamas and Lounge Pants', 'Thermals', 'Night Suits',
                    'Raincoats & Windcheaters'],
            },
            {
                items: ['Watches', 'Smart Watches', 'Fastrack', 'Casio', 'Titan', 'Fossil', 'Sonata',
                    'Accessories', 'Backpacks', 'Wallets', 'Belts', 'Sunglasses', 'Luggage & Travel', 'Frames', 'Jewellery',
                    'Sports & Fitness Store'],
            },
            {
                heading: 'Featured',
                items: ['Smart Watches', 'Smart Bands', 'Personal Care Appliances', 'Trimmers', 'Shavers', 'Grooming Kits', 'Watches Store', 'Footwear Club', 'Bags & Wallet', 'T-Shirt Store', 'Adidas', 'Beardo', 'Reebok', 'Skechers', 'Nike'],
            },
        ],
    },
    {
        label: 'Women', search: 'womens-dresses',
        cols: [
            {
                items: ['Clothing', 'Women Western & Maternity Wear', 'Topwear', 'Dresses', 'Jeans', 'Shorts', 'Skirts', 'Jeggings & Tights', 'Trousers & Capris',
                    'Lingerie & Sleepwear', 'Bras', 'Panties', 'Lingerie Sets', 'Night Dresses & Nighties', 'Shapewear', 'Camisoles & Slips',
                    'Swim & Beachwear', 'Party Dresses', 'Sports Wear', 'Winter Wear'],
            },
            {
                items: ['Ethnic Wear', 'Sarees', 'Kurtas & Kurtis', 'Dress Material', 'Lehenga Choli', 'Blouse', 'Kurta Sets & Salwar Suits', 'Gowns', 'Dupattas',
                    'Ethnic Bottoms', 'Leggings & Churidars', 'Palazzos', 'Shararas', 'Salwars & Patiala', 'Dhoti Pants', 'Ethnic Trousers', 'Saree Shapewear & Petticoats'],
            },
            {
                items: ['Footwear', 'Sandals', 'Flats', 'Heels', 'Wedges',
                    'Shoes', 'Sports Shoes', 'Casual Shoes', 'Boots',
                    'Ballerinas',
                    'Slippers & Flip-Flops',
                    'Watches', 'Smart Watches',
                    'Personal Care Appliances', 'Hair Straighteners', 'Hair Dryers', 'Epilators'],
            },
            {
                items: ['Beauty & Grooming', 'Make Up', 'Skin Care', 'Hair Care', 'Bath & Spa', 'Deodorants & Perfumes',
                    'Jewellery', 'Artificial Jewellery', 'Silver Jewellery', 'Precious Jewellery', 'Coins and Bars',
                    'Accessories', 'Handbags', 'Shoulder Bags', 'Totes', 'Sling bags', 'Clutches', 'Wallets & Belts', 'Luggage & Travel', 'Sunglasses', 'Frames'],
            },
            {
                heading: 'Featured',
                items: ['Forever 21', 'Accessories', 'Pantaroness', 'Chemistry', 'Lakme', 'Nivea', 'Catwalk', 'Titan-Raga', 'Fastrack', 'Diwatri', 'Rare Roots', 'Avni', 'Coins & Bars', 'Crocs', 'Trending today', 'Ruffles & Frills', 'Rayon Kurtas & Sets', 'Designer Net Sarees'],
            },
        ],
    },
    {
        label: 'Baby & Kids', search: 'mobile-accessories',
        cols: [
            {
                items: ["Kids' Clothing", "Boys' Clothing", 'T-Shirts', 'Ethnic Wear', 'Shorts', 'Shirts', 'Innerwear',
                    "Girls' Clothing", 'Dresses & Skirts', 'Ethnic Wear', 'T-shirts & Tops', 'Innerwear',
                    "Baby Boys' Clothing", 'Combos Sets', 'T-Shirts', 'Innerwear',
                    "Baby Girls' Clothing", 'Combos Sets', 'Dresses & Gowns', 'Innerwear'],
            },
            {
                items: ["Kids' Footwear", "Boys' Footwear", 'Sandals', 'Sport Shoes',
                    "Girls' Footwear", 'Flats & Bellies', 'Sport Shoes',
                    'Infant Footwear',
                    'Character Shoes', "Kids' Watches", "Kids' Sunglasses",
                    "Kids' Winter Wear", "Boys' Winter Wear", "Boys' Sweatshirts", "Boys' Jacket",
                    "Girls' Winter Wear", "Girls' Sweatshirts", "Girls' Jackets", 'Infant Winter Wear', 'Thermals'],
            },
            {
                items: ['Toys', 'Remote Control Toys', 'Educational Toys', 'Soft Toys', 'Cars & Die-cast Vehicles', 'Outdoor Toys', 'Action Figures', 'Board Games', 'Musical Toys', 'Dolls & Doll Houses', 'Puzzles', 'S.T.E.M Toys', 'Helicopter & Drones', 'Toy Guns', 'Party Supplies',
                    'School Supplies', 'School Bags', 'School Combo Sets', 'Lunch Box'],
            },
            {
                items: ['Baby Care', 'Diapers', 'Wipes', 'Diapering & Potty Training', 'Baby Bath, Hair & Skin Care', 'Baby Grooming', 'Baby Bathing Accessories', 'Baby Gift Sets & Combo', 'Baby Oral Care', 'Nursing & Breast Feeding', 'Baby Food', 'Baby Feeding Bottle & Accessories', 'Baby Feeding Utensils & Accessories', 'Baby Bedding', 'Baby Gear', 'Baby Medical & Health Care', 'Baby Proofing & Safety', 'Baby Cleaners & Detergents'],
            },
            {
                heading: 'Featured brands',
                items: ['Mee & Chee', 'Barbie', 'Disney', 'United Colors of Benetton', "The Children's Place", 'US Polo', 'Flying Machine', 'Crocs', 'Puma', 'Funblast', 'Lego', 'Luvlap', 'Mamy Poko', 'Mee Mee'],
            },
        ],
    },
    {
        label: 'Home & Furniture', search: 'furniture',
        cols: [
            {
                items: ['Kitchen, Cookware & Serveware', 'Pans', 'Tawas', 'Pressure Cookers', 'Kitchen tools', 'Gas Stoves',
                    'Tableware & Dinnerware', 'Coffee Mugs', 'Dinner Set', 'Barware',
                    'Kitchen Storage', 'Water Bottles', 'Lunch Boxes', 'Flasks', 'Casseroles', 'Kitchen Containers',
                    'Cleaning Supplies'],
            },
            {
                items: ['Furniture Top Offers',
                    'Bed Room Furniture', 'Beds', 'Mattresses', 'Wardrobes',
                    'Living Room Furniture', 'Sofa', 'Sofa Beds', 'TV Units', 'Dining Tables & Chairs', 'Coffee Tables', 'Shoe Racks',
                    'Office & Study Furniture', 'Kids Room Furniture',
                    'DIY Furniture', 'Bean Bags', 'Collapsible Wardrobes'],
            },
            {
                items: ['Furnishing', 'Bedsheets', 'Curtains', 'Cushions & Pillows', 'Blankets', 'Bath Towels', 'Kitchen & Table Linen', 'Floor Coverings',
                    'Smart Home Automation', 'Smart Security System', 'Smart Door Locks',
                    'Home Improvement', 'Tools & Measuring Equipments', 'Home Utilities & Organizers', 'Lawn & Gardening', 'Bathroom & Kitchen Fittings'],
            },
            {
                items: ['Home Decor', 'Paintings', 'Clocks', 'Wall Shelves', 'Stickers', 'Showpieces & Figurines',
                    'Home Lighting', 'Bulbs', 'Wall Lamp', 'Table Lamp', 'Ceiling Lamp', 'Emergency Lights',
                    'Festive Decor & Gifts',
                    'Pet Supplies', 'Dogs', 'Cats', 'Fish & Aquatics'],
            },
            {
                heading: 'Durability Certified Furniture',
                items: ['Featured', 'Christmas Store', 'Mugs Store', 'Gardening Store', 'Stainless Steel Store', 'Milton', 'Bombay Dyeing', '@home', 'HomeTown', 'Ajanta', 'Spaces by Welspun', 'Prestige', 'Perfect Home Store'],
            },
        ],
    },
    {
        label: 'Sports, Books & More', search: 'sports-accessories',
        cols: [
            {
                items: ['Sports', 'Cricket', 'Badminton', 'Cycling', 'Football', 'Skating', 'Camping & Hiking', 'Swimming',
                    'Exercise Fitness', 'Cardio Equipment', 'Home Gyms', 'Support', 'Dumbbells', 'Ab Exercisers', 'Shakers & Sippers', 'Yoga Mat', 'Gym Gloves'],
            },
            {
                items: ['Food Essentials', 'Nuts & Dry Fruits', 'Tea, Coffee and Beverages', 'Chocolates', 'Snacks Corner', 'Gifting Combos', 'Sweets Store', 'Jams, Spreads and Honey', 'Breakfast Items',
                    'Health & Nutrition', 'All Supplements', 'Protein Supplements', 'Vitamin Supplements', 'Health Drinks', 'Ayurvedic Supplements'],
            },
            {
                items: ['Books', 'Entrance Exams', 'Academics', 'Literature & Fiction', 'Non-Fiction', 'Young Readers', 'Self-Help', 'E-Learning', 'Preorders', 'Indian Languages',
                    'Stationery', 'Pens', 'Diaries', 'Card Holders', 'Desk Organizers', 'Calculators', 'Key Chains'],
            },
            {
                items: ['Auto Accessories', 'Helmets & Riding Gears', 'Car Audio/Video', 'Car Mobile Accessories', 'Car & Bike Care', 'Vehicle Lubricants',
                    'Industrial & Scientific tools', 'Industrial Measurement Devices', 'Industrial Testing Devices', 'Lab & Scientific Products', 'Packaging & Shipping Products', 'Safety Products',
                    'Medical Supplies', 'Pregnancy and Fertility Kits', 'Hot Water Bag'],
            },
            {
                items: ['Music', 'Musical Instruments', 'Music', 'Movies & TV shows',
                    'Gaming', 'Gaming Consoles', 'Gaming Accessories', 'PS4 Games', 'Smart Glasses (VR)',
                    'Grocery (Only in Select Cities)'],
            },
        ],
    },
    {
        label: 'Flights', search: '',
        cols: [
            { heading: 'Travel', items: ['Domestic Flights', 'International Flights', 'Hotel Booking', 'Holiday Packages'] },
            { heading: 'Transport', items: ['Bus Tickets', 'Train Tickets', 'Cab Booking', 'Car Rentals'] },
            { heading: 'Experiences', items: ['Adventure Sports', 'City Tours', 'Cruises', 'Weekend Getaways'] },
        ],
    },
    {
        label: 'Offer Zone', search: '',
        cols: [
            { heading: 'Best Deals', items: ["Today's Deals", 'Flash Sale', 'Clearance Sale', 'Combo Offers'] },
            { heading: 'Bank Offers', items: ['HDFC Bank Offers', 'SBI Card Offers', 'ICICI Bank Offers', 'Axis Bank Offers'] },
            { heading: 'Special Offers', items: ['Exchange Offers', 'No Cost EMI', 'Cashback Offers', 'Referral Offers'] },
        ],
    },
];

export default function Navbar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isClassic = true; // Use classic blue navbar everywhere it's rendered
    const [searchQuery, setSearchQuery] = useState('');
    const [loginOpen, setLoginOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [hoveredCat, setHoveredCat] = useState<string | null>(null);
    const loginRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);
    const catTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) setLoginOpen(false);
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => { dispatch(logout()); setLoginOpen(false); };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : '/');
    };

    const onCatEnter = (label: string) => {
        if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
        setHoveredCat(label);
    };
    const onCatLeave = () => {
        catTimeoutRef.current = setTimeout(() => setHoveredCat(null), 120);
    };

    const activeCat = CATEGORIES.find(c => c.label === hoveredCat);

    return (
        <>
            <nav className={isClassic ? "bg-[#2874f0] sticky top-0 z-50" : "bg-white sticky top-0 z-50 border-b border-gray-200"}>
                {/* ── Row 1: Top bar ── */}
                <div className="max-w-screen-xl mx-auto px-4 flex items-center h-14 gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center mr-2">
                        {isClassic ? (
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" alt="Flipkart" className="h-5 object-contain" />
                        ) : (
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="Flipkart" className="h-10 object-contain" />
                        )}
                    </Link>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
                        <div className={`flex items-center overflow-hidden h-9 px-2 transition-colors ${isClassic ? 'bg-white rounded-sm shadow-sm' : 'bg-[#f0f5ff] rounded-md h-10 focus-within:bg-[#e0eaff]'}`}>
                            {!isClassic && (
                                <button type="submit" className="text-gray-500 hover:text-[#2874f0] p-1.5 ml-1">
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search for products, brands and more"
                                className={`flex-1 bg-transparent text-[14px] py-2 px-3 focus:outline-none ${isClassic ? 'text-black placeholder-gray-500' : 'text-gray-800 placeholder-gray-500'}`}
                            />
                            {isClassic && (
                                <button type="submit" className="text-[#2874f0] p-1.5 ml-1 font-bold">
                                    <Search className="w-5 h-5" strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Right items */}
                    <div className="flex items-center gap-7 flex-shrink-0">

                        {/* Login dropdown */}
                        <div className="relative flex-shrink-0 group" ref={loginRef} onMouseEnter={() => { setLoginOpen(true); setMoreOpen(false); }} onMouseLeave={() => setLoginOpen(false)}>
                            <button type="button"
                                onClick={() => { setLoginOpen(p => !p); setMoreOpen(false); }}
                                className={isClassic 
                                    ? `bg-white text-[#2874f0] font-medium text-[15px] px-10 py-[6px] rounded-sm transition-colors shadow-sm` 
                                    : `flex items-center gap-2 font-medium text-[16px] px-3 py-2 rounded-lg transition-colors ${loginOpen ? 'bg-[#2874f0] text-white' : 'text-gray-800 hover:bg-[#2874f0] hover:text-white'}`}>
                                {!isClassic && (
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                )}
                                <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
                                {!isClassic && (
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                                )}
                            </button>
                            {loginOpen && (
                                <div className="absolute right-0 top-[calc(100%+8px)] w-[280px] bg-white rounded-md shadow-xl text-gray-700 z-50 border border-gray-100">
                                    {/* Triangle pointer */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                                    
                                    {/* Header: Login link and Sign Up */}
                                    {!user ? (
                                        <div className="px-5 py-4 border-b border-gray-100 relative z-10 bg-white rounded-t-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-[13px] text-gray-600 font-semibold">New customer?</div>
                                                <Link to="/register" onClick={() => setLoginOpen(false)}
                                                    className="text-[#2874f0] font-bold text-[13px] hover:underline">Sign Up</Link>
                                            </div>
                                            <Link to="/login" onClick={() => setLoginOpen(false)}
                                                className="flex justify-center items-center w-full bg-[#2874f0] text-white font-medium py-2.5 rounded-sm shadow-sm hover:bg-[#2874f0]/90 transition-colors">Login</Link>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                                            <span className="text-sm font-semibold text-gray-800 truncate">{user.name}</span>
                                            <button type="button" onClick={handleLogout}
                                                className="text-red-500 text-xs font-bold hover:underline ml-2 whitespace-nowrap">Logout</button>
                                        </div>
                                    )}

                                    {/* Menu items with blue icons */}
                                    <div className="py-2">
                                        {[
                                            {
                                                path: user ? '/profile' : '/login', label: 'My Profile',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                                            },
                                            {
                                                path: '/plus', label: 'Flipkart Plus Zone',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                            },
                                            {
                                                path: user ? '/orders' : '/login', label: 'Orders',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>
                                            },
                                            {
                                                path: '/wishlist', label: 'Wishlist',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                            },
                                            {
                                                path: '/seller/hub', label: 'Become a Seller',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                                            },
                                            {
                                                path: '/rewards', label: 'Rewards',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                                            },
                                            {
                                                path: '/gift-cards', label: 'Gift Cards',
                                                icon: <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2874f0]" fill="currentColor"><path d="M20 6h-2.18c.07-.23.18-.46.18-.71C18 3.47 16.53 2 14.71 2c-.87 0-1.66.36-2.24.93L12 3.4l-.47-.47C10.95 2.36 10.16 2 9.29 2 7.47 2 6 3.47 6 5.29c0 .25.11.48.18.71H4c-1.11 0-2 .89-2 2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5.29-2c.39 0 .71.32.71.71S15.1 5.42 14.71 5.42h-2.54c.38-.98 1.31-1.42 2.54-1.42zM9.29 4c1.23 0 2.16.44 2.54 1.42H9.29c-.39 0-.71-.32-.71-.71S8.9 4 9.29 4zM20 19H4v-2h16v2zm0-5H4V8h16v6z"/></svg>
                                            },
                                        ].map(item => (
                                            <Link key={item.label} to={item.path} onClick={() => setLoginOpen(false)}
                                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Become a Seller */}
                        <Link to="/seller/hub"
                            className={`hidden md:block font-medium text-[16px] transition whitespace-nowrap ${isClassic ? 'text-white hover:text-gray-200' : 'text-gray-800 hover:text-[#2874f0]'}`}>
                            Become a Seller
                        </Link>

                        {/* More dropdown */}
                        <div className="relative flex-shrink-0 hidden md:block group" ref={moreRef} onMouseEnter={() => { setMoreOpen(true); setLoginOpen(false); }} onMouseLeave={() => setMoreOpen(false)}>
                            <button type="button"
                                onClick={() => { setMoreOpen(p => !p); setLoginOpen(false); }}
                                className={`flex items-center gap-1 font-medium text-[16px] transition-colors ${isClassic ? 'text-white hover:text-gray-200' : (moreOpen ? 'text-[#2874f0]' : 'text-gray-800 hover:text-[#2874f0]')}`}>
                                More <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {moreOpen && (
                                <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-md shadow-xl z-50 border border-gray-100 py-1">
                                    {/* Triangle pointer */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                                    {MORE_MENU.map(item => (
                                        <Link key={item.label} to={item.path} onClick={() => setMoreOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 relative z-10 bg-white">
                                            <span>{item.icon}</span><span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to="/cart"
                            className={`flex-shrink-0 flex items-center gap-2 font-medium text-[16px] transition-colors relative ${isClassic ? 'text-white hover:text-gray-200' : 'text-gray-800 hover:text-[#2874f0]'}`}>
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
                </div>

                {/* ── Row 2: White category bar ── */}
                <div className="bg-white relative">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="flex items-center justify-between h-10">
                            {CATEGORIES.map(cat => (
                                <div
                                    key={cat.label}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => onCatEnter(cat.label)}
                                    onMouseLeave={onCatLeave}
                                >
                                    <button
                                        type="button"
                                        onClick={() => cat.search ? navigate(`/search?q=${encodeURIComponent(cat.search)}`) : undefined}
                                        className={`flex items-center gap-0.5 text-[13px] font-medium h-full px-1 border-b-2 transition-colors whitespace-nowrap ${
                                            hoveredCat === cat.label
                                                ? 'text-[#2874f0] border-[#2874f0]'
                                                : 'text-gray-700 border-transparent hover:text-[#2874f0]'
                                        }`}
                                    >
                                        {cat.label}
                                        <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Mega dropdown panel — full width ── */}
                    {hoveredCat && activeCat && (
                        <div
                            className="absolute left-0 right-0 top-full bg-white shadow-2xl z-50 border-t border-gray-200 max-h-[520px] overflow-y-auto"
                            onMouseEnter={() => onCatEnter(hoveredCat)}
                            onMouseLeave={onCatLeave}
                        >
                            <div className="max-w-screen-xl mx-auto px-6 py-5">
                                <div className="flex gap-6">
                                    {activeCat.cols.map((col, ci) => (
                                        <div key={ci} className="min-w-[160px] flex-1">
                                            {col.heading && (
                                                <p className="text-[12px] font-bold text-gray-900 mb-2 pb-1 border-b border-gray-200 uppercase tracking-wide">
                                                    {col.heading}
                                                </p>
                                            )}
                                            <ul className="space-y-0.5">
                                                {col.items.map((item, idx) => {
                                                    // Detect section headings: items followed by indented sub-items
                                                    // A heading is an item whose NEXT item is also in the list but is a sub-category
                                                    // Simple heuristic: if item has no spaces or is Title Case with no sub-prefix, treat as link
                                                    // We mark bold headings by checking if the item appears as a "group title" in the original data
                                                    const isSectionHead = idx < col.items.length - 1 &&
                                                        !col.items[idx].startsWith(' ') &&
                                                        col.items[idx + 1] !== undefined &&
                                                        col.items[idx].split(' ').length <= 5 &&
                                                        // Check if this looks like a category header (no lowercase start, not a product name)
                                                        /^[A-Z0-9'&]/.test(col.items[idx]) &&
                                                        col.items[idx + 1] !== '' &&
                                                        // Next item is indented or is a sub-item (shorter, no capitals at start of each word)
                                                        col.items.slice(idx + 1, idx + 4).some(next =>
                                                            next.split(' ').length <= 3 && /^[A-Z]/.test(next)
                                                        ) &&
                                                        // This item itself doesn't look like a product (no numbers, no special chars)
                                                        !/[0-9]/.test(col.items[idx]) &&
                                                        col.items[idx].length < 35;

                                                    return (
                                                        <li key={item + idx}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigate(`/search?q=${encodeURIComponent(item.toLowerCase())}`);
                                                                    setHoveredCat(null);
                                                                }}
                                                                className={`text-left w-full py-0.5 transition-colors ${
                                                                    isSectionHead
                                                                        ? 'text-[12px] font-bold text-gray-800 hover:text-[#2874f0] mt-2 block'
                                                                        : 'text-[12px] text-gray-600 hover:text-[#2874f0]'
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                {activeCat.search && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(`/search?q=${encodeURIComponent(activeCat.search)}`);
                                                setHoveredCat(null);
                                            }}
                                            className="text-[13px] text-[#2874f0] font-semibold hover:underline"
                                        >
                                            View All in {activeCat.label} →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <DeliveryLocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />
        </>
    );
}
