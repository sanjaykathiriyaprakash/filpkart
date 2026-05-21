import { useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import { HelpCircle, CheckCircle, Send, Clock } from 'lucide-react';

interface Question {
    id: string;
    productTitle: string;
    questionText: string;
    buyerName: string;
    timeAgo: string;
    status: 'Answered' | 'Unanswered';
    answerText?: string;
}

export default function SellerQuestions() {
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 'Q-401',
            productTitle: 'Wireless Gaming Mouse',
            questionText: 'Is the mouse rechargeable, or does it require AA batteries?',
            buyerName: 'Amit Sharma',
            timeAgo: '2 hours ago',
            status: 'Unanswered'
        },
        {
            id: 'Q-402',
            productTitle: 'Mechanical Keyboard',
            questionText: 'Are the key switches hot-swappable, or soldered to the board?',
            buyerName: 'Nikhil Roy',
            timeAgo: 'Yesterday',
            status: 'Answered',
            answerText: 'The switches on this mechanical keyboard are fully hot-swappable (supports both 3-pin and 5-pin MX switches). Keycap puller is included.'
        },
        {
            id: 'Q-403',
            productTitle: 'FHD Gaming Monitor',
            questionText: 'Does this monitor come with an HDMI cable in the box?',
            buyerName: 'Preeti Verma',
            timeAgo: '3 days ago',
            status: 'Unanswered'
        }
    ]);

    const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});

    const handleAnswerSubmit = (id: string) => {
        const text = draftAnswers[id];
        if (!text || !text.trim()) return;

        setQuestions(prev => prev.map(q => {
            if (q.id === id) {
                return {
                    ...q,
                    status: 'Answered',
                    answerText: text
                };
            }
            return q;
        }));

        setDraftAnswers(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const unansweredCount = questions.filter(q => q.status === 'Unanswered').length;

    return (
        <SellerLayout>
            <div className="space-y-6 max-w-5xl mx-auto font-sans">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-[#2874f0]" /> Buyer Q&A Portal
                        </h2>
                        <p className="text-xs font-medium text-gray-400 mt-1">Answer questions asked by buyers on your listings. Speed and quality of responses heavily impact conversions.</p>
                    </div>
                    {unansweredCount > 0 && (
                        <span className="bg-orange-50 text-[#fb641b] border border-orange-100 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                            {unansweredCount} Pending
                        </span>
                    )}
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map(q => (
                        <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                            {/* Product Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Product Inquire</span>
                                    <span className="font-bold text-gray-800 text-xs sm:text-sm">{q.productTitle}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{q.timeAgo} by {q.buyerName}</span>
                                </div>
                            </div>

                            {/* Question text */}
                            <div className="flex items-start gap-2.5">
                                <span className="bg-blue-50 text-[#2874f0] font-black text-xs px-2 py-0.5 rounded uppercase mt-0.5">Q</span>
                                <p className="font-bold text-gray-800 text-sm">{q.questionText}</p>
                            </div>

                            {/* Answer text / Input */}
                            <div className="pl-7 mt-3">
                                {q.status === 'Answered' ? (
                                    <div className="bg-green-50/55 border border-green-100 rounded-lg p-3.5 space-y-2">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-700 uppercase">
                                            <CheckCircle className="w-3.5 h-3.5" /> Answered
                                        </div>
                                        <p className="text-xs text-gray-700 font-medium leading-relaxed">{q.answerText}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        <textarea
                                            placeholder="Write your helpful response here..."
                                            value={draftAnswers[q.id] || ''}
                                            onChange={(e) => setDraftAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                            className="w-full bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 p-3 outline-none focus:border-[#2874f0] h-20 resize-none transition-colors"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleAnswerSubmit(q.id)}
                                                disabled={!draftAnswers[q.id] || !draftAnswers[q.id].trim()}
                                                className="bg-[#2874f0] hover:bg-blue-600 disabled:bg-blue-200 text-white font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                                            >
                                                <Send className="w-3 h-3" /> Submit Answer
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SellerLayout>
    );
}
