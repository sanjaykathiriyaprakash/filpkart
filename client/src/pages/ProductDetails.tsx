import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import type { RootState } from '../store/store';
import { ShoppingCart, Zap, Star, Tag, MapPin } from 'lucide-react';
import { API_BASE } from '../lib/api';
import { formatInr } from '../lib/pricing';
import { parseVariants, getVariantByType } from '../lib/variants';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const dispatch = useDispatch();
    const delivery = useSelector((state: RootState) => state.location.delivery);

    const catName = (product?.category as { name?: string })?.name || '';
    const variants = useMemo(
        () => parseVariants(product?.variants, catName),
        [product, catName],
    );
    const colorVariant = getVariantByType(variants, 'color');
    const sizeVariant =
        getVariantByType(variants, 'size') ||
        getVariantByType(variants, 'storage') ||
        getVariantByType(variants, 'ram');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/products/${id}`);
                setProduct(data);
                const cat = (data.category as { name?: string })?.name || '';
                const v = parseVariants(data.variants, cat);
                const c = getVariantByType(v, 'color');
                const s =
                    getVariantByType(v, 'size') ||
                    getVariantByType(v, 'storage') ||
                    getVariantByType(v, 'ram');
                if (c?.options[0]) setSelectedColor(c.options[0]);
                if (s?.options[0]) setSelectedSize(s.options[0]);
            } catch (error) {
                console.error('Failed to load product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(
            addToCart({
                ...product,
                selectedVariant: { color: selectedColor, size: selectedSize },
            }),
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f1f3f6]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2874f0]" />
            </div>
        );
    }

    if (!product) return <div className="text-center p-12 text-xl font-semibold">Product not found.</div>;

    const brandName = (product.brand as { name?: string })?.name || product.brand || '';
    const images = product.images?.length ? product.images : [product.thumbnail];

    return (
        <div className="bg-[#f1f3f6] min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 bg-white p-6 shadow-sm rounded-sm flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/5 flex flex-col items-center">
                    <div className="flex w-full h-[400px] border border-gray-200 rounded p-4 relative">
                        <img
                            src={images[activeImg]}
                            alt={product.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex space-x-2 mt-4 overflow-x-auto w-full px-2 py-1">
                        {images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImg(idx)}
                                className={`w-16 h-16 border-2 flex-shrink-0 p-1 rounded-sm ${activeImg === idx ? 'border-[#2874f0]' : 'border-gray-200'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>

                    <div className="flex space-x-4 w-full mt-8">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#ff9f00] hover:bg-[#ff8f00] text-white py-4 font-bold text-lg rounded-sm flex justify-center items-center gap-2 shadow-lg"
                        >
                            <ShoppingCart className="w-5 h-5" /> ADD TO CART
                        </button>
                        <Link
                            to="/checkout"
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#fb641b] hover:bg-[#f35200] text-white py-4 font-bold text-lg rounded-sm flex justify-center items-center gap-2 shadow-lg text-center"
                        >
                            <Zap className="w-5 h-5" /> BUY NOW
                        </Link>
                    </div>
                </div>

                <div className="w-full md:w-3/5">
                    <div className="text-gray-500 text-sm font-semibold mb-1">{brandName}</div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug">{product.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded-sm font-bold">
                            {Number(product.rating).toFixed(1)} <Star className="w-3 h-3 fill-current" />
                        </span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900">{formatInr(product.price)}</span>
                        <span className="text-base text-gray-500 line-through font-semibold">
                            {formatInr(product.price * 1.25)}
                        </span>
                        <span className="text-sm font-bold text-green-600">20% off</span>
                    </div>

                    {colorVariant && (
                        <div className="mt-6">
                            <p className="text-sm font-semibold text-gray-700 mb-2">{colorVariant.name}</p>
                            <div className="flex flex-wrap gap-2">
                                {colorVariant.options.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setSelectedColor(c)}
                                        className={`text-sm px-3 py-1.5 border rounded-sm font-medium capitalize ${
                                            selectedColor === c
                                                ? 'border-[#2874f0] bg-[#2874f0] text-white'
                                                : 'border-gray-300 hover:border-[#2874f0]'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {sizeVariant && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">{sizeVariant.name}</p>
                            <div className="flex flex-wrap gap-2">
                                {sizeVariant.options.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSelectedSize(s)}
                                        className={`text-sm px-3 py-1.5 border rounded-sm font-medium ${
                                            selectedSize === s
                                                ? 'border-[#2874f0] bg-[#2874f0] text-white'
                                                : 'border-gray-300 hover:border-[#2874f0]'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 space-y-3 border-t border-b py-6 border-gray-100">
                        <h3 className="font-semibold text-gray-800 text-sm mb-3">Available Offers</h3>
                        <div className="flex items-start gap-2">
                            <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                                <span className="font-semibold">Bank Offer:</span> 5% Cashback on Flipkart Axis Bank Card
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-[100px_1fr] gap-y-4 text-sm">
                        <div className="text-gray-500 font-semibold">Delivery</div>
                        <div className="font-semibold text-gray-800">
                            {delivery ? (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-[#2874f0]" />
                                    {delivery.city}, {delivery.pincode} —{' '}
                                    <span className="text-green-600">Free delivery by Tomorrow</span>
                                </span>
                            ) : (
                                <span className="text-[#2874f0]">Select delivery location in header for accurate dates</span>
                            )}
                        </div>
                        <div className="text-gray-500 font-semibold">Description</div>
                        <div className="font-medium text-gray-800 leading-relaxed max-w-xl">{product.description}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
