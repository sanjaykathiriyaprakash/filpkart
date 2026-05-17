import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, MapPin, Save, Lock, Package, Heart, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../lib/api';
import type { RootState } from '../store/store';
import { setCredentials } from '../store/slices/authSlice';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

interface Address {
    id: string;
    type: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

export default function Profile() {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    // Profile form
    const [profileForm, setProfileForm] = useState<UserProfile>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || ''
    });

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Addresses
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        type: 'HOME',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (activeTab === 'addresses') {
            fetchAddresses();
        }
    }, [activeTab]);

    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/user/addresses`, { headers });
            setAddresses(data);
        } catch (err) {
            console.error('Failed to fetch addresses');
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await axios.patch(`${API_BASE}/user/profile`, profileForm, { headers });
            dispatch(setCredentials({ user: { ...user, ...data }, token: token! }));
            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.patch(`${API_BASE}/user/change-password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, { headers });
            setSuccess('Password changed successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editingAddress) {
                await axios.patch(`${API_BASE}/user/addresses/${editingAddress.id}`, addressForm, { headers });
            } else {
                await axios.post(`${API_BASE}/user/addresses`, addressForm, { headers });
            }
            setSuccess('Address saved successfully');
            setShowAddressForm(false);
            setEditingAddress(null);
            setAddressForm({
                type: 'HOME',
                name: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                pincode: '',
                isDefault: false
            });
            fetchAddresses();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await axios.delete(`${API_BASE}/user/addresses/${id}`, { headers });
            setSuccess('Address deleted successfully');
            fetchAddresses();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete address');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Information', icon: User },
        { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
        { id: 'password', label: 'Change Password', icon: Lock },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'wishlist', label: 'My Wishlist', icon: Heart },
        { id: 'payments', label: 'Payment Methods', icon: CreditCard }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex">
                        {/* Sidebar */}
                        <div className="w-64 bg-gray-50 border-r border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-[#2874f0] rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <nav className="space-y-1">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-[#2874f0] text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6">
                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                                    {success}
                                </div>
                            )}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Profile Information Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                                    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.name}
                                                onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={profileForm.email}
                                                onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={profileForm.phone}
                                                onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-[#2874f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Change Password Tab */}
                            {activeTab === 'password' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
                                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-[#2874f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                                        >
                                            <Lock className="w-4 h-4" />
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Manage Addresses Tab */}
                            {activeTab === 'addresses' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-800">Manage Addresses</h2>
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="bg-[#2874f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Add New Address
                                        </button>
                                    </div>

                                    {showAddressForm && (
                                        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <h3 className="font-medium text-gray-800 mb-4">
                                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                                            </h3>
                                            <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                                    <select
                                                        value={addressForm.type}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, type: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                    >
                                                        <option value="HOME">Home</option>
                                                        <option value="WORK">Work</option>
                                                        <option value="OTHER">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.name}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={addressForm.phone}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.pincode}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.addressLine1}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, addressLine1: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.addressLine2}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, addressLine2: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.city}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.state}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isDefault"
                                                        checked={addressForm.isDefault}
                                                        onChange={e => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                                                        className="rounded border-gray-300 text-[#2874f0] focus:ring-[#2874f0]"
                                                    />
                                                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                                                        Make this my default address
                                                    </label>
                                                </div>
                                                <div className="col-span-2 flex gap-2">
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="bg-[#2874f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                    >
                                                        {loading ? 'Saving...' : 'Save Address'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowAddressForm(false);
                                                            setEditingAddress(null);
                                                        }}
                                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {addresses.map(address => (
                                            <div key={address.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                                {address.type}
                                                            </span>
                                                            {address.isDefault && (
                                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium text-gray-800">{address.name}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {address.addressLine1}
                                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {address.city}, {address.state} - {address.pincode}
                                                        </p>
                                                        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingAddress(address);
                                                                setAddressForm({
                                                                    type: address.type,
                                                                    name: address.name,
                                                                    phone: address.phone,
                                                                    addressLine1: address.addressLine1,
                                                                    addressLine2: address.addressLine2 || '',
                                                                    city: address.city,
                                                                    state: address.state,
                                                                    pincode: address.pincode,
                                                                    isDefault: address.isDefault
                                                                });
                                                                setShowAddressForm(true);
                                                            }}
                                                            className="text-[#2874f0] hover:underline text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="text-red-500 hover:underline text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {addresses.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                No addresses found. Add your first address to get started.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Other tabs redirect to existing pages */}
                            {activeTab === 'orders' && (
                                <div className="text-center py-8">
                                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">My Orders</h3>
                                    <p className="text-gray-600 mb-4">View and track your orders</p>
                                    <Link
                                        to="/orders"
                                        className="inline-flex items-center gap-2 bg-[#2874f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <Package className="w-4 h-4" />
                                        View Orders
                                    </Link>
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="text-center py-8">
                                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">My Wishlist</h3>
                                    <p className="text-gray-600 mb-4">Manage your saved items</p>
                                    <Link
                                        to="/wishlist"
                                        className="inline-flex items-center gap-2 bg-[#2874f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                        View Wishlist
                                    </Link>
                                </div>
                            )}

                            {activeTab === 'payments' && (
                                <div className="text-center py-8">
                                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Methods</h3>
                                    <p className="text-gray-600 mb-4">Manage your saved payment methods</p>
                                    <div className="text-sm text-gray-500">
                                        Payment methods will be managed during checkout
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}