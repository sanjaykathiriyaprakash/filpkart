import React from 'react';

export default function DownloadApp() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-12 min-h-[70vh] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 max-w-xl">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    Shop Anytime, Anywhere with the Flipkart App
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Get early access to exclusive sales, app-only discounts, and a seamless personalized shopping experience. Millions of products, right in your pocket.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-white p-4 border border-gray-200 rounded-md shadow-sm inline-flex">
                    <div className="w-24 h-24 bg-gray-100 border border-gray-300 rounded flex items-center justify-center p-2 relative overflow-hidden">
                        {/* Placeholder QR code pattern */}
                        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 opacity-60">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={`bg-gray-800 ${Math.random() > 0.5 ? 'rounded-sm' : ''}`}></div>
                            ))}
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white p-0.5 rounded-sm">
                            <div className="w-full h-full bg-[#2874f0] rounded-sm"></div>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 text-lg mb-1">Scan to Download</div>
                        <div className="text-sm text-gray-500">Available on iOS & Android</div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="bg-black text-white px-6 py-3 rounded-md flex items-center gap-3 hover:bg-gray-800 transition">
                        <span className="text-2xl">🍎</span>
                        <div className="text-left">
                            <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                            <div className="font-bold leading-none">App Store</div>
                        </div>
                    </button>
                    <button className="bg-black text-white px-6 py-3 rounded-md flex items-center gap-3 hover:bg-gray-800 transition">
                        <span className="text-2xl">▶️</span>
                        <div className="text-left">
                            <div className="text-[10px] uppercase tracking-wider opacity-80">Get it on</div>
                            <div className="font-bold leading-none">Google Play</div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex justify-center relative w-full">
                {/* Abstract phone mockup */}
                <div className="relative w-[280px] h-[580px] bg-black rounded-[40px] border-[8px] border-gray-800 shadow-2xl overflow-hidden z-10">
                    <div className="absolute top-0 w-full h-6 bg-black z-20 flex justify-center">
                        <div className="w-32 h-4 bg-black rounded-b-xl"></div>
                    </div>
                    {/* Screen content mockup */}
                    <div className="bg-[#f1f3f6] w-full h-full pt-8 flex flex-col">
                        <div className="bg-[#2874f0] p-4 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-yellow-400 rounded-sm"></div>
                                <div className="font-bold italic">Flipkart</div>
                            </div>
                            <div className="bg-white rounded h-8 w-full opacity-90"></div>
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-3">
                            <div className="bg-blue-200 h-24 rounded-md"></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white h-32 rounded-md shadow-sm border border-gray-200"></div>
                                <div className="bg-white h-32 rounded-md shadow-sm border border-gray-200"></div>
                                <div className="bg-white h-32 rounded-md shadow-sm border border-gray-200"></div>
                                <div className="bg-white h-32 rounded-md shadow-sm border border-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Background blobs */}
                <div className="absolute top-10 -right-10 w-64 h-64 bg-[#2874f0]/20 rounded-full blur-[50px]"></div>
                <div className="absolute bottom-10 -left-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-[50px]"></div>
            </div>
        </div>
    );
}
