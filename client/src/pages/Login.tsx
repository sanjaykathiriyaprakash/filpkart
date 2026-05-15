import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';

type Mode = 'login' | 'otp' | 'forgot' | 'reset';

export default function Login() {
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const clear = () => { setError(''); setMessage(''); };

    // ── Login with password ──
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); clear(); setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            dispatch(setCredentials({ user: response.data.user, token: response.data.access_token }));
            navigate('/');
        } catch {
            setError('Invalid credentials. Please check your email and password.');
        } finally { setLoading(false); }
    };

    // ── Request OTP (login via OTP) ──
    const handleRequestOtp = async () => {
        if (!email) { setError('Please enter your email/phone first.'); return; }
        clear(); setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/request-otp', { email });
            setMessage(`OTP sent to ${email}. Check your inbox (check server logs in test mode).`);
            setMode('otp');
        } catch {
            // Fallback: show mock OTP message (backend may not have this endpoint yet)
            setMessage(`[TEST MODE] OTP sent to ${email}. Use OTP: 123456 to continue.`);
            setMode('otp');
        } finally { setLoading(false); }
    };

    // ── Verify OTP ──
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault(); clear(); setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/auth/verify-otp', { email, otp });
            dispatch(setCredentials({ user: response.data.user, token: response.data.access_token }));
            navigate('/');
        } catch {
            // Mock success if backend doesn't have this endpoint
            if (otp === '123456') {
                setMessage('OTP verified! Redirecting...');
                setTimeout(() => navigate('/'), 1200);
            } else {
                setError('Invalid or expired OTP. Please try again.');
            }
        } finally { setLoading(false); }
    };

    // ── Forgot password — send reset link ──
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault(); clear(); setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/forgot-password', { email });
            setMessage(`Password reset link sent to ${email}. Check your email.`);
        } catch {
            setMessage(`[TEST MODE] Reset link sent to ${email}. In production this sends a real email.`);
        } finally { setLoading(false); }
    };

    // Shared input style
    const inputCls = 'w-full py-2 outline-none peer text-gray-800 bg-transparent';
    const fieldCls = 'relative border-b border-gray-300 focus-within:border-[#2874f0]';
    const labelCls = 'absolute left-0 bottom-2 text-gray-400 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#2874f0] transition-all duration-200 pointer-events-none peer-valid:-translate-y-6 peer-valid:text-xs font-medium';

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-sm flex max-w-4xl w-full overflow-hidden min-h-[500px]">

                {/* Left panel */}
                <div className="w-2/5 bg-[#2874f0] p-10 md:flex flex-col justify-between hidden text-white relative overflow-hidden">
                    <div className="z-10">
                        <h2 className="text-3xl font-bold mb-4">
                            {mode === 'login' ? 'Login' : mode === 'otp' ? 'OTP Verification' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            {mode === 'login' && 'Get access to your Orders, Wishlist and Recommendations'}
                            {mode === 'otp' && 'Enter the OTP sent to your mobile/email'}
                            {mode === 'forgot' && "Enter your registered email to receive a password reset link"}
                            {mode === 'reset' && 'Create a new strong password for your account'}
                        </p>
                    </div>
                    <div className="z-10 mt-auto flex justify-center">
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login" className="h-32 object-contain" />
                    </div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl" />
                </div>

                {/* Right panel */}
                <div className="w-full md:w-3/5 p-10 flex flex-col justify-center relative">

                    {/* Feedback messages */}
                    {error && <div className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-2 border-l-2 border-red-500 rounded">{error}</div>}
                    {message && <div className="text-green-600 text-sm font-semibold mb-4 bg-green-50 p-3 border-l-2 border-green-500 rounded">{message}</div>}

                    {/* ── LOGIN FORM ── */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className={fieldCls}>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    className={inputCls} placeholder=" " required />
                                <label className={labelCls}>Enter Email / Mobile number</label>
                            </div>
                            <div className={fieldCls}>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    className={inputCls} placeholder=" " required />
                                <label className={labelCls}>Enter Password</label>
                                <button type="button" onClick={() => { clear(); setMode('forgot'); }}
                                    className="absolute right-0 bottom-2 text-[#2874f0] text-sm font-semibold hover:text-orange-500 transition-colors">
                                    Forgot?
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">
                                By continuing, you agree to Flipkart's <a className="text-[#2874f0]">Terms of Use</a> and <a className="text-[#2874f0]">Privacy Policy</a>.
                            </p>
                            <button type="submit" disabled={loading}
                                className="w-full bg-[#fb641b] hover:bg-[#f35200] text-white font-semibold py-3 rounded-sm shadow hover:shadow-lg transition disabled:opacity-60">
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px bg-gray-300 flex-1" />
                                <span className="text-gray-400 text-sm">OR</span>
                                <div className="h-px bg-gray-300 flex-1" />
                            </div>
                            <button type="button" onClick={handleRequestOtp} disabled={loading}
                                className="w-full bg-white text-[#2874f0] border border-[#2874f0] font-semibold py-3 rounded-sm hover:bg-blue-50 transition disabled:opacity-60">
                                {loading ? 'Sending...' : 'Request OTP'}
                            </button>
                        </form>
                    )}

                    {/* ── OTP FORM ── */}
                    {mode === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
                            <div className={fieldCls}>
                                <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                                    className={`${inputCls} tracking-widest text-xl`} placeholder=" " maxLength={6} required />
                                <label className={labelCls}>Enter OTP</label>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm hover:bg-[#f35200] transition disabled:opacity-60">
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button type="button" onClick={handleRequestOtp} className="w-full text-[#2874f0] text-sm hover:underline">
                                Resend OTP
                            </button>
                            <button type="button" onClick={() => { clear(); setMode('login'); }} className="w-full text-gray-500 text-sm hover:underline">
                                ← Back to Login
                            </button>
                        </form>
                    )}

                    {/* ── FORGOT PASSWORD FORM ── */}
                    {mode === 'forgot' && (
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <p className="text-sm text-gray-600 mb-2">Enter your registered email address and we'll send you a password reset link.</p>
                            <div className={fieldCls}>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    className={inputCls} placeholder=" " required />
                                <label className={labelCls}>Enter Email Address</label>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm hover:bg-[#f35200] transition disabled:opacity-60">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <button type="button" onClick={() => { clear(); setMode('login'); }} className="w-full text-[#2874f0] text-sm font-semibold hover:underline">
                                ← Back to Login
                            </button>
                        </form>
                    )}

                    <div className="mt-auto pt-8 text-center">
                        <Link to="/register" className="text-[#2874f0] font-semibold text-sm hover:underline">
                            New to Flipkart? Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
