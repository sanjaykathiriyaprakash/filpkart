import React from 'react';

export default function Rewards() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8 min-h-[70vh]">
            {/* Header section */}
            <div className="bg-[#2874f0] rounded-t-md p-6 text-white flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">SuperCoin Rewards</h1>
                    <p className="text-sm opacity-90">Use your coins to claim exclusive offers and discounts.</p>
                </div>
                <div className="bg-white text-[#2874f0] px-6 py-3 rounded-md shadow-md text-center">
                    <div className="text-xs font-bold uppercase tracking-wide">Coin Balance</div>
                    <div className="text-3xl font-black flex items-center justify-center gap-1 mt-1">
                        <span className="text-yellow-500">🪙</span> 145
                    </div>
                </div>
            </div>

            {/* Content section */}
            <div className="bg-white p-6 shadow-sm rounded-b-md">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Available Rewards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: '₹500 Off on Flights', coins: 50, category: 'Travel' },
                        { title: '1 Month Premium Subscription', coins: 100, category: 'Entertainment' },
                        { title: '10% Extra Discount on Fashion', coins: 20, category: 'Shopping' },
                        { title: 'Free Delivery for 1 Month', coins: 150, category: 'Benefits' },
                        { title: '₹200 Gift Voucher', coins: 200, category: 'Vouchers' },
                        { title: 'Buy 1 Get 1 Movie Ticket', coins: 75, category: 'Entertainment' },
                    ].map((reward, i) => (
                        <div key={i} className="border border-gray-200 rounded-md p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <span className="text-xs font-bold text-[#2874f0] bg-blue-50 px-2 py-1 rounded-sm mb-3 inline-block">
                                    {reward.category}
                                </span>
                                <h3 className="font-semibold text-gray-800 leading-snug mb-2">{reward.title}</h3>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="font-bold text-gray-600 flex items-center gap-1 text-sm">
                                    <span className="text-yellow-500">🪙</span> {reward.coins}
                                </span>
                                <button className="bg-[#2874f0] text-white text-xs font-bold px-4 py-2 rounded shadow hover:bg-blue-600 transition">
                                    Claim
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
