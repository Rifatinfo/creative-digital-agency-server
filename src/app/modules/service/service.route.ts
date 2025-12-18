import { Router } from "express";
import { ServiceController } from "./service.controller";

const router = Router();

router.post("/create-service", ServiceController.createService);
router.get("/", ServiceController.getService);

export const ServiceRoutes = router;