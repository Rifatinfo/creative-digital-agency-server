import { prisma } from "../../config/db"
import { IServicePlan } from "./servicePlan.interface"

const createPlanIntoDB = async (serviceId: string,
    plans: IServicePlan[]) => {
    return prisma.servicePlan.createMany({
        data: plans.map(plan => ({
            name: plan.name,
            price: plan.price,
            period: plan.period,
            description: plan.description,
            ctaText: plan.ctaText,
            highlighted: plan.highlighted ?? false,
            features: plan.features,

            currency: "BDT",
            // stripePriceId: "", // Set to an empty string instead of null
            serviceId,
        })),
    });
};

const getPlansByServiceFromDB = async (serviceId: string) => {
    return prisma.servicePlan.findMany({
        where: { serviceId }
    });
};

export const ServicePlanService = {
    createPlanIntoDB,
    getPlansByServiceFromDB
}