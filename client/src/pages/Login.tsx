import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            dispatch(setCredentials({ user: response.data.user, token: response.data.access_token }));
            navigate('/');
        } catch (err: any) {
            setError('Invalid credentials or server error.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-sm flex max-w-4xl w-full overflow-hidden min-h-[500px]">

                <div className="w-2/5 bg-[#2874f0] p-10 flex flex-col justify-between hidden md:flex text-white relative overflow-hidden">
                    <div className="z-10">
                        <h2 className="text-3xl font-bold mb-4">Login</h2>
                        <p className="text-blue-100 text-lg leading-relaxed">Get access to your Orders, Wishlist and Recommendations</p>
                    </div>
                    <div className="z-10 mt-auto flex justify-center">
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login Graphic" className="h-32 object-contain" />
                    </div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full md:w-3/5 p-10 flex flex-col justify-center relative">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && <div className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-2 border-l-2 border-red-500">{error}</div>}
                        <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-2 outline-none peer text-gray-800 bg-transparent"
                                placeholder=" "
                                required
                            />
                            <label className="absolute left-0 bottom-2 text-gray-400 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#2874f0] transition-all duration-200 pointer-events-none peer-valid:-translate-y-6 peer-valid:text-xs font-medium">Enter Email / Mobile number</label>
                        </div>

                        <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-2 outline-none peer text-gray-800 bg-transparent"
                                placeholder=" "
                                required
                            />
                            <label className="absolute left-0 bottom-2 text-gray-400 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#2874f0] transition-all duration-200 pointer-events-none peer-valid:-translate-y-6 peer-valid:text-xs font-medium">Enter Password</label>
                            <div className="absolute right-0 bottom-2 text-[#2874f0] text-sm font-semibold hover:text-[#f0c14b] cursor-pointer cursor-pointer transition-colors">Forgot?</div>
                        </div>

                        <p className="text-xs text-gray-400">By continuing, you agree to Flipkart's <a className="text-[#2874f0]">Terms of Use</a> and <a className="text-[#2874f0]">Privacy Policy</a>.</p>

                        <button type="submit" className="w-full bg-[#fb641b] hover:bg-[#f35200] text-white font-semibold py-3 px-4 rounded-sm shadow-md hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-0.5">
                            Login
                        </button>
                        <div className="flex items-center justify-center space-x-2 my-4">
                            <div className="h-px bg-gray-300 w-1/4"></div>
                            <span className="text-gray-400 text-sm">OR</span>
                            <div className="h-px bg-gray-300 w-1/4"></div>
                        </div>
                        <button type="button" className="w-full bg-white text-[#2874f0] border border-gray-300 font-semibold py-3 px-4 rounded-sm hover:-translate-y-0.5 shadow hover:shadow-md transition-all duration-200">
                            Request OTP
                        </button>
                    </form>

                    <div className="mt-auto pt-8 text-center">
                        <Link to="/register" className="text-[#2874f0] font-semibold text-sm hover:text-[#f0c14b] hover:underline underline-offset-4 transition-colors">New to Flipkart? Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
