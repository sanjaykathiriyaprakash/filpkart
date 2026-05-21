import { useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import { HelpCircle, Search, Mail, Phone, ChevronDown, CheckCircle } from 'lucide-react';

interface Faq {
    question: string;
    answer: string;
    category: string;
}

export default function SellerHelp() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [ticketCategory, setTicketCategory] = useState('Payment');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [ticketSubmitted, setTicketSubmitted] = useState(false);

    const faqs: Faq[] = [
        {
            category: 'Payments',
            question: 'How do I receive payments for my sales?',
            answer: 'Payments are settled directly to your registered bank account. Sellers are paid within 7-10 business days of order delivery, depending on their seller tier status (Bronze, Silver, or Gold).'
        },
        {
            category: 'Listings',
            question: 'How long does it take for a product to get approved?',
            answer: 'All new products go through our Quality Check (QC) process. Usually, listings are reviewed and approved within 24 to 48 hours. You will receive an email confirmation once approved.'
        },
        {
            category: 'Shipping',
            question: 'What is the Flipkart Seller Protection Fund (SPF)?',
            answer: 'The SPF protects sellers against losses due to customer fraud or carrier damages. If a customer returns a damaged or incorrect product, you can file an SPF claim within 14 days of return delivery.'
        },
        {
            category: 'Payments',
            question: 'What platform fees does Flipkart charge?',
            answer: 'Flipkart charges a commission fee of 10% on successful sales. Additional fees include fixed closing fees based on product price and actual shipping fees determined by weight and shipping distance.'
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) return;

        setTicketSubmitted(true);
        setTimeout(() => {
            setTicketSubmitted(false);
            setSubject('');
            setDescription('');
        }, 4000);
    };

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-5xl mx-auto font-sans">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-[#2874f0]" /> Seller Support & FAQ Center
                    </h2>
                    <p className="text-xs font-medium text-gray-400 mt-1">Get support, check knowledge base articles, or raise a support ticket directly with our account management team.</p>
                </div>

                {/* FAQ section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles or FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white text-xs font-semibold text-gray-700 outline-none"
                            />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Frequently Asked Questions</h3>
                            </div>
                            {filteredFaqs.length === 0 ? (
                                <div className="p-8 text-center text-xs text-gray-400">No FAQ articles found matching "{searchQuery}"</div>
                            ) : (
                                filteredFaqs.map((faq, i) => (
                                    <div key={i} className="p-4 space-y-2">
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between text-left font-bold text-gray-800 text-sm hover:text-[#2874f0] transition-colors"
                                        >
                                            <span>{faq.question}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                                        </button>
                                        {activeFaq === i && (
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 animate-slideDown">
                                                {faq.answer}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Submit ticket section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-fit">
                        {ticketSubmitted ? (
                            <div className="text-center py-10 space-y-3">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm">Support Ticket Created!</h4>
                                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">Reference ID: <b>FKT-{Math.floor(100000 + Math.random() * 900000)}</b>.<br />A seller executive will reply to your registered email address within 4 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateTicket} className="space-y-4">
                                <h3 className="font-bold text-gray-800 text-sm tracking-wide flex items-center gap-1.5 border-b border-gray-50 pb-2">
                                    <Mail className="w-4 h-4 text-[#2874f0]" /> Raise Support Ticket
                                </h3>

                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Issue Category</label>
                                    <select
                                        value={ticketCategory}
                                        onChange={(e) => setTicketCategory(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 px-2 py-2 outline-none focus:border-[#2874f0]"
                                    >
                                        <option value="Payment">Payments & Settlements</option>
                                        <option value="Listing">QC & Listings Approval</option>
                                        <option value="Orders">Order Packing & Dispatch</option>
                                        <option value="Returns">Returns & SPF Claims</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Brief summary of your issue"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 px-3 py-2 outline-none focus:border-[#2874f0]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-gray-500 mb-1 tracking-wider">Description</label>
                                    <textarea
                                        required
                                        placeholder="Please explain the issue details in full..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 p-3 outline-none focus:border-[#2874f0] h-24 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#fb641b] text-white hover:bg-[#e45a16] font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors"
                                >
                                    Submit Ticket
                                </button>
                            </form>
                        )}

                        <div className="border-t border-gray-100 pt-4 mt-5 space-y-2.5 text-xs text-gray-400 font-semibold">
                            <p className="text-gray-800 font-bold text-[11px] uppercase tracking-wide">Direct Contact Support</p>
                            <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-green-500" />
                                <span>+91 1800 208 9898 (Toll Free)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
