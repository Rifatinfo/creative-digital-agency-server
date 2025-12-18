import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";

const createServicePlan = catchAsync(async (  req : Request, res : Response) => {

});
const getServicePlan = catchAsync(async (  req : Request, res : Response) => {

});

export const ServicePlanController = {
    createServicePlan,
    getServicePlan
}