import { Router } from "express";
import { ServicePlanController } from "./servicePlan.controller";


const router = Router();

router.post("/", ServicePlanController.createServicePlan);
router.get("/:serviceId", ServicePlanController.getServicePlan);

export const ServicePlanRoutes = router;