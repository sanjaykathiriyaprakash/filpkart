import { Link } from 'react-router-dom';

type DirectoryRow = { label: string; items: { text: string; search: string }[] };

const BRAND_DIRECTORY: DirectoryRow[] = [
    {
        label: 'MOST SEARCHED FOR ON FLIPKART',
        items: [
            { text: 'Mobile Phones', search: 'smartphones' },
            { text: 'Best Selling on Flipkart', search: 'laptops' },
            { text: 'Electronics', search: 'laptops' },
            { text: 'Fashion', search: 'mens-shirts' },
            { text: 'Beauty', search: 'beauty' },
            { text: 'Home & Kitchen', search: 'kitchen-accessories' },
        ],
    },
    {
        label: 'MOBILES',
        items: [
            { text: 'Nokia', search: 'nokia' },
            { text: 'Samsung', search: 'samsung' },
            { text: 'Apple', search: 'iphone' },
            { text: 'Realme', search: 'realme' },
            { text: 'Mobile Phones Under 10000', search: 'smartphones' },
            { text: 'Mobile Phones Under 15000', search: 'smartphones' },
            { text: 'Mobile Phones Under 20000', search: 'smartphones' },
        ],
    },
    {
        label: 'CAMERA',
        items: [
            { text: 'GoPro Action Camera', search: 'camera' },
            { text: 'Nikon Camera', search: 'camera' },
            { text: 'Canon Camera', search: 'camera' },
            { text: 'Sony Camera', search: 'camera' },
            { text: 'DSLR Camera', search: 'camera' },
        ],
    },
    {
        label: 'LAPTOPS',
        items: [
            { text: 'HP Pavilion', search: 'laptops' },
            { text: 'Dell Laptops', search: 'laptops' },
            { text: 'Asus ROG', search: 'laptops' },
            { text: 'MacBook Pro M4', search: 'laptops' },
            { text: 'Gaming Laptops', search: 'laptops' },
        ],
    },
    {
        label: 'TVS',
        items: [
            { text: 'LED TV', search: 'television' },
            { text: 'Smart TV', search: 'television' },
            { text: 'OLED TV', search: 'television' },
            { text: 'Samsung TV', search: 'samsung' },
            { text: 'LG TV', search: 'lg' },
        ],
    },
    {
        label: 'LARGE APPLIANCES',
        items: [
            { text: 'Refrigerator', search: 'refrigerator' },
            { text: 'Washing Machine', search: 'washing' },
            { text: 'Air Conditioner', search: 'air' },
            { text: 'Microwave Oven', search: 'microwave' },
        ],
    },
    {
        label: 'CLOTHING',
        items: [
            { text: 'Sarees', search: 'saree' },
            { text: 'Kurtas', search: 'kurta' },
            { text: "Men's T-shirts", search: 'mens-shirts' },
            { text: "Women's Jeans", search: 'womens-jeans' },
            { text: 'Lehenga', search: 'lehenga' },
        ],
    },
    {
        label: 'FOOTWEAR',
        items: [
            { text: 'Adidas Shoes', search: 'adidas' },
            { text: 'Nike Shoes', search: 'nike' },
            { text: 'Puma Shoes', search: 'puma' },
            { text: 'Sneakers', search: 'sneakers' },
        ],
    },
    {
        label: 'GROCERIES',
        items: [
            { text: 'Tea', search: 'tea' },
            { text: 'Coffee', search: 'coffee' },
            { text: 'Rice', search: 'rice' },
            { text: 'Dry Fruits', search: 'dry' },
        ],
    },
    {
        label: 'BEST SELLING ON FLIPKART',
        items: [
            { text: 'Google Pixel', search: 'pixel' },
            { text: 'Apple iPhone', search: 'iphone' },
            { text: 'Samsung Galaxy', search: 'samsung' },
            { text: 'Motorola Edge', search: 'motorola' },
        ],
    },
    {
        label: 'FURNITURE',
        items: [
            { text: 'Sofas', search: 'sofa' },
            { text: 'Beds', search: 'bed' },
            { text: 'Dining Tables', search: 'table' },
            { text: 'Office Chairs', search: 'chair' },
        ],
    },
    {
        label: 'BGMH',
        items: [
            { text: 'Books', search: 'books' },
            { text: 'Beauty and Grooming', search: 'beauty' },
            { text: 'Toys & Games', search: 'toy' },
            { text: 'Automotive Accessories', search: 'automotive' },
            { text: 'Festive Decor & Gifting', search: 'decor' },
        ],
    },
];

export default function BrandDirectory() {
    return (
        <section className="bg-white rounded-sm shadow-sm p-5 mt-4 mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 border-b pb-2">
                Top Stories: Brand Directory
            </h2>
            <div className="space-y-3 text-[11px] leading-relaxed text-gray-600">
                {BRAND_DIRECTORY.map((row) => (
                    <div key={row.label} className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                        <span className="font-bold text-gray-800 uppercase flex-shrink-0 sm:w-48 sm:text-right">
                            {row.label}:
                        </span>
                        <span className="flex flex-wrap gap-x-1 gap-y-0.5">
                            {row.items.map((item, i) => (
                                <span key={item.text}>
                                    <Link
                                        to={`/?search=${encodeURIComponent(item.search)}`}
                                        className="hover:text-[#2874f0] hover:underline"
                                    >
                                        {item.text}
                                    </Link>
                                    {i < row.items.length - 1 && (
                                        <span className="text-gray-300 mx-0.5">|</span>
                                    )}
                                </span>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
