import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, Zap, Star, Tag, ShieldCheck } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Failed to load product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f1f3f6]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2874f0]"></div>
            </div>
        );
    }

    if (!product) return <div className="text-center p-12 text-xl font-semibold">Product not found.</div>;

    return (
        <div className="bg-[#f1f3f6] min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 bg-white p-6 shadow-sm rounded-sm flex flex-col md:flex-row gap-8">

                {/* Left Side - Image Gallery & Action Buttons */}
                <div className="w-full md:w-2/5 flex flex-col items-center">
                    <div className="flex w-full h-[400px] border border-gray-200 rounded p-4 relative group group-hover:block transition-all">
                        <img src={product.images[activeImg]} alt={product.title} className="w-full h-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 right-2 p-2 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 shadow transition-colors">
                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                        </div>
                    </div>
                    <div className="flex space-x-2 mt-4 overflow-x-auto w-full px-2 py-1 scrollbar-hide">
                        {product.images.map((img: string, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => setActiveImg(idx)}
                                className={`w-16 h-16 border-2 flex-shrink-0 cursor-pointer overflow-hidden p-1 rounded-sm transition-all duration-200 hover:opacity-80 ${activeImg === idx ? 'border-[#2874f0]' : 'border-gray-200'}`}
                            >
                                <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>

                    <div className="flex space-x-4 w-full mt-8">
                        <button
                            onClick={() => dispatch(addToCart(product))}
                            className="flex-1 bg-[#ff9f00] hover:bg-[#ff8f00] text-white py-4 font-bold text-lg rounded-sm flex justify-center items-center space-x-2 shadow-lg transition-transform hover:-translate-y-0.5"
                        >
                            <ShoppingCart className="w-5 h-5" /> <span>ADD TO CART</span>
                        </button>
                        <button className="flex-1 bg-[#fb641b] hover:bg-[#f35200] text-white py-4 font-bold text-lg rounded-sm flex justify-center items-center space-x-2 shadow-lg transition-transform hover:-translate-y-0.5">
                            <Zap className="w-5 h-5" /> <span>BUY NOW</span>
                        </button>
                    </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="w-full md:w-3/5">
                    <div className="text-gray-500 text-sm font-semibold mb-1 hover:text-[#2874f0] cursor-pointer w-fit transition-colors">{product.brand}</div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug">{product.title}</h1>
                    <div className="flex items-center space-x-3 mt-2">
                        <span className="flex items-center space-x-1 bg-green-600 text-white text-xs px-2 py-1 rounded-sm font-bold shadow-sm">
                            <span>{product.rating}</span>
                            <Star className="w-3 h-3 fill-current" />
                        </span>
                        <span className="text-sm font-medium text-gray-500 cursor-pointer hover:underline">12,434 Ratings & 1,452 Reviews</span>
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="f-assured" className="h-5 ml-4" />
                    </div>

                    <div className="mt-4 flex items-baseline space-x-3">
                        <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-base text-gray-500 line-through font-semibold">₹{Math.floor(product.price * 1.25)}</span>
                        <span className="text-sm font-bold text-green-600">20% off</span>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-b py-6 border-gray-100">
                        <h3 className="font-semibold text-gray-800 text-sm mb-3">Available Offers</h3>
                        <div className="flex items-start space-x-2">
                            <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm"><span className="font-semibold">Bank Offer:</span> 5% Cashback on Flipkart Axis Bank Card <Link to="#" className="text-[#2874f0] font-semibold text-xs ml-1 hover:underline">T&C</Link></p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm"><span className="font-semibold">Special Price:</span> Get extra 10% off (price inclusive of cashback/coupon) <Link to="#" className="text-[#2874f0] font-semibold text-xs ml-1 hover:underline">T&C</Link></p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-[100px_1fr] gap-y-4 text-sm">
                        <div className="text-gray-500 font-semibold">Delivery</div>
                        <div className="font-semibold text-gray-800 flex items-start flex-col">
                            Free Delivery by <span className="text-green-600">Tomorrow</span>
                            <span className="text-xs text-gray-500 font-medium mt-1">If ordered within 2 hrs</span>
                        </div>

                        <div className="text-gray-500 font-semibold">Warranty</div>
                        <div className="font-medium text-gray-800 flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-gray-400" />
                            <span>1 Year Warranty offeeed by {product.brand}</span>
                        </div>

                        <div className="text-gray-500 font-semibold">Description</div>
                        <div className="font-medium text-gray-800 leading-relaxed max-w-xl">
                            {product.description}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
