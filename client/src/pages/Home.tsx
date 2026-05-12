import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/products');
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f1f3f6]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2874f0]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-white p-4 shadow-sm rounded-sm border-l-4 border-[#2874f0]">
                    Best of Electronics & Appliances
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-md p-4 shadow-sm hover:shadow-2xl transition-all duration-300 group relative flex flex-col justify-between overflow-hidden transform hover:-translate-y-1">
                            <Link to={`/product/${product.id}`} className="block relative h-48 overflow-hidden rounded overflow-hidden">
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                />
                                {product.stock < 30 && (
                                    <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-sm">
                                        Only {product.stock} left!
                                    </span>
                                )}
                            </Link>

                            <div className="mt-4 flex-grow flex flex-col justify-between">
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-gray-800 font-semibold line-clamp-2 hover:text-[#2874f0] transition-colors">{product.title}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="inline-flex items-center text-xs text-white bg-green-600 px-1.5 py-0.5 rounded-sm font-bold">
                                            {product.rating} <Star className="w-3 h-3 ml-0.5 fill-current" />
                                        </span>
                                        <span className="text-gray-400 text-xs font-medium">({Math.floor(Math.random() * 500) + 10} Reviews)</span>
                                    </div>
                                    <div className="mt-2 flex items-baseline space-x-2">
                                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                        <span className="text-sm text-gray-500 line-through">₹{Math.floor(product.price * 1.4)}</span>
                                        <span className="text-xs font-bold text-green-600">28% off</span>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => dispatch(addToCart(product))}
                                    className="w-full mt-4 flex items-center justify-center space-x-2 bg-white text-gray-800 border border-gray-300 font-medium py-2 px-4 rounded hover:bg-[#ff9f00] hover:text-white hover:border-[#ff9f00] transition-colors duration-300 group-hover:shadow"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
