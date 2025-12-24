import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    })
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    })

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User Login successfully",
        data: {
            accessToken,
            refreshToken
        }
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await AuthService.changePassword(user, req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Password Change Successfully",
        data: result,
    });
})

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Forgot password Change Successfully",
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    await AuthService.resetPassword(token, req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Password Reset Successfully",
        data: null,
    });
});

export const AuthController = {
    login,
    logout,
    changePassword,
    forgotPassword,
    resetPassword
}