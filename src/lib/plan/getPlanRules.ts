import { Plan } from "@/types/plan";
import { planRules } from "./plan.rules";

export function getPlanRules(plan: Plan) {
    return planRules[plan];
}
