import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { sendResponse } from "../../middlewares/sendResponse";
import { UserService } from "./admin.service";
import pick from "../../helper/pick";
import { userFilterableFields } from "../user/user.constant";
import { StatusCodes } from "http-status-codes";
import AppError from "../../middlewares/AppError";
import { IAuthUser } from "../../../types/common";

const createAdmin = catchAsync(async (req: Request, res : Response) => {
    console.log("Admin : ", req.body);
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode : 201,
        success : true,
        message : "Admin Created Successfully",
        data : result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await UserService.getAllFromDB(filter, options);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Admin retrieve Successfully",
        data: result
    });
});

const updateAminProfile = catchAsync(async (req : Request, res : Response) => {
    const user = req.user;
    if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const result = await UserService.updateMyProfile(req, user as IAuthUser);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin profile data Updated fetched!",
        success: true,
        data: result
    });
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await UserService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin data fetched by id!",
        data: result
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await UserService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
});

export const UserController = {
    createAdmin,
    getAllFromDB,
    updateAminProfile,
    getByIdFromDB,
    deleteFromDB
}

