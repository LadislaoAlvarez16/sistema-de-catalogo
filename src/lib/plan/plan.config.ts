export type Plan = "basic" | "pro";

export const PLAN_RULES = {
    basic: {
        showPrices: true,
        whatsappCTA: true,
        productModal: true,
        modal: true,
        buscador: true,
        productPage: false,
        filters: false,
        advancedFilters: false,
        productLimit: Infinity,
        categoryLimit: Infinity,
    },
    pro: {
        showPrices: true,
        whatsappCTA: true,
        productModal: true,
        modal: true,
        buscador: true,
        productPage: true,
        filters: true,
        advancedFilters: true,
        productLimit: Infinity,
        categoryLimit: Infinity,
    },
} as const;