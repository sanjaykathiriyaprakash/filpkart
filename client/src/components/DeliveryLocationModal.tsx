import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Search, MapPin } from 'lucide-react';
import { setDeliveryLocation } from '../store/slices/locationSlice';
import type { RootState } from '../store/store';
import { Link } from 'react-router-dom';

interface Props {
    open: boolean;
    onClose: () => void;
}

const POPULAR_LOCATIONS = [
    { pincode: '110001', city: 'New Delhi', state: 'Delhi' },
    { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '560001', city: 'Bengaluru', state: 'Karnataka' },
    { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu' },
    { pincode: '700001', city: 'Kolkata', state: 'West Bengal' },
    { pincode: '500001', city: 'Hyderabad', state: 'Telangana' },
    { pincode: '411001', city: 'Pune', state: 'Maharashtra' },
    { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '302001', city: 'Jaipur', state: 'Rajasthan' },
    { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh' },
];

export default function DeliveryLocationModal({ open, onClose }: Props) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [locating, setLocating] = useState(false);
    const [locError, setLocError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setSearchQuery('');
            setLocError('');
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [open]);

    const suggestions = searchQuery.trim().length >= 1
        ? POPULAR_LOCATIONS.filter(loc =>
            loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.pincode.includes(searchQuery)
        )
        : [];

    const selectLocation = (loc: { pincode: string; city: string; state: string }) => {
        dispatch(setDeliveryLocation({ pincode: loc.pincode, city: loc.city, state: loc.state }));
        onClose();
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocError('Geolocation is not supported by your browser.');
            return;
        }
        setLocating(true);
        setLocError('');
        navigator.geolocation.getCurrentPosition(
            () => {
                dispatch(setDeliveryLocation({ pincode: 'Current', city: 'Your Location', state: 'GPS' }));
                setLocating(false);
                onClose();
            },
            () => {
                setLocError('Location access denied. Please allow location access.');
                setLocating(false);
            },
            { timeout: 8000 }
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

            {/* Centered modal — matches the image exactly */}
            <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-[460px] z-10 mt-[60px] mr-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-[16px] font-semibold text-gray-900">Select delivery address</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 transition"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4">

                    {/* Search box */}
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-[#2874f0] transition-colors bg-white">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search by area, street name, pin code"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="flex-1 outline-none text-[14px] text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                        {searchQuery && (
                            <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Search suggestions */}
                    {suggestions.length > 0 && (
                        <div className="border border-gray-100 rounded-lg overflow-hidden">
                            {suggestions.map(loc => (
                                <button
                                    key={loc.pincode}
                                    type="button"
                                    onClick={() => selectLocation(loc)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-50 last:border-0"
                                >
                                    <MapPin className="w-4 h-4 text-[#2874f0] shrink-0" />
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-800">{loc.city}</p>
                                        <p className="text-[11px] text-gray-500">{loc.state} · {loc.pincode}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Use current location — GPS icon circle matching image */}
                    <button
                        type="button"
                        onClick={useCurrentLocation}
                        disabled={locating}
                        className="flex items-center gap-3 text-[#2874f0] font-semibold hover:text-blue-700 transition disabled:opacity-60 group w-full"
                    >
                        <span className="w-8 h-8 rounded-full border-2 border-[#2874f0] flex items-center justify-center group-hover:bg-blue-50 transition shrink-0">
                            {/* Crosshair / target icon */}
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#2874f0] stroke-[2]">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                                <circle cx="12" cy="12" r="7" />
                            </svg>
                        </span>
                        <span className="text-[14px]">
                            {locating ? 'Detecting location...' : 'Use my current location'}
                        </span>
                    </button>

                    {locError && <p className="text-red-500 text-xs pl-1">{locError}</p>}

                    {/* Dashed divider */}
                    <div className="border-t border-dashed border-gray-300" />

                    {/* Saved addresses */}
                    <div className="pb-2">
                        <p className="text-[13px] font-bold text-gray-800 mb-3">Saved addresses</p>

                        {user ? (
                            <div className="space-y-2">
                                <p className="text-[13px] text-gray-400 italic">No saved addresses yet.</p>
                                <Link
                                    to="/checkout"
                                    onClick={onClose}
                                    className="inline-block text-[13px] text-[#2874f0] font-semibold hover:underline"
                                >
                                    + Add a new address
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="flex items-center gap-3 text-[#2874f0] font-semibold hover:text-blue-700 transition group"
                            >
                                {/* User icon circle */}
                                <span className="w-8 h-8 rounded-full border-2 border-[#2874f0] flex items-center justify-center group-hover:bg-blue-50 transition shrink-0">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#2874f0] stroke-[2]">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    </svg>
                                </span>
                                <span className="text-[14px]">Login to see saved addresses</span>
                            </Link>
                        )}
                    </div>

                    {/* Popular cities chips */}
                    {!searchQuery && (
                        <div className="pb-1">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Popular cities</p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_LOCATIONS.slice(0, 6).map(loc => (
                                    <button
                                        key={loc.pincode}
                                        type="button"
                                        onClick={() => selectLocation(loc)}
                                        className="px-3 py-1.5 border border-gray-200 rounded-full text-[12px] text-gray-600 hover:border-[#2874f0] hover:text-[#2874f0] hover:bg-blue-50 transition-colors"
                                    >
                                        {loc.city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
