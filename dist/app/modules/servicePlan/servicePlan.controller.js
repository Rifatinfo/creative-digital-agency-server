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
exports.ServicePlanController = void 0;
const catchAsync_1 = require("../../middlewares/catchAsync");
const servicePlan_service_1 = require("./servicePlan.service");
const sendResponse_1 = require("../../middlewares/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const createServicePlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId, plans } = req.body;
    const result = yield servicePlan_service_1.ServicePlanService.createPlanIntoDB(serviceId, plans);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Service plan Successfully",
        data: result
    });
}));
const getServicePlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    const result = yield servicePlan_service_1.ServicePlanService.getPlansByServiceFromDB(serviceId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Plans fetched Successfully",
        data: result
    });
}));
exports.ServicePlanController = {
    createServicePlan,
    getServicePlan
};
