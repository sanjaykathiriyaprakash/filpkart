import { Link } from 'react-router-dom';

const FacebookSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
);
const TwitterXSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
);
const YouTubeSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
);
const InstagramSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
);

export default function Footer() {
    return (
        <footer className="mt-auto">
            {/* Main footer columns */}
            <div className="bg-[#172337] text-white py-12">
                <div className="max-w-screen-xl mx-auto px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-[12px]">
                    {/* About */}
                    <div>
                        <h4 className="text-[#878787] uppercase tracking-wider mb-3">About</h4>
                        <div className="space-y-1">
                            {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map(l => (
                                <Link key={l} to="#" className="block hover:underline font-medium transition-colors">{l}</Link>
                            ))}
                        </div>
                    </div>
                    {/* Group Companies */}
                    <div>
                        <h4 className="text-[#878787] uppercase tracking-wider mb-3">Group Companies</h4>
                        <div className="space-y-1">
                            {['Myntra', 'Cleartrip', 'Shopsy'].map(l => (
                                <Link key={l} to="#" className="block hover:underline font-medium transition-colors">{l}</Link>
                            ))}
                        </div>
                    </div>
                    {/* Help */}
                    <div>
                        <h4 className="text-[#878787] uppercase tracking-wider mb-3">Help</h4>
                        <div className="space-y-1">
                            {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'].map(l => (
                                <Link key={l} to="#" className="block hover:underline font-medium transition-colors">{l}</Link>
                            ))}
                        </div>
                    </div>
                    {/* Consumer Policy */}
                    <div>
                        <h4 className="text-[#878787] uppercase tracking-wider mb-3">Consumer Policy</h4>
                        <div className="space-y-1">
                            {['Cancellation & Returns', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal', 'EPR Compliance', 'FSSAI Food Safety Connect App'].map(l => (
                                <Link key={l} to="#" className="block hover:underline font-medium transition-colors">{l}</Link>
                            ))}
                        </div>
                    </div>
                    {/* Mail Us */}
                    <div className="border-l border-[#454d5e] pl-6 hidden lg:block">
                        <h4 className="text-[#878787] mb-3">Mail Us:</h4>
                        <p className="leading-relaxed">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &amp;<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India
                        </p>
                        {/* Social icons */}
                        <div className="mt-4">
                            <h4 className="text-[#878787] mb-3">Social:</h4>
                            <div className="flex gap-4 items-center">
                                <Link to="#" className="text-white hover:text-[#2874f0] transition-colors"><FacebookSVG /></Link>
                                <Link to="#" className="text-white hover:text-[#2874f0] transition-colors"><TwitterXSVG /></Link>
                                <Link to="#" className="text-white hover:text-[#2874f0] transition-colors"><YouTubeSVG /></Link>
                                <Link to="#" className="text-white hover:text-[#2874f0] transition-colors"><InstagramSVG /></Link>
                            </div>
                        </div>
                    </div>
                    {/* Registered Office */}
                    <div className="pl-4 hidden lg:block">
                        <h4 className="text-[#878787] mb-3">Registered Office Address:</h4>
                        <p className="leading-relaxed">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &amp;<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India<br />
                            CIN : U51109KA2012PTC066107<br />
                            Telephone: <span className="text-[#2874f0]">044-45614700</span> / <span className="text-[#2874f0]">044-67415800</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Seller bar */}
            <div className="bg-[#172337] border-t border-[#454d5e] py-6">
                <div className="max-w-screen-xl mx-auto px-10 flex flex-wrap items-center justify-between gap-4 text-white">
                    <div className="flex flex-wrap items-center gap-6">
                        <Link to="/seller/hub" className="flex items-center gap-2 hover:underline transition-colors text-[14px]">
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/sell-image-9de8ef.svg" alt="Become a Seller" className="w-[14px] h-[14px]" />
                            <span className="font-semibold text-white">Become a Seller</span>
                        </Link>
                        <Link to="#" className="flex items-center gap-2 hover:underline transition-colors text-[14px]">
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/advertise-image-866c0b.svg" alt="Advertise" className="w-[14px] h-[14px]" />
                            <span className="font-semibold text-white">Advertise</span>
                        </Link>
                        <Link to="#" className="flex items-center gap-2 hover:underline transition-colors text-[14px]">
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/gift-cards-image-d7ff24.svg" alt="Gift Cards" className="w-[14px] h-[14px]" />
                            <span className="font-semibold text-white">Gift Cards</span>
                        </Link>
                        <Link to="#" className="flex items-center gap-2 hover:underline transition-colors text-[14px]">
                            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/help-centre-image-c4ace8.svg" alt="Help Center" className="w-[14px] h-[14px]" />
                            <span className="font-semibold text-white">Help Center</span>
                        </Link>
                    </div>
                    <div className="text-white text-[14px]">
                        <span>© 2007-2026 Flipkart.com</span>
                    </div>
                    {/* Payment icons */}
                    <div className="flex items-center opacity-90">
                        <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-[22px]" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
