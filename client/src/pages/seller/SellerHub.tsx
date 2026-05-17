import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Percent, 
  HelpCircle, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck
} from 'lucide-react';

export default function SellerHub() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: 'Raju Lunawath',
      store: 'Amazestore',
      image: '/images/raju_lunawath.png',
      quote: 'Starting with just one category, their unwavering support and innovative platform empowered me to grow exponentially, expanding to six diverse categories and achieving an astounding 5x growth year on year.'
    },
    {
      name: 'Priya Sharma',
      store: 'EthnicWeaves',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      quote: 'Flipkart Seller Hub completely transformed my boutique weavers shop from a local town store to a nation-wide brand! We received 400+ orders during our very first Big Billion Days event!'
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col antialiased">
      {/* Seller Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-[#ffe500] text-black font-bold p-2.5 rounded-lg flex items-center justify-center shadow-md">
                <ShoppingBag className="w-6 h-6 text-[#2874f0]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[20px] text-[#2874f0] leading-none tracking-tight flex items-center gap-1">
                  flipkart <span className="text-[#ffe500] text-[18px]">★</span>
                </span>
                <span className="text-[12px] text-gray-500 font-semibold tracking-wider uppercase">Seller Hub</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Sell Online', 'Fees and Commission', 'Grow', 'Learn', 'Shopsy'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-gray-600 hover:text-[#2874f0] font-medium text-sm transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-4">
              <Link 
                to="/seller/login" 
                className="px-6 py-2.5 border border-[#2874f0] text-[#2874f0] font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm"
              >
                Login
              </Link>
              <Link 
                to="/seller/register" 
                className="px-6 py-2.5 bg-[#ffe500] text-gray-900 font-bold rounded-lg hover:bg-[#ebd300] transition-all duration-200 text-sm shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Start Selling <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-4 pb-6 space-y-4 shadow-inner">
            <nav className="flex flex-col gap-3">
              {['Sell Online', 'Fees and Commission', 'Grow', 'Learn', 'Shopsy'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-gray-700 hover:text-[#2874f0] font-semibold text-base py-2 border-b border-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-2">
              <Link 
                to="/seller/login" 
                className="w-full text-center py-3 border border-[#2874f0] text-[#2874f0] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/seller/register" 
                className="w-full text-center py-3 bg-[#ffe500] text-gray-900 font-bold rounded-lg hover:bg-[#ebd300] transition-colors shadow-md flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Selling <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50/50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading and CTA */}
              <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-100/60 border border-blue-200 text-blue-800 font-semibold text-xs tracking-wider uppercase shadow-sm">
                  <Award className="w-4 h-4 text-[#2874f0]" /> India's Most Trusted Marketplace
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                  Sell Online with <span className="text-[#2874f0] relative">Flipkart
                    <span className="absolute bottom-1.5 left-0 w-full h-2.5 bg-[#ffe500]/60 -z-10 rounded-full"></span>
                  </span>
                </h1>
                
                <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Join a community of over 10 lakh+ successful merchants. Reach 45 crore+ active buyers across India with zero upfront listing fees!
                </p>
                
                {/* Responsive Quick CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link 
                    to="/seller/register"
                    className="px-8 py-4 bg-[#ffe500] text-gray-900 font-extrabold rounded-xl hover:bg-[#ebd300] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg text-lg flex items-center justify-center gap-3"
                  >
                    Start Selling Now <ArrowRight className="w-5 h-5 text-gray-900" />
                  </Link>
                  <a 
                    href="#features"
                    className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-lg flex items-center justify-center"
                  >
                    Explore Benefits
                  </a>
                </div>
                
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100 max-w-md mx-auto lg:mx-0">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">45Cr+</h3>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Active Customers</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">10L+</h3>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Sellers</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">19K+</h3>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Pincodes Served</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Image Illustration */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-blue-100/80 to-[#ffe500]/30 rounded-[40px] blur-2xl -z-10"></div>
                <div className="relative group max-w-md sm:max-w-lg lg:max-w-none">
                  <img 
                    src="/images/seller_couple.png" 
                    alt="Sell Online with Flipkart" 
                    className="rounded-[30px] shadow-2xl border-4 border-white transition-all duration-500 group-hover:scale-[1.01]"
                  />
                  {/* Floating feature card */}
                  <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 hover:translate-y-[-4px] transition-transform duration-300">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Fast 7-Day Payments</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Quick settlement cycles</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="py-20 bg-gray-50 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Why Sellers Choose Flipkart Hub
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                We empower you with all the business tools, support systems, and payment security needed to run a nationwide e-commerce store with absolute peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="bg-blue-50 text-[#2874f0] p-4 rounded-2xl group-hover:bg-[#2874f0] group-hover:text-white transition-colors duration-300">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mt-6 leading-tight">45 crore+ Flipkart customers</h3>
                <p className="text-sm text-gray-500 mt-3">Instant visibility across 19,000+ serviceable delivery pincodes in India.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="bg-blue-50 text-[#2874f0] p-4 rounded-2xl group-hover:bg-[#2874f0] group-hover:text-white transition-colors duration-300">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mt-6 leading-tight">7* days secure & regular payments</h3>
                <p className="text-sm text-gray-500 mt-3">Receive settlements quickly within 7 business days of sales dispatch.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="bg-blue-50 text-[#2874f0] p-4 rounded-2xl group-hover:bg-[#2874f0] group-hover:text-white transition-colors duration-300">
                  <Percent className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mt-6 leading-tight">Low cost of doing business</h3>
                <p className="text-sm text-gray-500 mt-3">No initial registration fee and minimal margins with clear calculations.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="bg-blue-50 text-[#2874f0] p-4 rounded-2xl group-hover:bg-[#2874f0] group-hover:text-white transition-colors duration-300">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mt-6 leading-tight">One click Seller Support</h3>
                <p className="text-sm text-gray-500 mt-3">Dedicated support manager to resolve account and product queries 24/7.</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="bg-blue-50 text-[#2874f0] p-4 rounded-2xl group-hover:bg-[#2874f0] group-hover:text-white transition-colors duration-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mt-6 leading-tight">Access to The Big Billion Days</h3>
                <p className="text-sm text-gray-500 mt-3">Gain massive growth during India's largest annual shopping festivals.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials Success Stories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Seller Success Stories
              </h2>
              <p className="text-gray-600 text-base">
                Read how thousands of small store owners have transformed their businesses with Flipkart.
              </p>
            </div>

            {/* Slider Container */}
            <div className="relative max-w-4xl mx-auto bg-gradient-to-r from-blue-50/50 to-orange-50/30 rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                
                {/* Photo */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full border-4 border-[#ffe500] -z-10 scale-105"></div>
                  <img 
                    src={testimonials[currentSlide].image} 
                    alt={testimonials[currentSlide].name} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>

                {/* Quote Content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <p className="text-gray-700 italic text-base sm:text-lg leading-relaxed">
                    "{testimonials[currentSlide].quote}"
                  </p>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{testimonials[currentSlide].name}</h4>
                    <p className="text-sm font-semibold text-[#2874f0] uppercase tracking-wider mt-0.5">
                      Owner, {testimonials[currentSlide].store}
                    </p>
                  </div>
                </div>

              </div>

              {/* Slider Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6">
                <button 
                  onClick={handlePrevSlide}
                  className="bg-white p-3 rounded-full border border-gray-100 shadow-md hover:bg-gray-50 active:scale-95 transition-all text-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6">
                <button 
                  onClick={handleNextSlide}
                  className="bg-white p-3 rounded-full border border-gray-100 shadow-md hover:bg-gray-50 active:scale-95 transition-all text-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[#2874f0] w-6' : 'bg-gray-300'}`}
                  />
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-[#2874f0] py-16 text-white relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-orange-400/20 rounded-full blur-2xl"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Launch Your Store Online Today!
            </h2>
            <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
              It takes less than 10 minutes to register and set up your seller profile. Your dedicated onboarding assistant is waiting!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link 
                to="/seller/register"
                className="px-8 py-4 bg-[#ffe500] text-gray-900 font-extrabold rounded-xl hover:bg-[#ebd300] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg shadow-lg"
              >
                Register as Seller
              </Link>
              <Link 
                to="/seller/login"
                className="px-8 py-4 bg-transparent text-white border-2 border-white/80 font-bold rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-lg"
              >
                Seller Login
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-blue-100">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-5 h-5 text-[#ffe500]" /> 100% Safe Payments</span>
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
              <span className="flex items-center gap-1.5"><Users className="w-5 h-5 text-[#ffe500]" /> 24/7 Priority Support</span>
            </div>
          </div>
        </section>

      </main>

      {/* Seller Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Sell Online</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">How to start selling</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing & commission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping options</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Advertising tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Grow Business</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Big Billion Days</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shopsy sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seller learning center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Seller Policy</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Seller terms & conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fulfillment terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grievance redressal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Priority seller helpline</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-mail: seller@flipkart.com</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs & support hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Onboarding assistance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} Flipkart Seller Hub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Site Map</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
