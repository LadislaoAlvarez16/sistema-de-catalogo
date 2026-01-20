import type { Plan } from "./plan.config";
import { PLAN_RULES } from "./plan.config";

export function getPlanRules(plan: Plan) {
    return PLAN_RULES[plan];
}

export function canShowPrices(plan: Plan) {
    return PLAN_RULES[plan].showPrices;
}

export function canUseProductPage(plan: Plan) {
    return PLAN_RULES[plan].productPage;
}

export function canUseProductModal(plan: Plan) {
    return PLAN_RULES[plan].productModal;
}

export function getProductLimit(plan: Plan) {
    return PLAN_RULES[plan].productLimit;
}
