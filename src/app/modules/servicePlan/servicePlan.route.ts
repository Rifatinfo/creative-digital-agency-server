import { Router } from "express";
import { ServicePlanController } from "./servicePlan.controller";


const router = Router();

router.post("/create-plan", ServicePlanController.createServicePlan);
router.get("/:serviceId", ServicePlanController.getServicePlan);

export const ServicePlanRoutes = router;