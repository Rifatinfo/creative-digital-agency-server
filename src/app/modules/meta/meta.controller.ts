import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";
import { MetaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(async (req: Request, res: Response) => {
  const result = await MetaService.fetchDashboardMetaData();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meta data retrieved successfully!",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
};
