import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../../types/common";
import AppError from "../../middlewares/AppError";

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
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const result = await UserService.getMyProfile(user as IAuthUser);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "My profile data fetched!",
        success: true,
        data: result
    });
});

const updateMyProfile = catchAsync(async (req : Request, res : Response) => {
    const user = req.user;
    if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const result = await UserService.updateMyProfile(req, user as IAuthUser);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "My profile data fetched!",
        success: true,
        data: result
    });
})
const changeProfileStatus = catchAsync(async (req : Request, res : Response) => {
    const {id} = req.params;
    
    const result = await UserService.changeProfileStatus(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Users profile status changed!",
        success: true,
        data: result
    });
});

export const UserController = {
    createCustomer,
    getAllFromDB,
    getMyProfile,
    updateMyProfile,
    changeProfileStatus
}

