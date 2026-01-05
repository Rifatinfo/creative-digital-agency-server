"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePlanRoutes = void 0;
const express_1 = require("express");
const servicePlan_controller_1 = require("./servicePlan.controller");
const router = (0, express_1.Router)();
router.post("/create-plan", servicePlan_controller_1.ServicePlanController.createServicePlan);
router.get("/:serviceId", servicePlan_controller_1.ServicePlanController.getServicePlan);
exports.ServicePlanRoutes = router;
