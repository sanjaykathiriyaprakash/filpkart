import React from 'react';

export default function GiftCards() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8 min-h-[70vh]">
            {/* Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md p-10 text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="relative z-10 w-2/3">
                    <h1 className="text-4xl font-black mb-3">Flipkart Gift Cards</h1>
                    <p className="text-lg opacity-90 mb-6">The perfect gift for every occasion. Let them choose what they love from millions of products.</p>
                    <button className="bg-white text-purple-600 font-bold px-8 py-3 rounded shadow hover:bg-gray-50 transition">
                        Buy a Gift Card
                    </button>
                </div>
                {/* Decorative element */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current"><circle cx="50" cy="50" r="50"/></svg>
                </div>
            </div>

            {/* Categories */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Occasion</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { name: 'Happy Birthday', color: 'bg-pink-100 border-pink-200 text-pink-700', icon: '🎂' },
                    { name: 'Anniversary', color: 'bg-red-100 border-red-200 text-red-700', icon: '❤️' },
                    { name: 'Congratulations', color: 'bg-green-100 border-green-200 text-green-700', icon: '🎉' },
                    { name: 'Corporate Gifting', color: 'bg-blue-100 border-blue-200 text-blue-700', icon: '🏢' },
                ].map((cat, i) => (
                    <div key={i} className={`border rounded-md p-6 text-center cursor-pointer hover:shadow-md transition-shadow ${cat.color}`}>
                        <div className="text-4xl mb-3">{cat.icon}</div>
                        <div className="font-bold">{cat.name}</div>
                    </div>
                ))}
            </div>

            {/* FAQ or Info */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">How to use a Flipkart Gift Card?</h3>
                <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-sm">
                    <li>Go to Flipkart.com and select the items you want to purchase.</li>
                    <li>Proceed to checkout and enter your shipping details.</li>
                    <li>In the payment options, select 'Gift Card' and enter your 16-digit Gift Card number and 6-digit PIN.</li>
                    <li>If your order value exceeds the gift card amount, you can pay the balance using other payment methods.</li>
                </ol>
            </div>
        </div>
    );
}
