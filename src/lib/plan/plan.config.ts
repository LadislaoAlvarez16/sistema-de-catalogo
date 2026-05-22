export type Plan = "basic" | "medium" | "pro";

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
        productLimit: Infinity, // ilimitados
        categoryLimit: 5,
    },
    medium: {
        showPrices: true,
        whatsappCTA: true,
        productModal: true,
        modal: true,
        buscador: true,
        productPage: false,
        filters: false,
        advancedFilters: false,
        productLimit: 100,
        categoryLimit: 10,
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
        productLimit: 2000,    // Límite técnico de seguridad
        categoryLimit: 100,    // Límite técnico de seguridad
    },
} as const;