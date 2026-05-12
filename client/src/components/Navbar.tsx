import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-[#2874f0] text-white shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="font-extrabold text-2xl italic tracking-tight">
                                Flipkart<span className="text-[#f0c14b] text-xl ml-1">Clone</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-lg mx-8 relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            className="w-full bg-white text-gray-800 rounded-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#f0c14b] shadow-inner transition-all duration-300"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        {!user ? (
                            <div className="flex space-x-4">
                                <Link to="/login" className="bg-white text-[#2874f0] font-semibold px-4 py-1 rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-200">
                                    Login
                                </Link>
                                <Link to="/register" className="font-semibold px-4 py-1 hover:text-[#f0c14b] transition-colors duration-200">
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="flex space-x-6 items-center">
                                <div className="flex items-center space-x-2 cursor-pointer group">
                                    <User className="w-5 h-5 group-hover:text-[#f0c14b] transition-colors" />
                                    <span className="font-medium group-hover:text-[#f0c14b] transition-colors">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <Link to="/cart" className="flex items-center hover:text-[#f0c14b] transition-colors duration-200 relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="font-semibold ml-1">Cart</span>
                            {items.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-md">
                                    {items.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
