/** USD list price from API → INR display (Flipkart-style) */
export function toInr(usdPrice: number): number {
    return Math.floor(Number(usdPrice) * 82);
}

export function formatInr(usdPrice: number): string {
    return `₹${toInr(usdPrice).toLocaleString('en-IN')}`;
}
