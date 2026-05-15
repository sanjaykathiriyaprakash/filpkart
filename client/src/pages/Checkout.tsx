import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { RootState } from '../store/store';
import { clearCart } from '../store/slices/cartSlice';
import { ShieldCheck, CreditCard, MapPin, Package, ChevronRight } from 'lucide-react';

const API = 'http://localhost:3000';

// Dummy test card hint (mirrors Stripe test cards)
const TEST_CARDS = [
    { label: 'Visa (Success)', number: '4242 4242 4242 4242' },
    { label: 'Mastercard (Success)', number: '5555 5555 5555 4444' },
    { label: 'Card Declined', number: '4000 0000 0000 0002' },
];

type Step = 'address' | 'payment' | 'processing' | 'success';

export default function Checkout() {
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>('address');
    const [address, setAddress] = useState({ line1: '', city: '', state: '', pincode: '', phone: '' });
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [orderId, setOrderId] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [trackingNo, setTrackingNo] = useState('');
    const [invoiceId, setInvoiceId] = useState('');
    const [error, setError] = useState('');
    const [processingMsg, setProcessingMsg] = useState('');

    const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * 82 * i.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 5000 ? 0 : 499;
    const total = subtotal + tax + shipping;

    if (items.length === 0 && step !== 'success') {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center gap-4">
                <Package className="w-16 h-16 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="bg-[#2874f0] text-white px-6 py-2 rounded">Continue Shopping</button>
            </div>
        );
    }

    const handleAddressNext = () => {
        if (!address.line1 || !address.city || !address.pincode || !address.phone) {
            setError('Please fill all delivery address fields.'); return;
        }
        if (!/^\d{6}$/.test(address.pincode)) { setError('Enter a valid 6-digit PIN code.'); return; }
        if (!/^\d{10}$/.test(address.phone)) { setError('Enter a valid 10-digit phone number.'); return; }
        setError('');
        setStep('payment');
    };

    const handlePayment = async () => {
        if (!card.number || !card.expiry || !card.cvv || !card.name) {
            setError('Please fill all card details.'); return;
        }
        setError('');
        setStep('processing');

        try {
            setProcessingMsg('Creating your order...');
            // 1. Create order
            const { data: orderData } = await axios.post(`${API}/orders`, {
                products: items,
                totalAmount: total,
                shippingAddress: address,
                paymentStatus: 'PENDING',
            });
            setOrderId(orderData.id);
            setTrackingNo(orderData.trackingNumber);
            setInvoiceId(orderData.invoiceId);

            setProcessingMsg('Initialising payment...');
            // 2. Create PaymentIntent
            const { data: intentData } = await axios.post(`${API}/payments/create-intent`, {
                orderId: orderData.id,
                userId: 'guest',
            });

            setProcessingMsg('Processing payment...');
            // 3. Confirm payment (simulate with dummy paymentMethodId)
            await axios.post(`${API}/payments/confirm`, {
                paymentId: intentData.paymentId,
                paymentMethodId: `pm_test_${Date.now()}`,
            });
            setPaymentId(intentData.paymentId);

            dispatch(clearCart());
            setStep('success');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Payment failed. Please try again.');
            setStep('payment');
        }
    };

    const downloadInvoice = async () => {
        try {
            const { data } = await axios.get(`${API}/payments/${paymentId}/invoice`);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${data.invoiceId}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert('Could not download invoice. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-8">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ─── Left: Steps ─── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Step Breadcrumb */}
                    <div className="bg-white rounded-sm shadow-sm p-4 flex items-center gap-2 text-sm font-semibold">
                        <span className={step === 'address' ? 'text-[#2874f0]' : 'text-green-600'}>📍 Address</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className={step === 'payment' || step === 'processing' ? 'text-[#2874f0]' : step === 'success' ? 'text-green-600' : 'text-gray-400'}>💳 Payment</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className={step === 'success' ? 'text-green-600' : 'text-gray-400'}>✅ Confirmation</span>
                    </div>

                    {/* ── Address Step ── */}
                    {step === 'address' && (
                        <div className="bg-white rounded-sm shadow-sm p-6">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#2874f0]">
                                <MapPin className="w-5 h-5" /> Delivery Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Address Line 1 *</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                        placeholder="House no., Street, Area"
                                        value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">City *</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                        placeholder="City"
                                        value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">State</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                        placeholder="State"
                                        value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">PIN Code *</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                        placeholder="6-digit PIN" maxLength={6}
                                        value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Phone *</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                        placeholder="10-digit mobile" maxLength={10}
                                        value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                            <div className="flex justify-end mt-6">
                                <button onClick={handleAddressNext}
                                    className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-bold hover:bg-[#f35200] transition">
                                    DELIVER HERE <ChevronRight className="inline w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Payment Step ── */}
                    {step === 'payment' && (
                        <div className="bg-white rounded-sm shadow-sm p-6">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-[#2874f0]">
                                <CreditCard className="w-5 h-5" /> Payment Details
                            </h2>

                            {/* Test card hints */}
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-5 text-xs">
                                <p className="font-bold text-blue-700 mb-1">🧪 Test Mode — Use test card numbers:</p>
                                {TEST_CARDS.map(tc => (
                                    <p key={tc.label} className="text-blue-600">
                                        <span className="font-medium">{tc.label}:</span> {tc.number} | Exp: 12/28 | CVV: 123
                                    </p>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Cardholder Name *</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                        placeholder="Name on card"
                                        value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Card Number *</label>
                                    <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0] font-mono tracking-widest"
                                        placeholder="4242 4242 4242 4242" maxLength={19}
                                        value={card.number}
                                        onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Expiry (MM/YY) *</label>
                                        <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                            placeholder="MM/YY" maxLength={5}
                                            value={card.expiry}
                                            onChange={e => {
                                                let v = e.target.value.replace(/\D/g, '');
                                                if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                                setCard({ ...card, expiry: v });
                                            }} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">CVV *</label>
                                        <input className="w-full border rounded-sm p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                                            placeholder="•••" maxLength={4} type="password"
                                            value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Secured by Stripe · 256-bit SSL Encryption
                            </div>

                            <div className="flex justify-between mt-6">
                                <button onClick={() => setStep('address')} className="text-[#2874f0] text-sm underline">← Change Address</button>
                                <button onClick={handlePayment}
                                    className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-bold hover:bg-[#f35200] transition">
                                    PAY ₹{total.toFixed(0)}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Processing Step ── */}
                    {step === 'processing' && (
                        <div className="bg-white rounded-sm shadow-sm p-10 flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#2874f0]" />
                            <p className="text-gray-700 font-semibold text-lg">{processingMsg || 'Processing your payment...'}</p>
                            <p className="text-gray-400 text-sm">Please do not close this window</p>
                        </div>
                    )}

                    {/* ── Success Step ── */}
                    {step === 'success' && (
                        <div className="bg-white rounded-sm shadow-sm p-10 text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
                            <p className="text-gray-500 mb-4">Thank you for shopping with Flipkart</p>

                            <div className="bg-gray-50 rounded p-4 mb-6 text-sm text-left space-y-2 max-w-sm mx-auto">
                                <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono font-bold">{orderId.slice(0, 8)}…</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Invoice ID</span><span className="font-mono font-bold">{invoiceId}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Tracking No.</span><span className="font-mono font-bold">{trackingNo}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Estimated Delivery</span><span className="font-bold">3–5 business days</span></div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button onClick={downloadInvoice}
                                    className="flex items-center justify-center gap-2 border border-[#2874f0] text-[#2874f0] px-6 py-2.5 rounded-sm font-semibold hover:bg-blue-50 transition">
                                    ⬇️ Download Invoice
                                </button>
                                <button onClick={() => navigate('/')}
                                    className="bg-[#fb641b] text-white px-6 py-2.5 rounded-sm font-semibold hover:bg-[#f35200] transition">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Right: Order Summary sidebar ─── */}
                {step !== 'success' && (
                    <div className="bg-white rounded-sm shadow-sm p-5 h-fit sticky top-20">
                        <h3 className="text-base font-bold mb-4 border-b pb-2">Price Details</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between"><span>Price ({items.length} items)</span><span>₹{subtotal.toFixed(0)}</span></div>
                            <div className="flex justify-between text-gray-400"><span>Discount</span><span className="text-green-600">- ₹0</span></div>
                            <div className="flex justify-between"><span>Tax (18%)</span><span>₹{tax.toFixed(0)}</span></div>
                            <div className="flex justify-between"><span>Delivery Charges</span>
                                <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-base mt-4 pt-3 border-t text-gray-900">
                            <span>Total Amount</span>
                            <span>₹{total.toFixed(0)}</span>
                        </div>
                        {shipping === 0 && <p className="text-green-600 text-xs mt-2 font-semibold">🎉 You qualify for FREE delivery!</p>}

                        <div className="mt-4 border-t pt-3">
                            <p className="text-xs font-bold text-gray-500 mb-2">ITEMS IN ORDER ({items.length})</p>
                            <div className="space-y-2">
                                {items.slice(0, 3).map(item => (
                                    <div key={item.product.id} className="flex items-center gap-2">
                                        <img src={item.product.images?.[0] || item.product.thumbnail} alt={item.product.title} className="w-10 h-10 object-contain rounded border" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate">{item.product.title}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity} · ₹{Math.floor(Number(item.product.price) * 82)}</p>
                                        </div>
                                    </div>
                                ))}
                                {items.length > 3 && <p className="text-xs text-[#2874f0]">+{items.length - 3} more items</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
