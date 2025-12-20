import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { ServicePlanService } from "./servicePlan.service";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";

const createServicePlan = catchAsync(async (req: Request, res: Response) => {
    const { serviceId, plans } = req.body;
    const result = await ServicePlanService.createPlanIntoDB(serviceId, plans);
    
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Service plan Successfully",
        data: result
    });
});

const getServicePlan = catchAsync(async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    const result = await ServicePlanService.getPlansByServiceFromDB(serviceId);
   
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Plans fetched Successfully",
        data: result
    });
});

export const ServicePlanController = {
    createServicePlan,
    getServicePlan
}