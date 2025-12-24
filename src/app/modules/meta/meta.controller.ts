import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtUser } from "../../../types/express";
import { MetaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: JwtUser }, res: Response) => {

    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as JwtUser);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Meta data retrieval successfully!",
        data: result
    });
});

export const MetaController = {
    fetchDashboardMetaData
}