/** Maps UI search slugs to DB categories / title patterns */
export type SearchProfile = {
    categories?: string[];
    titleTerms?: string[];
    excludeTitlePatterns?: string[];
};

export const SEARCH_PROFILES: Record<string, SearchProfile> = {
    automotive: {
        categories: ['motorcycle', 'vehicle-accessories', 'automotive'],
        titleTerms: ['helmet', 'motorcycle', 'scooter', 'moto', 'tyre', 'tire', 'dashcam', 'car ', 'vehicle', 'automotive'],
    },
    motorcycle: {
        categories: ['motorcycle'],
        titleTerms: ['motorcycle', 'scooter', 'moto', 'bike'],
    },
    book: {
        categories: ['books'],
        excludeTitlePatterns: ['macbook', 'matebook', 'notebook', 'facebook', 'chromebook'],
    },
    books: {
        categories: ['books'],
        excludeTitlePatterns: ['macbook', 'matebook', 'notebook', 'facebook', 'chromebook'],
    },
    helmet: { titleTerms: ['helmet'], categories: ['motorcycle', 'sports-accessories', 'automotive'] },
    dashcam: { titleTerms: ['dashcam', 'camera'], categories: ['automotive'] },
    tyre: { titleTerms: ['tyre', 'tire'], categories: ['automotive'] },
    charger: { titleTerms: ['charger'], categories: ['automotive', 'mobile-accessories'] },
    laptops: {
        categories: ['laptops'],
    },
    smartphones: {
        categories: ['smartphones', 'mobile-accessories'],
    },
};

export function resolveSearchProfile(search?: string): SearchProfile | null {
    if (!search?.trim()) return null;
    const key = search.trim().toLowerCase();
    return SEARCH_PROFILES[key] || null;
}
