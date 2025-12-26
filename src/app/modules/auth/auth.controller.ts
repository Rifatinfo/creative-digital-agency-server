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
        message: "User logging successfully!",
        data: {
            accessToken,
            refreshToken
        }
    })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);
    res.cookie("accessToken", result.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
    });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: {
            message: "Access token genereated successfully!",
        },
    });
});


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
    resetPassword,
    refreshToken
}