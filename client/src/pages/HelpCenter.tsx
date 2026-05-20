import React from 'react';
import { Search, ChevronRight } from 'lucide-react';

export default function HelpCenter() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8 min-h-[70vh]">
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Flipkart Help Center</h1>
                <p className="text-gray-500 mb-6">How can we help you today?</p>
                <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden hover:border-[#2874f0] focus-within:border-[#2874f0] transition-colors shadow-sm">
                    <Search className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search for issues, orders, or topics"
                        className="flex-1 bg-transparent text-gray-800 py-3.5 px-3 focus:outline-none placeholder-gray-400"
                    />
                    <button className="bg-[#2874f0] text-white px-6 py-3.5 font-bold hover:bg-blue-600 transition">
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                    { icon: '📦', title: 'Help with my Orders', desc: 'Track, return, or cancel your recent orders' },
                    { icon: '💳', title: 'Payments & Refunds', desc: 'Issues with payment failures, EMI, and refund status' },
                    { icon: '👤', title: 'Account Settings', desc: 'Manage addresses, update profile, and password' },
                    { icon: '⭐', title: 'Flipkart Plus', desc: 'Know about benefits, SuperCoins, and membership' },
                    { icon: '🛡️', title: 'Security & Privacy', desc: 'Report suspicious activity, read policy documents' },
                    { icon: '📞', title: 'Contact Us', desc: 'Call us or request a callback for urgent issues' },
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-md p-6 hover:shadow-md transition cursor-pointer group">
                        <div className="text-3xl mb-3">{item.icon}</div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-[#2874f0] transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                        <div className="flex items-center text-[#2874f0] text-sm font-bold">
                            View details <ChevronRight className="w-4 h-4 ml-0.5" />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center text-sm text-gray-500 bg-white p-6 border border-gray-200 rounded-md max-w-5xl mx-auto">
                Still need help? Please check out our detailed <span className="text-[#2874f0] font-bold cursor-pointer hover:underline">FAQ section</span> or <span className="text-[#2874f0] font-bold cursor-pointer hover:underline">Contact Customer Support</span>.
            </div>
        </div>
    );
}
