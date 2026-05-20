import React from 'react';

export default function PlusZone() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8 min-h-[70vh]">
            <div className="bg-gradient-to-br from-[#0c1322] to-[#1c2c4c] rounded-md p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden relative">
                <div className="relative z-10 max-w-lg mb-8 md:mb-0">
                    <div className="inline-block bg-[#ff9f00] text-black font-black italic px-3 py-1 text-sm rounded mb-4">PLUS TIER</div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Welcome to Flipkart Plus</h1>
                    <p className="text-gray-300 mb-6 text-lg">A world of limitless possibilities awaits you. Enjoy free delivery, early access to sales, and earn SuperCoins on every purchase.</p>
                    <button className="bg-[#2874f0] text-white font-bold px-8 py-3 rounded hover:bg-blue-600 transition shadow-[0_0_15px_rgba(40,116,240,0.5)]">
                        Explore Benefits
                    </button>
                </div>
                <div className="relative z-10 flex gap-4">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg text-center w-32">
                        <div className="text-3xl mb-2">🚚</div>
                        <div className="font-bold text-sm">Free Delivery</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg text-center w-32 mt-8">
                        <div className="text-3xl mb-2">⭐</div>
                        <div className="font-bold text-sm">Early Access</div>
                    </div>
                </div>
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2874f0]/30 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center mt-12">How to earn and use SuperCoins?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                    { step: '1', title: 'Shop on Flipkart', desc: 'Earn 2 SuperCoins for every ₹100 spent on Flipkart.' },
                    { step: '2', title: 'Collect Coins', desc: 'Watch your coin balance grow as you continue shopping.' },
                    { step: '3', title: 'Claim Rewards', desc: 'Use coins to claim premium subscriptions, travel offers, and more.' },
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-md p-6 text-center relative pt-10">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#2874f0] text-white rounded-full flex items-center justify-center text-xl font-black border-4 border-[#f1f3f6]">
                            {item.step}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
