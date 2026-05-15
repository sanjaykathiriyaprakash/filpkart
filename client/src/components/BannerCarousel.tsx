import { useEffect, useState } from 'react';

export type BannerSlide = {
    brand: string;
    bg: string;
    title: string;
    subtitle: string;
    desc: string;
    sbi?: boolean;
    accent: string;
};

interface Props {
    slides: BannerSlide[];
    autoMs?: number;
}

export default function BannerCarousel({ slides, autoMs = 5000 }: Props) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const t = setInterval(() => setActive((i) => (i + 1) % slides.length), autoMs);
        return () => clearInterval(t);
    }, [slides.length, autoMs]);

    return (
        <div className="mb-3">
            <div className="relative overflow-hidden rounded-lg">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                >
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className="min-w-full relative h-52 sm:h-56 flex flex-col justify-between p-4 sm:p-5 cursor-pointer shrink-0"
                            style={{ background: slide.bg }}
                        >
                            <div className="absolute top-3 right-3 bg-yellow-400 text-black font-black text-[10px] px-2 py-0.5 rounded-sm shadow leading-tight text-center z-10">
                                SASA<br />LELE
                            </div>
                            <div className="absolute bottom-14 right-3 text-white/40 text-xs font-bold z-10">AD</div>
                            <div className="z-10 max-w-[70%]">
                                <div className="font-black text-sm tracking-widest mb-0.5" style={{ color: slide.accent }}>
                                    {slide.brand}
                                </div>
                                <div className="text-white font-black text-lg sm:text-xl leading-tight">{slide.title}</div>
                                <div className="text-yellow-300 font-bold text-sm mt-0.5">{slide.subtitle}</div>
                                <div className="text-white/70 text-xs mt-1">{slide.desc}</div>
                            </div>
                            {slide.sbi && (
                                <div className="bg-white/95 border border-gray-200 rounded-sm px-3 py-2 flex items-center gap-2 z-10 mt-auto">
                                    <span className="bg-[#1a4480] text-white text-[10px] font-black px-2 py-0.5 rounded-sm">SBI</span>
                                    <span className="text-gray-600 text-[10px] sm:text-xs">
                                        card 10% Instant Discount* with SBI Credit Card (also valid on EMI Trans.)
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => setActive(i)}
                        className={`h-1.5 rounded-full transition-all ${
                            i === active ? 'w-6 bg-gray-700' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
