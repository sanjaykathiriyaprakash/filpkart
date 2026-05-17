import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import SellerHub from './SellerHub';

export default function SellerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Password
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your username, phone, or email.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
            if (data.user.role !== 'seller' && data.user.role !== 'admin') {
                setError('This account does not have seller privileges.');
                setLoading(false);
                return;
            }
            dispatch(setCredentials({ user: data.user, token: data.access_token }));
            navigate('/seller');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid password or login credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Render Seller Hub Landing Page in background */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden blur-[4px] brightness-75">
                <SellerHub />
            </div>

            {/* Centered Modal Backdrop */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
                {/* Modal Container */}
                <div className="relative bg-white w-full max-w-[460px] rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col p-8 sm:p-10 animate-scale-up">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            {step === 2 && (
                                <button 
                                    onClick={() => setStep(1)} 
                                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Login</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/seller/hub')} 
                            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold mb-6">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Username / Email / Phone */}
                    {step === 1 ? (
                        <form onSubmit={handleNext} className="space-y-6 flex-grow flex flex-col justify-between">
                            <div className="space-y-5">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Username or phone number or email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 outline-none text-base transition-all font-medium placeholder-gray-400 shadow-sm"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-[#2874f0]/20 hover:bg-[#2874f0] text-[#2874f0] hover:text-white font-extrabold py-4 rounded-xl shadow-md transition-all duration-300 text-base"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Step 2: Password Input */
                        <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
                            <div className="space-y-5">
                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700 truncate mr-2">{email}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)} 
                                        className="text-[#2874f0] font-bold text-xs hover:underline uppercase tracking-wide"
                                    >
                                        Change
                                    </button>
                                </div>

                                <div className="relative">
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 outline-none text-base transition-all font-medium placeholder-gray-400 shadow-sm pr-12"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-[#2874f0] text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-75 text-base flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Bottom CTA Block */}
                    <div className="mt-8 text-center space-y-4">
                        <span className="block text-gray-500 text-sm font-semibold">Don't have an account?</span>
                        <Link 
                            to="/seller/register"
                            className="inline-block w-full text-center border-2 border-[#2874f0] text-[#2874f0] font-extrabold py-3.5 rounded-xl hover:bg-blue-50 transition-all text-sm uppercase tracking-wider"
                        >
                            Register for new account
                        </Link>
                    </div>

                    {/* Disclaimer Footer */}
                    <div className="mt-8 text-[11px] text-gray-400 text-center leading-relaxed font-semibold">
                        <p>
                            By continuing, you agree to Flipkart's{' '}
                            <a href="#" className="text-gray-500 hover:underline">Terms of Use</a> &{' '}
                            <a href="#" className="text-gray-500 hover:underline">Privacy Policy</a>
                        </p>
                        <p className="mt-1 text-gray-300 font-medium">
                            Site protected by reCAPTCHA & Google{' '}
                            <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a> .{' '}
                            <a href="#" className="text-gray-400 hover:underline">Terms</a> apply
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
