import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState<any[]>([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/wishlist');
                setWishlist(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWishlist();
    }, []);

    const handleRemove = async (id: string) => {
        await axios.delete(`http://localhost:3000/wishlist/${id}`);
        setWishlist(wishlist.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-8">
            <div className="max-w-5xl mx-auto bg-white p-6 shadow-sm rounded-sm">
                <h2 className="text-xl font-bold border-b pb-4 mb-4">My Wishlist ({wishlist.length})</h2>
                {wishlist.length === 0 ? (
                    <p className="text-gray-500 py-4">No items saved to wishlist.</p>
                ) : (
                    <div className="grid gap-4">
                        {wishlist.map(item => (
                            <div key={item.id} className="flex justify-between items-center border p-4 rounded hover:shadow-md transition-shadow">
                                <Link to={`/product/${item.product?.id || ''}`} className="flex space-x-4 flex-1">
                                    <img src={item.product?.images?.[0] || 'https://via.placeholder.com/100'} className="w-16 h-16 object-contain" alt="product" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.product?.title || 'Unknown Product'}</h3>
                                        <p className="text-green-600 font-bold mt-1">₹{item.product?.price || 0}</p>
                                    </div>
                                </Link>
                                <button onClick={() => handleRemove(item.id)} className="text-red-500 font-semibold hover:underline px-4">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
