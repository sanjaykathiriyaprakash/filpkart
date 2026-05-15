import type React from 'react';

/** Flipkart-style nav icons — black outline + yellow accent */
const Y = '#FFE500';

function IconWrap({ children, active }: { children: React.ReactNode; active?: boolean }) {
    return (
        <span
            className={`flex items-center justify-center w-12 h-12 rounded-sm transition-colors ${
                active ? 'bg-[#e3f2fd]' : ''
            }`}
        >
            {children}
        </span>
    );
}

export function CategoryNavIcon({ name, active }: { name: string; active?: boolean }) {
    const key = name.split(',')[0].trim();
    const icons: Record<string, React.ReactElement> = {
        'For You': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <path d="M8 14h24l-2 18H10L8 14z" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M8 14l3-6h18l3 6" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="14" y="8" width="12" height="6" rx="1" fill={Y} />
                </svg>
            </IconWrap>
        ),
        Fashion: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <path d="M14 8l-6 8h4v16h16V16h4l-6-8" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="12" y="18" width="16" height="4" fill={Y} />
                </svg>
            </IconWrap>
        ),
        Mobiles: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="12" y="4" width="16" height="32" rx="3" stroke="#111" strokeWidth="2" />
                    <rect x="14" y="26" width="12" height="6" rx="1" fill={Y} />
                    <circle cx="20" cy="33" r="1.5" fill="#111" />
                </svg>
            </IconWrap>
        ),
        Beauty: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="14" y="16" width="12" height="18" rx="3" stroke="#111" strokeWidth="2" />
                    <rect x="16" y="8" width="8" height="8" rx="2" fill={Y} stroke="#111" strokeWidth="1.5" />
                </svg>
            </IconWrap>
        ),
        Electronics: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="4" y="8" width="32" height="20" rx="2" stroke="#111" strokeWidth="2" />
                    <rect x="6" y="22" width="28" height="4" fill={Y} />
                    <path d="M14 34h12M20 28v6" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </IconWrap>
        ),
        Home: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <path d="M8 22h24v12H8V22z" stroke="#111" strokeWidth="2" />
                    <path d="M20 6l12 10H8L20 6z" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                    <ellipse cx="20" cy="10" rx="6" ry="3" fill={Y} />
                </svg>
            </IconWrap>
        ),
        Appliances: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="8" y="8" width="24" height="18" rx="2" stroke="#111" strokeWidth="2" />
                    <rect x="10" y="10" width="20" height="12" fill={Y} />
                    <path d="M14 32h12" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </IconWrap>
        ),
        'Toys, ba...': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <circle cx="20" cy="22" r="10" stroke="#111" strokeWidth="2" />
                    <circle cx="20" cy="20" r="4" fill={Y} />
                    <circle cx="14" cy="12" r="3" stroke="#111" strokeWidth="1.5" />
                    <circle cx="26" cy="12" r="3" stroke="#111" strokeWidth="1.5" />
                </svg>
            </IconWrap>
        ),
        'Food & H...': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="12" y="10" width="16" height="22" rx="3" stroke="#111" strokeWidth="2" />
                    <rect x="14" y="16" width="12" height="6" rx="1" fill={Y} />
                </svg>
            </IconWrap>
        ),
        'Auto Acc...': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <path d="M10 24c0-6 4.5-10 10-10s10 4 10 10" stroke="#111" strokeWidth="2" />
                    <ellipse cx="20" cy="16" rx="12" ry="5" stroke="#111" strokeWidth="2" />
                    <path d="M8 24h24" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                    <rect x="12" y="12" width="16" height="5" rx="2" fill={Y} />
                </svg>
            </IconWrap>
        ),
        '2 Wheele...': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <circle cx="12" cy="28" r="5" stroke="#111" strokeWidth="2" fill={Y} />
                    <circle cx="28" cy="28" r="5" stroke="#111" strokeWidth="2" fill={Y} />
                    <path d="M12 23V14l16-4v9" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            </IconWrap>
        ),
        'Sports & ...': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <path d="M8 32l8-20 6 12 4-8 6 16" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="30" cy="12" r="4" fill={Y} stroke="#111" strokeWidth="1.5" />
                </svg>
            </IconWrap>
        ),
        'Books & ...': (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <path d="M10 8h8v26H10V8zM22 8h8v26h-8V8z" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="10" y="8" width="4" height="26" fill={Y} />
                    <rect x="22" y="8" width="4" height="26" fill={Y} />
                </svg>
            </IconWrap>
        ),
        Furniture: (
            <IconWrap active={active}>
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                    <rect x="6" y="18" width="28" height="10" rx="3" stroke="#111" strokeWidth="2" />
                    <rect x="10" y="14" width="20" height="6" fill={Y} stroke="#111" strokeWidth="1.5" />
                    <path d="M10 28v6M30 28v6" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </IconWrap>
        ),
    };

    return icons[key] || icons[name] || (
        <IconWrap active={active}>
            <span className="text-2xl">🏷️</span>
        </IconWrap>
    );
}
