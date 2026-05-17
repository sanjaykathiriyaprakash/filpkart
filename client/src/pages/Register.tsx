import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/register', { name, email, password });
            navigate('/login');
        } catch (err: any) {
            setError('Registration failed. Email might already exist.');
        }
    };

    return (
        <div className="h-full w-full flex-1 bg-[#f1f3f6] flex items-center justify-center p-4 md:py-12">
            <div className="bg-white shadow-2xl rounded-sm flex max-w-4xl w-full overflow-hidden min-h-[500px]">

                <div className="w-2/5 bg-[#2874f0] p-10 flex flex-col justify-between hidden md:flex text-white">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Looks like you're new here!</h2>
                        <p className="text-blue-100 text-lg leading-relaxed">Sign up with your mobile number to get started</p>
                    </div>
                    <div className="mt-auto flex justify-center">
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Register Graphic" className="h-32 object-contain" />
                    </div>
                </div>

                <div className="w-full md:w-3/5 p-10 flex flex-col justify-center relative">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && <div className="text-red-500 text-sm font-semibold mb-4">{error}</div>}

                        <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full py-2 outline-none peer text-gray-800 bg-transparent"
                                placeholder=" "
                                required
                            />
                            <label className="absolute left-0 bottom-2 text-gray-400 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#2874f0] transition-all duration-200 pointer-events-none peer-valid:-translate-y-6 peer-valid:text-xs font-medium">Enter Full Name</label>
                        </div>

                        <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-2 outline-none peer text-gray-800 bg-transparent"
                                placeholder=" "
                                required
                            />
                            <label className="absolute left-0 bottom-2 text-gray-400 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#2874f0] transition-all duration-200 pointer-events-none peer-valid:-translate-y-6 peer-valid:text-xs font-medium">Enter Email ID</label>
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
                            <label className="absolute left-0 bottom-2 text-gray-400 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#2874f0] transition-all duration-200 pointer-events-none peer-valid:-translate-y-6 peer-valid:text-xs font-medium">Create Password</label>
                        </div>

                        <button type="submit" className="w-full bg-[#fb641b] hover:bg-[#f35200] text-white font-semibold py-3 px-4 rounded-sm shadow-md hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-0.5">
                            Continue
                        </button>
                        <button type="button" className="w-full bg-white text-gray-600 border border-gray-300 font-semibold py-3 px-4 rounded-sm mt-3 hover:translate-y-0.5 shadow transition-all duration-200">
                            Existing User? Log in
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        <Link to="/login" className="hover:text-[#2874f0] transition-colors font-medium">Return to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
