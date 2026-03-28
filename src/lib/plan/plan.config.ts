export type Plan = "basic" | "medium" | "pro";

export const PLAN_RULES = {
    basic: {
        showPrices: true,
        whatsappCTA: true,
        productModal: false,
        productPage: false,
        filters: false,
        productLimit: 30,
        categoryLimit: 5,
    },
    medium: {
        showPrices: true,
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
        productLimit: 2000,    // Límite técnico de seguridad en vez de Infinity
        categoryLimit: 100,    // Límite técnico de seguridad
    },
} as const;