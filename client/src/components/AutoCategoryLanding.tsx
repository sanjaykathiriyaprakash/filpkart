import { Link } from 'react-router-dom';

const AUTO_SUBCATEGORIES = [
    { label: 'Dashcams', search: 'dashcam', emoji: '📹' },
    { label: 'Helmets', search: 'helmet', emoji: '⛑️' },
    { label: 'Covers', search: 'cover', emoji: '🚗' },
    { label: 'Car washer', search: 'washer', emoji: '💦' },
    { label: 'Tyres', search: 'tyre', emoji: '🛞' },
    { label: 'Media player', search: 'player', emoji: '📻' },
    { label: 'Car mats', search: 'mats', emoji: '🧽' },
    { label: 'Engine oils', search: 'oil', emoji: '🛢️' },
    { label: 'Vacuum', search: 'vacuum', emoji: '🔌' },
    { label: 'Tool kit', search: 'tool', emoji: '🔧' },
    { label: 'Jump starter', search: 'starter', emoji: '🔋' },
    { label: 'Chargers', search: 'charger', emoji: '⚡' },
];

const AUTO_BANNERS = [
    {
        title: 'Helmets',
        subtitle: 'Min. 15% Off',
        desc: 'Sale is live!',
        bg: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
    },
    {
        title: 'Car polish & More',
        subtitle: 'From ₹160',
        desc: 'Sale is live!',
        bg: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
    },
    {
        title: 'Car mobile charger',
        subtitle: 'Up to 60% Off',
        desc: 'Sale is live!',
        bg: 'linear-gradient(135deg, #e65100 0%, #ef6c00 100%)',
    },
];

export default function AutoCategoryLanding() {
    return (
        <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {AUTO_BANNERS.map((b) => (
                    <div
                        key={b.title}
                        className="rounded-lg h-40 p-4 flex flex-col justify-between text-white relative overflow-hidden"
                        style={{ background: b.bg }}
                    >
                        <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded">
                            SASA LELE
                        </div>
                        <div>
                            <p className="text-xl font-black leading-tight">{b.title}</p>
                            <p className="text-yellow-300 font-bold">{b.subtitle}</p>
                            <p className="text-sm text-white/80">{b.desc}</p>
                        </div>
                        <div className="bg-white/95 text-[10px] text-gray-600 px-2 py-1.5 rounded flex items-center gap-2">
                            <span className="bg-[#1a4480] text-white font-black px-1.5 py-0.5 rounded text-[9px]">SBI</span>
                            card 10% Instant Discount*
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Shop by category</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {AUTO_SUBCATEGORIES.map((sub) => (
                        <Link
                            key={sub.label}
                            to={`/?search=${encodeURIComponent(sub.search)}`}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-sm hover:bg-[#f0f5ff] transition-colors group"
                        >
                            <span className="w-14 h-14 bg-[#fff8e1] border border-yellow-200 rounded-sm flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                                {sub.emoji}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">
                                {sub.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
