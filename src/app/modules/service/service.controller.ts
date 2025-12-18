import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { ServiceService } from "./service.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../middlewares/sendResponse";

export const createService = catchAsync(async (req: Request, res: Response) => {
    const result = await ServiceService.createServiceInto(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Service created Successfully",
        data: result
    });
});

export const getService = catchAsync(async (req: Request, res: Response) => {
    const result = await ServiceService.getServicesFrom();

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Service fetched Successfully",
        data: result
    });
});

export const ServiceController = {
   createService,
   getService
}

