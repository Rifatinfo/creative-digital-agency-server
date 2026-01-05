"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePlanService = void 0;
const db_1 = require("../../config/db");
const createPlanIntoDB = (serviceId, plans) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.servicePlan.createMany({
        data: plans.map(plan => {
            var _a;
            return ({
                name: plan.name,
                price: plan.price,
                period: plan.period,
                description: plan.description,
                ctaText: plan.ctaText,
                highlighted: (_a = plan.highlighted) !== null && _a !== void 0 ? _a : false,
                features: plan.features,
                currency: "BDT",
                serviceId,
            });
        }),
    });
});
const getPlansByServiceFromDB = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.servicePlan.findMany({
        where: { serviceId }
    });
});
exports.ServicePlanService = {
    createPlanIntoDB,
    getPlansByServiceFromDB
};
