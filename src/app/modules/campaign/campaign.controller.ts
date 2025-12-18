import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { CampaignService } from "./campaign.service";
import { sendResponse } from "../../middlewares/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields } from "./campaign.constant";
import AppError from "../../middlewares/AppError";

const createCampaign = catchAsync(async (req: Request, res: Response) => {
    const result = await CampaignService.createCampaign(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created Successfully",
        data: result
    });
})

const getAllCampaignFromDB = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await CampaignService.getAllCampaignFromDB(filter, options);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Campaign Data is retrieved Successfully",
        data: result
    });
})

const updateCampaignIntoDB = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        throw new AppError(400, "Invalid campaign ID");
    }
    const result = await CampaignService.updateCampaignIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Campaign Data Updated Successfully",
        data: result
    });
})

const deleteCampaignFromBD = catchAsync(async (req : Request, res : Response) => {
    const id = Number(req.params.id);
    const result = await CampaignService.deleteCampaignFromDB(id);
       sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Campaign Delete Successfully",
        data: result
    });
})

export const CampaignController = {
    createCampaign,
    getAllCampaignFromDB,
    updateCampaignIntoDB,
    deleteCampaignFromBD
};

