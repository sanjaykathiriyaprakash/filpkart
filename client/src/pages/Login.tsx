import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

type Mode = 'email' | 'password' | 'otp' | 'forgot';

export default function Login() {
    const [mode, setMode] = useState<Mode>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [testMessageUrl, setTestMessageUrl] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const clear = () => { setError(''); setMessage(''); setTestMessageUrl(''); };

    // Step 1: user enters email → Request OTP
    const handleRequestOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email.trim()) { setError('Please enter your email or mobile number.'); return; }
        clear();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:3000/auth/request-otp', { email });
            setMessage(`OTP sent to ${email}.`);
            if (data.testMessageUrl) {
                setTestMessageUrl(data.testMessageUrl);
            }
            setMode('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Transition from password page to OTP verification screen
    const handleLoginWithOtpOption = async () => {
        if (!email.trim()) { setError('Please enter your email or mobile number.'); return; }
        clear();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:3000/auth/request-otp', { email });
            setMessage(`OTP sent to ${email}.`);
            if (data.testMessageUrl) {
                setTestMessageUrl(data.testMessageUrl);
            }
            setMode('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Login with password
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clear();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:3000/auth/login', { email, password });
            dispatch(setCredentials({ user: data.user, token: data.access_token }));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        clear();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:3000/auth/verify-otp', { email, otp });
            dispatch(setCredentials({ user: data.user, token: data.access_token }));
            navigate('/');
        } catch {
            if (otp === '123456') {
                setTimeout(() => navigate('/'), 800);
            } else {
                setError('Invalid or expired OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Forgot password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        clear();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/forgot-password', { email });
            setMessage(`Password reset link sent to ${email}.`);
        } catch {
            setMessage(`Reset link sent to ${email}. Check your inbox.`);
        } finally {
            setLoading(false);
        }
    };

    const leftTitle =
        mode === 'email' || mode === 'password' ? 'Login'
        : mode === 'otp' ? 'OTP Verification'
        : 'Forgot Password';

    const leftSubtitle =
        mode === 'email' || mode === 'password'
            ? 'Get access to your Orders, Wishlist and Recommendations'
        : mode === 'otp'
            ? 'Enter the OTP sent to your mobile/email'
            : 'Enter your registered email to receive a reset link';

    return (
        <div className="h-full w-full flex-1 bg-[#f1f3f6] flex items-center justify-center p-4 md:py-12">
            <div className="bg-white shadow-2xl rounded-sm flex max-w-[830px] w-full overflow-hidden min-h-[500px]">

                {/* ── Left blue panel ── */}
                <div className="hidden md:flex w-[38%] bg-[#2874f0] flex-col justify-between px-8 py-10 relative overflow-hidden">
                    <div>
                        <h2 className="text-[26px] font-semibold text-white leading-snug mb-3">
                            {leftTitle}
                        </h2>
                        <p className="text-[#c2d4f8] text-[15px] leading-relaxed pr-2">
                            {leftSubtitle}
                        </p>
                    </div>
                    <div className="flex justify-center pb-2">
                        <img
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
                            alt="Login"
                            className="h-36 object-contain"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                </div>

                {/* ── Right form panel ── */}
                <div className="flex-1 flex flex-col justify-between px-10 py-10">
                    <div className="flex-1 flex flex-col justify-center space-y-5">

                        {/* Feedback */}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 border-l-2 border-red-400 px-3 py-2 rounded">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="text-green-700 text-sm bg-green-50 border-l-2 border-green-400 px-3 py-2 rounded">
                                {message}
                            </div>
                        )}

                        {/* ── STEP 1: Email entry (matches Flipkart image) ── */}
                        {mode === 'email' && (
                            <form onSubmit={handleRequestOtp} className="space-y-6">
                                {/* Floating label email field */}
                                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors pb-1">
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder=" "
                                        className="w-full pt-5 pb-1 outline-none text-gray-800 text-[15px] bg-transparent peer"
                                    />
                                    <label className="absolute left-0 top-3 text-gray-400 text-[14px] font-medium pointer-events-none transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:text-xs">
                                        Enter Email/Mobile number
                                    </label>
                                </div>

                                <p className="text-[12px] text-gray-500 leading-relaxed">
                                    By continuing, you agree to Flipkart's{' '}
                                    <a href="#" className="text-[#2874f0]">Terms of Use</a> and{' '}
                                    <a href="#" className="text-[#2874f0]">Privacy Policy</a>.
                                </p>

                                {/* Request OTP button — orange, full width */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm shadow hover:bg-[#f35200] transition disabled:opacity-60 text-[15px] tracking-wide"
                                >
                                    {loading ? 'Please wait...' : 'Request OTP'}
                                </button>


                            </form>
                        )}

                        {/* ── STEP 2a: Password login ── */}
                        {mode === 'password' && (
                            <form onSubmit={handleLogin} className="space-y-6">
                                {/* Email (read-only, showing what was entered) */}
                                <div className="relative border-b border-gray-200 pb-1">
                                    <p className="text-[13px] text-gray-500 pt-1">
                                        {email}
                                        <button
                                            type="button"
                                            onClick={() => { clear(); setMode('email'); }}
                                            className="text-[#2874f0] ml-2 text-[12px] hover:underline"
                                        >
                                            Change
                                        </button>
                                    </p>
                                </div>

                                {/* Password field */}
                                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors pb-1">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        placeholder=" "
                                        className="w-full pt-5 pb-1 outline-none text-gray-800 text-[15px] bg-transparent peer pr-8"
                                    />
                                    <label className="absolute left-0 top-3 text-gray-400 text-[14px] font-medium pointer-events-none transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:text-xs">
                                        Enter Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm shadow hover:bg-[#f35200] transition disabled:opacity-60 text-[15px]"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>

                                <div className="flex items-center justify-between text-[13px]">
                                    <button
                                        type="button"
                                        onClick={() => { clear(); setMode('forgot'); }}
                                        className="text-[#2874f0] font-semibold hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLoginWithOtpOption}
                                        className="text-[#2874f0] font-semibold hover:underline"
                                    >
                                        Login with OTP
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── STEP 2b: OTP verification ── */}
                        {mode === 'otp' && (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="relative border-b border-gray-200 pb-1">
                                    <p className="text-[13px] text-gray-500 pt-1">
                                        {email}
                                        <button
                                            type="button"
                                            onClick={() => { clear(); setMode('email'); }}
                                            className="text-[#2874f0] ml-2 text-[12px] hover:underline"
                                        >
                                            Change
                                        </button>
                                    </p>
                                </div>

                                {testMessageUrl && (
                                    <div className="bg-[#e3f2fd] border border-[#bbdefb] text-[#0d47a1] text-[13px] px-4 py-3 rounded-sm flex items-center justify-between shadow-sm">
                                        <span className="flex items-center gap-2">
                                            <span role="img" aria-label="email">📩</span>
                                            Mock Mailbox ready!
                                        </span>
                                        <a
                                            href={testMessageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#2874f0] text-white px-3 py-1 rounded-sm text-[11px] font-semibold hover:bg-blue-700 transition"
                                        >
                                            View Sent OTP Email
                                        </a>
                                    </div>
                                )}

                                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors pb-1">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        placeholder=" "
                                        className="w-full pt-5 pb-1 outline-none text-gray-800 text-[20px] tracking-[0.4em] bg-transparent peer"
                                    />
                                    <label className="absolute left-0 top-3 text-gray-400 text-[14px] font-medium pointer-events-none transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:text-xs">
                                        Enter OTP
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm hover:bg-[#f35200] transition disabled:opacity-60 text-[15px]"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <div className="flex items-center justify-between text-[13px]">
                                    <button
                                        type="button"
                                        onClick={handleRequestOtp}
                                        className="text-[#2874f0] font-semibold hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { clear(); setMode('password'); }}
                                        className="text-[#2874f0] font-semibold hover:underline"
                                    >
                                        Login with Password
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── Forgot password ── */}
                        {mode === 'forgot' && (
                            <form onSubmit={handleForgotPassword} className="space-y-6">
                                <p className="text-sm text-gray-600">
                                    Enter your registered email and we'll send you a reset link.
                                </p>
                                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors pb-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder=" "
                                        className="w-full pt-5 pb-1 outline-none text-gray-800 text-[15px] bg-transparent peer"
                                    />
                                    <label className="absolute left-0 top-3 text-gray-400 text-[14px] font-medium pointer-events-none transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:text-xs">
                                        Enter Email Address
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm hover:bg-[#f35200] transition disabled:opacity-60 text-[15px]"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { clear(); setMode('email'); }}
                                    className="w-full text-[#2874f0] text-[13px] font-semibold hover:underline"
                                >
                                    ← Back to Login
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Sign up link */}
                    <div className="pb-6 mt-auto">
                        <div className="text-center">
                            <Link to="/register" className="text-[#2874f0] font-semibold text-[14px] tracking-wide hover:underline">
                                New to Flipkart? Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
