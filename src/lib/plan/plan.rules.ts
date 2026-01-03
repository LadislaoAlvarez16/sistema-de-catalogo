import { Plan } from "@/types/plan";

export const planRules = {
    basic: {
        showPrices: false,
        productPage: false,
        modal: false,
        advancedFilters: false,
    },
    medium: {
        showPrices: false,
        productPage: false,
        modal: true,
        advancedFilters: false,
    },
    pro: {
        showPrices: true,
        productPage: true,
        modal: true,
        advancedFilters: true,
    },
} satisfies Record<
    Plan,
    {
        showPrices: boolean;
        productPage: boolean;
        modal: boolean;
        advancedFilters: boolean;
    }
>;
