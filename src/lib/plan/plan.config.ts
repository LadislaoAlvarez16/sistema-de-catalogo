export type Plan = "basic" | "medium" | "pro";

export const PLAN_RULES = {
    basic: {
        showPrices: false,
        whatsappCTA: true,
        productModal: false,
        productPage: false,
        filters: false,
        productLimit: 30,
        categoryLimit: 5,
    },
    medium: {
        showPrices: false,
        whatsappCTA: true,
        productModal: true,
        productPage: false,
        filters: false,
        productLimit: 100,
        categoryLimit: 10,
    },
    pro: {
        showPrices: true,
        whatsappCTA: true,
        productModal: true,
        productPage: true,
        filters: true,
        productLimit: Infinity,
        categoryLimit: Infinity,
    },
} as const;
