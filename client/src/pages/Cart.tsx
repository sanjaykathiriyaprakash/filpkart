import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();

    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] py-8 w-full flex justify-center items-center">
                <div className="bg-white shadow-md rounded-md p-10 max-w-4xl w-full mx-4 text-center">
                    <div className="w-full flex justify-center py-4">
                        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" className="w-48 h-auto mix-blend-multiply opacity-80" alt="empty cart" />
                    </div>
                    <h3 className="text-xl font-semibold mt-4 text-gray-800">Your cart is empty!</h3>
                    <p className="text-sm text-gray-500 mt-2">Add items to it now.</p>
                    <Link to="/" className="inline-block mt-6 px-12 py-3 bg-[#2874f0] hover:bg-[#1a5cbd] transition-colors text-white font-bold text-sm shadow-md rounded-sm">
                        Shop now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3 bg-white shadow-sm rounded-sm p-4">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">My Cart ({items.length})</h2>
                        <button onClick={() => dispatch(clearCart())} className="text-sm text-red-500 font-semibold hover:underline">Clear All</button>
                    </div>

                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6 group">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                    <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover rounded shadow-sm border border-gray-50 group-hover:shadow-md transition-shadow" />
                                </div>
                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#2874f0] line-clamp-2 transition-colors">{item.product.title}</h3>
                                    <div className="text-sm text-gray-500 mt-1">Seller: Appario Retail</div>
                                    <div className="mt-3 flex items-center space-x-3">
                                        <span className="text-2xl font-bold text-gray-900">₹{item.product.price}</span>
                                        <span className="text-sm text-gray-500 line-through">₹{Math.floor(item.product.price * 1.5)}</span>
                                        <span className="text-sm font-bold text-green-600 text-green-500">33% Off</span>
                                    </div>
                                    <div className="mt-4 flex items-center space-x-6">
                                        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded">
                                            <span className="px-2 text-sm text-gray-600 font-bold">Qty: {item.quantity}</span>
                                        </div>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.product.id))}
                                            className="text-gray-800 font-semibold hover:text-red-500 flex flex-items items-center space-x-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="bg-[#fb641b] text-white font-semibold py-3 px-12 rounded-sm shadow-md hover:bg-[#f35200] transition-colors transform hover:-translate-y-0.5">
                            PLACE ORDER
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 bg-white shadow-sm rounded-sm p-4 h-fit sticky top-24">
                    <h2 className="text-lg font-bold text-gray-500 uppercase border-b pb-4 mb-4 tracking-wider">Price Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-gray-800 font-medium">
                            <span>Price ({items.length} items)</span>
                            <span>₹{Math.floor(totalAmount * 1.5)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-800 font-medium">
                            <span>Discount</span>
                            <span className="text-green-500 font-semibold">- ₹{Math.floor(totalAmount * 0.5)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-800 font-medium">
                            <span>Delivery Charges</span>
                            <span className="text-green-500 font-semibold">Free</span>
                        </div>
                        <div className="border-t border-dashed pt-4 flex justify-between items-center text-xl font-bold text-gray-900">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t text-sm font-semibold text-green-600 text-center">
                        You will save ₹{Math.floor(totalAmount * 0.5)} on this order
                    </div>
                </div>
            </div>
        </div>
    );
}
