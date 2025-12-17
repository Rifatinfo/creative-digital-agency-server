import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.constant";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createCustomer(req);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Customer Created Successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await UserService.getAllFromDB(filter, options);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User retrieve Successfully",
        data: result
    })
})

export const UserController = {
    createCustomer,
    getAllFromDB
}
