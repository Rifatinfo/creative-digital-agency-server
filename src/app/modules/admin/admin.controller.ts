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

const updateAdminProfileById = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = req.user;
    const adminId = req.params.id;

    const result = await UserService.updateAdminById(
      req,
      adminId,
      authUser as IAuthUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin profile updated successfully",
      data: result,
    });
  }
);


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
    updateAdminProfileById,
    getByIdFromDB,
    deleteFromDB
}

