import { useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import { Handshake, Star, PhoneCall, X, CheckCircle, Package } from 'lucide-react';

interface PartnerService {
    id: string;
    title: string;
    description: string;
    price: string;
    rating: number;
    bookings: number;
    provider: string;
    icon: string;
}

export default function SellerPartners() {
    const [services] = useState<PartnerService[]>([
        {
            id: 'SRV-01',
            title: 'Professional Product Photography',
            description: 'Get pixel-perfect catalog photos of your products on pure white backgrounds, fully compliant with Flipkart guidelines.',
            price: '₹2,499 / 10 products',
            rating: 4.8,
            bookings: 1420,
            provider: 'StudioFlip Digital',
            icon: 'camera'
        },
        {
            id: 'SRV-02',
            title: 'Cataloging & Description Writing',
            description: 'Bulk listing uploads, custom product description writing, SEO tagging, and optimized category selection.',
            price: '₹1,500 / 50 SKU listings',
            rating: 4.7,
            bookings: 3120,
            provider: 'CatalogGenie Ltd',
            icon: 'list'
        },
        {
            id: 'SRV-03',
            title: 'CA tax & GST Compliance filing',
            description: 'Flipkart-certified chartered accountants to handle your GST registration, filing, returns reconciliation, and audits.',
            price: '₹999 / month',
            rating: 4.9,
            bookings: 890,
            provider: 'TaxBuddy CA Partners',
            icon: 'shield'
        },
        {
            id: 'SRV-04',
            title: 'Flipkart Co-Branded Packaging material',
            description: 'High-quality cardboard packaging boxes, bubbles, tape, and polybags featuring official Flipkart branding.',
            price: 'Starting at ₹250 / pack',
            rating: 4.6,
            bookings: 6720,
            provider: 'Flipkart Logistics Supplies',
            icon: 'package'
        }
    ]);

    const [selectedService, setSelectedService] = useState<PartnerService | null>(null);
    const [mobile, setMobile] = useState('');
    const [time, setTime] = useState('immediate');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleRequestCallback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(mobile)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setSelectedService(null);
            setMobile('');
        }, 3000);
    };

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-6xl mx-auto font-sans">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                        <Handshake className="w-5 h-5 text-[#2874f0]" /> Partner Services Directory
                    </h2>
                    <p className="text-xs font-medium text-gray-400 mt-1">Avail professional services certified by Flipkart. Elevate your photography, listing quality, and tax filings.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">
                                        {service.provider}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold">
                                        <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                                        <span>{service.rating}</span>
                                        <span className="text-gray-400 font-medium">({service.bookings} orders)</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-base">{service.title}</h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{service.description}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Service Charge</span>
                                    <span className="font-black text-gray-800 text-sm">{service.price}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="bg-blue-50 text-[#2874f0] hover:bg-[#2874f0] hover:text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <PhoneCall className="w-3.5 h-3.5" /> Book Service
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking Callback Modal */}
                {selectedService && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-150">
                            <div className="bg-[#2874f0] px-5 py-4 text-white flex items-center justify-between">
                                <h3 className="font-bold text-sm tracking-wide">Request Partner Service</h3>
                                <button onClick={() => setSelectedService(null)} className="text-white/80 hover:text-white cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {bookingSuccess ? (
                                <div className="p-8 text-center space-y-3">
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm">Callback Scheduled!</h4>
                                    <p className="text-xs text-gray-400 font-medium">A representative from <b>{selectedService.provider}</b> will call you at <b>+91 {mobile}</b> shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleRequestCallback} className="p-5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1">SELECTED SERVICE</label>
                                        <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{selectedService.title}</p>
                                                <p className="text-[10px] text-gray-400 font-semibold">{selectedService.provider} · {selectedService.price}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Your Mobile Number</label>
                                        <div className="flex bg-white border border-gray-200 rounded-lg items-center px-3 focus-within:border-[#2874f0]">
                                            <span className="text-sm font-bold text-gray-400 border-r border-gray-100 pr-2 mr-2">+91</span>
                                            <input
                                                type="tel"
                                                required
                                                maxLength={10}
                                                placeholder="Enter 10-digit number"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-white text-sm font-semibold text-gray-700 py-2 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Preferred Call Time</label>
                                        <select
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 px-3 py-2 outline-none focus:border-[#2874f0] transition-colors"
                                        >
                                            <option value="immediate">Call me within 15 mins</option>
                                            <option value="evening">Call me in the evening (4 PM - 7 PM)</option>
                                            <option value="morning">Call me tomorrow morning (10 AM - 12 PM)</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#fb641b] text-white hover:bg-[#e45a16] font-bold text-sm py-2 px-4 rounded-lg cursor-pointer transition-colors mt-2"
                                    >
                                        Request Callback
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
