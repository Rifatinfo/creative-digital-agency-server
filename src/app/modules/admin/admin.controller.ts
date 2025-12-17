import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { sendResponse } from "../../middlewares/sendResponse";
import { UserService } from "./admin.service";

const createAdmin = catchAsync(async (req: Request, res : Response) => {
    console.log("Admin : ", req.body);
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode : 201,
        success : true,
        message : "Admin Created Successfully",
        data : result
    })
});

export const UserController = {
    createAdmin
}