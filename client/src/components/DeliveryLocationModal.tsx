import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, MapPin, Search } from 'lucide-react';
import { setDeliveryLocation } from '../store/slices/locationSlice';
import type { DeliveryLocation } from '../store/slices/locationSlice';

const POPULAR_PINCODES: { pincode: string; city: string; state: string }[] = [
    { pincode: '560103', city: 'Bengaluru', state: 'Karnataka' },
    { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '110001', city: 'New Delhi', state: 'Delhi' },
    { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu' },
    { pincode: '700001', city: 'Kolkata', state: 'West Bengal' },
    { pincode: '500001', city: 'Hyderabad', state: 'Telangana' },
];

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function DeliveryLocationModal({ open, onClose }: Props) {
    const dispatch = useDispatch();
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');

    if (!open) return null;

    const save = (loc: DeliveryLocation) => {
        dispatch(setDeliveryLocation(loc));
        onClose();
        setPincode('');
        setError('');
    };

    const handlePincodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pin = pincode.replace(/\D/g, '');
        if (pin.length !== 6) {
            setError('Enter a valid 6-digit PIN code');
            return;
        }
        const match = POPULAR_PINCODES.find((p) => p.pincode === pin);
        save(match || { pincode: pin, city: 'Your Area', state: 'India' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
            <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-md z-10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-[#2874f0] text-white">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <h2 className="font-bold text-lg">Select delivery location</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded" aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handlePincodeSubmit} className="p-4 border-b">
                    <label className="text-sm font-semibold text-gray-700">Enter PIN Code</label>
                    <div className="flex mt-2 border border-gray-300 rounded-sm overflow-hidden focus-within:border-[#2874f0]">
                        <Search className="w-4 h-4 text-gray-400 ml-3 self-center" />
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="6-digit PIN code"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="flex-1 py-2.5 px-2 outline-none text-sm"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <button
                        type="submit"
                        className="w-full mt-3 bg-[#fb641b] text-white font-bold py-2.5 rounded-sm hover:bg-[#f35200] transition"
                    >
                        Submit
                    </button>
                </form>

                <div className="p-4 max-h-64 overflow-y-auto">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Popular locations</p>
                    <ul className="space-y-1">
                        {POPULAR_PINCODES.map((loc) => (
                            <li key={loc.pincode}>
                                <button
                                    type="button"
                                    onClick={() => save(loc)}
                                    className="w-full text-left px-3 py-2.5 rounded-sm hover:bg-[#f0f5ff] flex items-start gap-2 transition-colors"
                                >
                                    <MapPin className="w-4 h-4 text-[#2874f0] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-sm text-gray-800">{loc.city}</span>
                                        <span className="text-xs text-gray-500 block">
                                            {loc.state} — {loc.pincode}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
