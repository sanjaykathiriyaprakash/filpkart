import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { RootState } from '../store/store';
import { Package, Truck, Calendar, Download, Ban, ChevronDown, ChevronUp, MapPin, CheckCircle } from 'lucide-react';

const API = 'http://localhost:3000';

interface OrderItem {
    product: {
        id: string;
        title: string;
        price: number;
        images?: string[];
        thumbnail?: string;
        selectedVariant?: {
            size?: string;
            color?: string;
        };
    };
    quantity: number;
}

interface Order {
    id: string;
    products: OrderItem[];
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    trackingNumber: string;
    deliveryStatus: string;
    invoiceId: string;
    createdAt: string;
    shippingAddress?: {
        line1?: string;
        city?: string;
        state?: string;
        pincode?: string;
        phone?: string;
    };
}

export default function Orders() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${API}/orders?userId=${user.id}`);
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    const handleCancelOrder = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            const { data } = await axios.patch(`${API}/orders/${id}/cancel`);
            setOrders(orders.map(order => order.id === id ? { ...order, orderStatus: data.orderStatus } : order));
            alert('Order cancelled successfully.');
        } catch (err) {
            alert('Failed to cancel order.');
        }
    };

    const downloadInvoice = async (order: Order) => {
        const subtotal = order.products.reduce((sum, item) => sum + Number(item.product.price) * 82 * item.quantity, 0);
        const gst = subtotal * 0.18;
        const delivery = subtotal > 5000 ? 0 : 499;
        const total = subtotal + gst + delivery;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Popup blocked! Please allow popups to view printable invoices.');
            return;
        }

        const itemsHtml = order.products.map((item, idx) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${idx + 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: bold; color: #333;">${item.product.title}</div>
                    ${item.product.selectedVariant ? `
                        <div style="font-size: 11px; color: #666; margin-top: 4px;">
                            ${item.product.selectedVariant.color ? `Color: ${item.product.selectedVariant.color}` : ''}
                            ${item.product.selectedVariant.size ? ` Size: ${item.product.selectedVariant.size}` : ''}
                        </div>
                    ` : ''}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.product.price * 82).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.product.price * 82 * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${Number(item.product.price * 82 * 1.18 * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
            </tr>
        `).join('');

        const invoiceHtml = `
            <html>
            <head>
                <title>Invoice - ${order.invoiceId || 'Flipkart'}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 20px; line-height: 1.5; }
                    .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 14px; background: #fff; }
                    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: 800; color: #2874f0; font-style: italic; }
                    .invoice-title { font-size: 20px; font-weight: bold; text-align: right; text-transform: uppercase; color: #666; }
                    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .info-box { width: 50%; vertical-align: top; padding-right: 20px; }
                    .info-box-right { width: 50%; vertical-align: top; text-align: right; }
                    .bold { font-weight: bold; color: #111; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .items-table th { background: #f8f9fa; border-bottom: 2px solid #ddd; padding: 12px 10px; font-weight: bold; font-size: 12px; text-transform: uppercase; color: #555; }
                    .totals-table { width: 40%; margin-left: auto; border-collapse: collapse; font-size: 13px; }
                    .totals-table td { padding: 8px 10px; }
                    .grand-total { font-size: 16px; font-weight: 900; color: #2874f0; border-top: 2px solid #2874f0; }
                    .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
                    @media print {
                        body { padding: 0; }
                        .invoice-box { border: none; box-shadow: none; padding: 10px; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <table class="header-table">
                        <tr>
                            <td class="logo">Flipkart</td>
                            <td class="invoice-title">Tax Invoice / Bill of Supply</td>
                        </tr>
                    </table>

                    <table class="info-table">
                        <tr>
                            <td class="info-box">
                                <div class="bold" style="font-size: 15px; margin-bottom: 8px; color: #2874f0;">Sold By:</div>
                                <div class="bold">Flipkart E-Commerce Private Limited</div>
                                <div>Outer Ring Road, Devarabeesanahalli,</div>
                                <div>Bengaluru, Karnataka - 560103</div>
                                <div>GSTIN: 29AAFCC4581M1ZV</div>
                            </td>
                            <td class="info-box-right">
                                <div class="bold" style="font-size: 15px; margin-bottom: 8px; color: #2874f0;">Order Information:</div>
                                <div><span class="bold">Invoice ID:</span> ${order.invoiceId || 'INV-TEMP'}</div>
                                <div><span class="bold">Order ID:</span> ${order.id}</div>
                                <div><span class="bold">Order Date:</span> ${new Date(order.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                <div><span class="bold">Tracking ID:</span> ${order.trackingNumber || 'N/A'}</div>
                                <div><span class="bold">Payment Status:</span> <span style="color: green; font-weight: bold;">PAID</span></div>
                            </td>
                        </tr>
                    </table>

                    <table class="info-table" style="margin-bottom: 40px;">
                        <tr>
                            <td class="info-box" style="width: 100%;">
                                <div class="bold" style="font-size: 15px; margin-bottom: 8px; color: #2874f0;">Shipped & Billed To:</div>
                                <div class="bold">${order.shippingAddress?.phone ? 'Customer Delivery Address' : 'Guest Checkout'}</div>
                                <div>${order.shippingAddress?.line1 || 'N/A'}</div>
                                <div>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - <strong style="color: #333;">${order.shippingAddress?.pincode || ''}</strong></div>
                                <div style="margin-top: 4px;"><span class="bold">Contact Phone:</span> ${order.shippingAddress?.phone || 'N/A'}</div>
                            </td>
                        </tr>
                    </table>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 8%;">S.No</th>
                                <th style="text-align: left; width: 42%;">Description</th>
                                <th style="width: 10%;">Qty</th>
                                <th style="text-align: right; width: 13%;">Unit Price</th>
                                <th style="text-align: right; width: 12%;">GST (18%)</th>
                                <th style="text-align: right; width: 15%;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <table class="totals-table">
                        <tr>
                            <td class="bold">Items Subtotal:</td>
                            <td style="text-align: right;">₹${Number(subtotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        </tr>
                        <tr>
                            <td class="bold">GST Tax (18%):</td>
                            <td style="text-align: right;">₹${Number(gst).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        </tr>
                        <tr>
                            <td class="bold">Delivery Fee:</td>
                            <td style="text-align: right; color: ${delivery === 0 ? 'green' : '#333'}; font-weight: ${delivery === 0 ? 'bold' : 'normal'};">
                                ${delivery === 0 ? 'FREE' : `₹${delivery}`}
                            </td>
                        </tr>
                        <tr class="grand-total">
                            <td class="bold" style="color: #2874f0; padding-top: 12px;">Grand Total:</td>
                            <td style="text-align: right; padding-top: 12px; color: #2874f0;">₹${Number(total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        </tr>
                    </table>

                    <div class="footer">
                        <p style="margin-bottom: 8px;">Whether dynamic supply or consumer trade, thank you for shopping with Flipkart!</p>
                        <p>This is a computer-generated invoice and does not require any physical or digital signature.</p>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'CONFIRMED':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'PENDING':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStepIndex = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 0;
            case 'CONFIRMED':
                return 1;
            case 'SHIPPED':
                return 2;
            case 'DELIVERED':
                return 3;
            default:
                return -1;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2874f0]" />
                <p className="text-gray-500 font-semibold">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-8">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Heading */}
                <div className="flex items-center gap-3 mb-6 bg-white p-4 shadow-sm rounded-sm">
                    <div className="p-2.5 bg-blue-50 text-[#2874f0] rounded-full">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
                        <p className="text-xs text-gray-500">Track shipments, download invoices, and manage past purchases</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-sm shadow-sm p-12 text-center flex flex-col items-center gap-4">
                        <Truck className="w-16 h-16 text-gray-300 animate-bounce" />
                        <h3 className="text-lg font-bold text-gray-700">No Orders Placed Yet</h3>
                        <p className="text-gray-400 max-w-sm">You haven't bought anything yet! Start browsing our massive collection of premium products now.</p>
                        <button onClick={() => navigate('/')} className="bg-[#fb641b] text-white px-8 py-2.5 font-bold rounded-sm shadow hover:bg-[#f35200] transition">
                            CONTINUE SHOPPING
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const stepIndex = getStepIndex(order.orderStatus);
                            const isCancelled = order.orderStatus.toUpperCase() === 'CANCELLED' || order.orderStatus.toUpperCase() === 'REFUNDED';
                            const steps = ['Ordered', 'Packed & Confirmed', 'Shipped', 'Delivered'];
                            const isExpanded = expandedOrder === order.id;

                            const subtotal = order.products.reduce((sum, item) => sum + Number(item.product.price) * 82 * item.quantity, 0);
                            const gst = subtotal * 0.18;
                            const delivery = subtotal > 5000 ? 0 : 499;

                            return (
                                <div key={order.id} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                    
                                    {/* Order Brief Info Bar */}
                                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b bg-gray-50/50">
                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
                                            <div>
                                                <p className="text-gray-400 font-medium">Order ID</p>
                                                <p className="font-mono font-bold text-gray-800">{order.id.slice(0, 8)}...</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-medium">Placed On</p>
                                                <p className="font-bold text-gray-800 flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 font-medium">Total Price</p>
                                                <p className="font-bold text-gray-900 flex items-center">
                                                    ₹{Number(order.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                                            <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                            <button 
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                className="text-[#2874f0] font-bold text-xs hover:underline flex items-center gap-1"
                                            >
                                                {isExpanded ? <>Hide Details <ChevronUp className="w-4 h-4" /></> : <>Track Order <ChevronDown className="w-4 h-4" /></>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Products list in this order */}
                                    <div className="p-4 sm:p-5 space-y-4">
                                        {order.products.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-start pb-4 last:pb-0 border-b last:border-0 border-gray-100">
                                                <img 
                                                    src={item.product.images?.[0] || item.product.thumbnail || 'https://via.placeholder.com/100'} 
                                                    alt={item.product.title} 
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain border rounded p-1 bg-white flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#2874f0] cursor-pointer"
                                                        onClick={() => navigate(`/product/${item.product.id}`)}>
                                                        {item.product.title}
                                                    </h4>
                                                    
                                                    {item.product.selectedVariant && (
                                                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                                            {item.product.selectedVariant.color && <span>Color: <strong>{item.product.selectedVariant.color}</strong></span>}
                                                            {item.product.selectedVariant.size && <span>Size: <strong>{item.product.selectedVariant.size}</strong></span>}
                                                        </div>
                                                    )}

                                                    <p className="text-xs text-gray-400 mt-1">Quantity: <strong className="text-gray-700">{item.quantity}</strong></p>
                                                    <p className="text-sm font-bold text-green-700 mt-1">₹{Number(item.product.price * 82).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Tracking Timeline & Details - Expanded view */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/30 space-y-6">
                                            
                                            {/* Shipping Details and Price Details side-by-side */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Shipping Details card */}
                                                {order.shippingAddress && (
                                                    <div className="bg-white rounded-sm border p-4 shadow-sm flex gap-4 items-start">
                                                        <MapPin className="w-5 h-5 text-[#2874f0] mt-0.5 flex-shrink-0" />
                                                        <div className="text-xs sm:text-sm">
                                                            <p className="font-bold text-gray-700 mb-1">Shipping & Delivery Details</p>
                                                            <p className="text-gray-600 font-medium">{order.shippingAddress.line1}</p>
                                                            <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong></p>
                                                            <p className="text-gray-400 mt-1">Contact Phone: <strong className="text-gray-600">{order.shippingAddress.phone}</strong></p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Price details breakdown */}
                                                <div className="bg-white rounded-sm border p-4 shadow-sm text-xs sm:text-sm space-y-2.5">
                                                    <p className="font-bold text-gray-700 border-b pb-1.5 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-3.5 bg-green-500 rounded-full inline-block"></span> Billing Breakdown (GST & Fees)
                                                    </p>
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Items Subtotal ({order.products.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                                        <span>₹{Number(subtotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>GST Tax (18%)</span>
                                                        <span>₹{Number(gst).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Delivery Charges</span>
                                                        <span>{delivery === 0 ? <strong className="text-green-600">FREE</strong> : `₹${delivery}`}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm sm:text-base font-extrabold text-gray-900 border-t pt-2 mt-1">
                                                        <span>Total Paid Amount</span>
                                                        <span className="text-[#2874f0]">₹{Number(order.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tracking Stepper */}
                                            {!isCancelled && stepIndex >= 0 ? (
                                                <div className="py-4">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Delivery Tracking Progress</p>
                                                    
                                                    {/* Stepper Graphic */}
                                                    <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                                                        
                                                        {/* Stepper Line Background */}
                                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                                                        
                                                        {/* Stepper Line Active */}
                                                        <div 
                                                            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500" 
                                                            style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
                                                        />

                                                        {steps.map((step, idx) => {
                                                            const isCompleted = idx <= stepIndex;
                                                            const isActive = idx === stepIndex;

                                                            return (
                                                                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                                                        isCompleted 
                                                                            ? 'bg-green-500 border-green-600 text-white' 
                                                                            : 'bg-white border-gray-300 text-gray-400'
                                                                    } ${isActive ? 'scale-110 ring-4 ring-green-100' : ''}`}>
                                                                        {isCompleted ? <CheckCircle className="w-5 h-5 fill-current" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                                                    </div>
                                                                    <span className={`text-[10px] sm:text-xs font-bold text-center w-20 ${isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    
                                                    {/* Shipping Tracking ID */}
                                                    {order.trackingNumber && (
                                                        <p className="text-center text-xs text-gray-400 font-mono mt-8 bg-white border border-dashed rounded px-3 py-1.5 w-fit mx-auto">
                                                            Courier Tracking Number: <strong className="text-gray-700">{order.trackingNumber}</strong>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : isCancelled ? (
                                                <div className="bg-red-50/50 border border-red-200 text-red-700 text-sm rounded p-4 flex items-center gap-3">
                                                    <Ban className="w-5 h-5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold">This order has been cancelled</p>
                                                        <p className="text-xs text-red-600 mt-0.5">Refund is successfully processed if payment was captured.</p>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Stepper details */}
                                            <div className="border-t pt-4 flex flex-wrap gap-3 justify-end">
                                                
                                                {/* Cancel Order Action Button */}
                                                {!isCancelled && order.orderStatus.toUpperCase() !== 'SHIPPED' && order.orderStatus.toUpperCase() !== 'DELIVERED' && (
                                                    <button 
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="flex items-center gap-1.5 border border-red-200 text-red-500 font-bold text-xs px-4 py-2 hover:bg-red-50 transition rounded-sm"
                                                    >
                                                        <Ban className="w-3.5 h-3.5" /> Cancel Order
                                                    </button>
                                                )}

                                                {/* Download Receipt Invoice */}
                                                <button 
                                                    onClick={() => downloadInvoice(order)}
                                                    className="flex items-center gap-1.5 bg-[#2874f0] text-white font-bold text-xs px-4 py-2 hover:bg-blue-600 transition rounded-sm shadow-sm"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
