import React, { useState } from 'react';

export default function Notifications() {
    const [settings, setSettings] = useState({
        orderUpdates: true,
        promotions: false,
        reminders: true,
        priceDrops: true,
        sms: false,
        email: true,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleSwitch = ({ label, desc, settingKey }: { label: string, desc: string, settingKey: keyof typeof settings }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="pr-4">
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-sm text-gray-500 mt-0.5">{desc}</div>
            </div>
            <button 
                onClick={() => toggle(settingKey)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings[settingKey] ? 'bg-[#2874f0]' : 'bg-gray-200'}`}
            >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings[settingKey] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-[70vh]">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h1>
            
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">
                    Push Notifications (App & Web)
                </div>
                <div className="px-6 py-2">
                    <ToggleSwitch label="Order Updates" desc="Get real-time tracking updates for your shipments, delivery alerts, and return status." settingKey="orderUpdates" />
                    <ToggleSwitch label="Promotional Offers" desc="Be the first to know about Big Billion Days, special sales, and personalized deals." settingKey="promotions" />
                    <ToggleSwitch label="Reminders" desc="Get reminded about items left in your cart or wishlist." settingKey="reminders" />
                    <ToggleSwitch label="Price Drops" desc="Alerts when prices drop for items in your wishlist or cart." settingKey="priceDrops" />
                </div>
            </div>

            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">
                    Communication Channels
                </div>
                <div className="px-6 py-2">
                    <ToggleSwitch label="SMS Notifications" desc="Receive important alerts like OTPs and delivery status via SMS." settingKey="sms" />
                    <ToggleSwitch label="Email Newsletters" desc="Receive detailed receipts, newsletters, and promotional emails." settingKey="email" />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button className="bg-[#2874f0] text-white font-bold px-8 py-2.5 rounded shadow hover:bg-blue-600 transition">
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
