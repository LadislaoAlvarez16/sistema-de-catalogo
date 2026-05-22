import type { Plan } from "@/types/plan";
import { PLAN_RULES } from "./plan.config";

export function getPlanRules(plan: Plan) {
    return PLAN_RULES[plan];
}
