export type Plan = "basic" | "medium" | "pro";

export const PLAN_RULES = {
    basic: {
        showPrices: false,
        whatsappCTA: true,
        productModal: false,
        productPage: false,
        filters: false,
        productLimit: 10,
    },
    medium: {
        showPrices: false,
        whatsappCTA: true,
        productModal: true,
        productPage: false,
        filters: false,
        productLimit: 20,
    },
    pro: {
        showPrices: true,
        whatsappCTA: false,
        productModal: true,
        productPage: true,
        filters: true,
        productLimit: Infinity,
    },
} as const;
