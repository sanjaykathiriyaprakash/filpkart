import React from 'react';

export default function Advertise() {
    return (
        <div className="min-h-[70vh]">
            {/* Hero Section */}
            <div className="bg-[#2874f0] text-white py-16 px-4">
                <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Grow Your Business with Flipkart Ads</h1>
                        <p className="text-lg opacity-90 mb-8 max-w-lg">Reach millions of high-intent shoppers, increase your brand visibility, and drive exponential sales growth on India's leading e-commerce platform.</p>
                        <button className="bg-yellow-400 text-black font-bold px-8 py-3.5 rounded-sm shadow hover:bg-yellow-500 transition text-lg">
                            Start Advertising Now
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-end mb-4 border-b pb-4">
                                <div>
                                    <div className="text-gray-500 text-sm font-bold uppercase">Total Views</div>
                                    <div className="text-3xl font-black text-gray-800">452,890 <span className="text-green-500 text-sm">↑ 24%</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-sm font-bold uppercase">Sales</div>
                                    <div className="text-3xl font-black text-[#2874f0]">₹1.2M</div>
                                </div>
                            </div>
                            <div className="h-32 flex items-end gap-2">
                                {[30, 45, 25, 60, 80, 50, 90, 75, 100].map((h, i) => (
                                    <div key={i} className="flex-1 bg-blue-100 rounded-t overflow-hidden relative">
                                        <div className="absolute bottom-0 w-full bg-[#2874f0] rounded-t" style={{ height: `${h}%` }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-12">Why advertise on Flipkart?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Massive Reach', desc: 'Get your products in front of over 200 million registered users actively looking to buy.' },
                        { title: 'Targeted Campaigns', desc: 'Advanced targeting tools help you reach the right audience based on search and browsing behavior.' },
                        { title: 'Pay for Performance', desc: 'You only pay when a customer clicks on your ad, ensuring high ROI for your marketing budget.' },
                    ].map((feature, i) => (
                        <div key={i} className="text-center p-6 border border-gray-100 rounded-md shadow-sm hover:shadow-md transition bg-white">
                            <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                {i + 1}
                            </div>
                            <h3 className="font-bold text-xl text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
