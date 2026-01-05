"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const express_1 = require("express");
const service_controller_1 = require("./service.controller");
const router = (0, express_1.Router)();
router.post("/create-service", service_controller_1.ServiceController.createService);
router.get("/", service_controller_1.ServiceController.getService);
exports.ServiceRoutes = router;
