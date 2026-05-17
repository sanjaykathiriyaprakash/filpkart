import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { 
  Check, 
  ArrowRight, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  PhoneCall, 
  Grid, 
  DollarSign, 
  Truck,
  ArrowLeft
} from 'lucide-react';

export default function SellerRegister() {
    const [step, setStep] = useState(1); // 1: Email & Password, 2: Business Details
    const [form, setForm] = useState({
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        phone: '', 
        storeName: '', 
        gstNumber: ''
    });
    const [mobileOtpSent, setMobileOtpSent] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSendMobileOtp = () => {
        if (!form.phone.trim()) {
            setError('Please enter a mobile number first.');
            return;
        }
        setError('');
        setMobileOtpSent(true);
        alert(`🔒 Flipkart Verification: OTP code sent successfully to ${form.phone}!`);
    };

    const handleSendEmailOtp = () => {
        if (!form.email.trim()) {
            setError('Please enter an email address first.');
            return;
        }
        setError('');
        setEmailOtpSent(true);
        alert(`✉️ Flipkart Verification: OTP code sent successfully to ${form.email}!`);
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.phone || !form.email || !form.password || !form.confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); 
        setError('');
        try {
            const sellerName = form.name.trim() || 'Flipkart Seller';
            
            await axios.post(`${API_BASE}/auth/register-seller`, {
                name: sellerName,
                email: form.email,
                password: form.password,
                phone: form.phone,
                storeName: form.storeName,
                gstNumber: form.gstNumber,
                sellerProfile: { 
                    storeName: form.storeName, 
                    gstNumber: form.gstNumber 
                }
            });

            // Automatically login after registration
            const loginRes = await axios.post(`${API_BASE}/auth/login`, {
                email: form.email,
                password: form.password,
            });
            
            dispatch(setCredentials({ 
                user: loginRes.data.user, 
                token: loginRes.data.access_token 
            }));
            
            navigate('/seller');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please verify your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col antialiased">
            
            {/* Stepper Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Left: Dual Branding Logo Icons */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/seller/hub')}>
                        <div className="flex items-center gap-2">
                            {/* Flipkart box/star logo */}
                            <div className="bg-[#ffe500] text-black font-bold p-2.5 rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-[#2874f0] text-xl font-black">F</span>
                            </div>
                            {/* Shopsy logo */}
                            <div className="bg-[#2874f0] text-white font-bold p-2.5 rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-white text-xl font-black">S</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Stepper Timeline */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step === 1 ? 'bg-gray-800 text-white' : 'bg-emerald-500 text-white'}`}>
                                {step > 1 ? <Check className="w-3 h-3" /> : '1'}
                            </div>
                            <span className={`text-[11px] font-extrabold tracking-wide uppercase ${step === 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                                Email & Password
                            </span>
                        </div>
                        <div className="w-6 sm:w-12 h-[1px] bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step === 2 ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                2
                            </div>
                            <span className={`text-[11px] font-extrabold tracking-wide uppercase ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                                Business Details
                            </span>
                        </div>
                    </div>

                    {/* Placeholder on right to balance header alignment */}
                    <div className="hidden sm:block w-[72px]"></div>
                </div>
            </header>

            {/* Form & Sidebar Grid (Strict White Background) */}
            <main className="bg-white flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Form: sitting directly on white background */}
                    <div className="lg:col-span-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3.5 rounded-xl text-sm font-semibold">
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            /* STEP 1: Email & Password Form */
                            <form onSubmit={handleNextStep} className="space-y-6">
                                
                                {/* Mobile Number with nested Send OTP */}
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        required
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="Enter Mobile Number *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 pr-24 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleSendMobileOtp}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2874f0] hover:underline"
                                    >
                                        {mobileOtpSent ? 'Resend OTP' : 'Send OTP'}
                                    </button>
                                </div>

                                {/* Email ID with nested Send OTP */}
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        required
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        placeholder="Email ID *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 pr-24 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleSendEmailOtp}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2874f0] hover:underline"
                                    >
                                        {emailOtpSent ? 'Resend link' : 'Send OTP'}
                                    </button>
                                </div>

                                {/* Create Password */}
                                <div>
                                    <input 
                                        type="password" 
                                        required
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        placeholder="Create Password *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <input 
                                        type="password" 
                                        required
                                        value={form.confirmPassword}
                                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                        placeholder="Confirm Password *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm"
                                    />
                                </div>

                                <div className="pt-2 space-y-4">
                                    <p className="text-xs text-gray-500 font-medium">
                                        By continuing, I agree to Flipkart's{' '}
                                        <a href="#" className="text-[#2874f0] font-bold hover:underline">Terms of Use</a> &{' '}
                                        <a href="#" className="text-[#2874f0] font-bold hover:underline">Privacy Policy</a>
                                    </p>
                                    <button 
                                        type="submit"
                                        className="px-8 py-3.5 bg-[#2874f0] text-white font-extrabold rounded-lg hover:bg-blue-600 shadow-sm transition flex items-center justify-center gap-2 text-sm"
                                    >
                                        Register & Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* STEP 2: Business Details Form */
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex items-center gap-2 text-xs text-[#2874f0] font-bold cursor-pointer hover:underline mb-2" onClick={() => setStep(1)}>
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back to step 1
                                </div>

                                {/* Full Name */}
                                <div>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="Enter Full Name *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm"
                                    />
                                </div>

                                {/* Store Name */}
                                <div>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.storeName}
                                        onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
                                        placeholder="Store Name *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm"
                                    />
                                </div>

                                {/* GST Number */}
                                <div>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.gstNumber}
                                        onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))}
                                        placeholder="GST Number *"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-4 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all font-medium text-gray-800 shadow-sm uppercase"
                                    />
                                </div>

                                <div className="pt-2 space-y-4">
                                    <p className="text-xs text-gray-500 font-medium">
                                        Verify all business information is correct before submitting. Settlements will be routed to bank accounts matching the GST name.
                                    </p>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3.5 bg-emerald-600 text-white font-extrabold rounded-lg hover:bg-emerald-700 shadow-sm transition flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                                    >
                                        {loading ? 'Registering...' : 'Register & Start Selling'} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        <div className="pt-4 text-sm text-gray-500 font-semibold">
                            Already a seller?{' '}
                            <Link to="/seller/login" className="text-[#2874f0] hover:underline font-bold">
                                Login here
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Ads & Testimonials */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Testimonial Card */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
                            <img 
                                src="/images/raju_lunawath.png" 
                                alt="Raju Lunawath" 
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900 text-xs">Starting with 1, Flipkart helped me expand to 6 categories with 5x growth year on year!</h4>
                                <span className="block text-[10px] text-gray-500 font-bold mt-1">
                                    Raju Lunawath, Amazestore
                                </span>
                            </div>
                        </div>

                        {/* Ad Banner Card */}
                        <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                            <img 
                                src="/images/seller_ad_banner.png" 
                                alt="0% Commission Ad Banner" 
                                className="w-full object-cover"
                            />
                        </div>

                    </div>

                </div>
            </main>

            {/* Bottom: Why sell on Flipkart (Light blue-gray Background) */}
            <section className="py-16 bg-[#f4f7fa] border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight text-center mb-12">
                        Why sell on Flipkart?
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        {/* Benefit 1 */}
                        <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#2874f0]">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-gray-900">Sell Across India</h3>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                                Reach over 50 crore+ customers across 27,000+ dispatch pincodes seamlessly.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#2874f0]">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-gray-900">Higher Profits</h3>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                                With 0% commission*, you take 100% of your sales profits directly back with you.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#2874f0]">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-gray-900">Account Management</h3>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                                Our dedicated onboarding specialists will assist your business every step on Flipkart.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#2874f0]">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-gray-900">Lower Return Charges</h3>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                                With our flat, low return fee structure, dispatch goods across the country stress-free.
                            </p>
                        </div>

                    </div>
                    
                    {/* Secondary Benefit Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-gray-200/60 pt-10 mt-12">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <div className="bg-[#ffe500]/20 p-2 rounded-xl"><DollarSign className="w-4 h-4 text-gray-900" /></div>
                            <span className="text-xs font-bold text-gray-700">7-Day Fast Settlement Cycles</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <div className="bg-[#ffe500]/20 p-2 rounded-xl"><Grid className="w-4 h-4 text-gray-900" /></div>
                            <span className="text-xs font-bold text-gray-700">Single Click Product Cataloging</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <div className="bg-[#ffe500]/20 p-2 rounded-xl"><PhoneCall className="w-4 h-4 text-gray-900" /></div>
                            <span className="text-xs font-bold text-gray-700">24/7 Priority Seller Helpline Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-500 py-6 border-t border-gray-950 text-[10px] text-center">
                <p>© {new Date().getFullYear()} Flipkart Seller Hub. All rights reserved.</p>
            </footer>
        </div>
    );
}
