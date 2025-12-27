import { StatusCodes } from "http-status-codes";
import { UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../config/db"
import AppError from "../../middlewares/AppError";
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../middlewares/jwthelper";
import { envVars } from "../../config/env";
import { Secret } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    // console.log(payload);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!user.password) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User has no password set");
    }
    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect")
    }
    const accessToken = jwtHelper.generateToken({ email: user.email, role: user.role }, envVars.JWT_SECRET, "10h");
    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role }, envVars.JWT_SECRET, "90d");
    return {
        accessToken,
        refreshToken,
    }
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, envVars.REFRESH_TOKEN_SECRET as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelper.generateToken({
        email: userData.email,
        role: userData.role
    },
         envVars.JWT_SECRET as Secret,
        envVars.JWT_SECRET as string
    );

    return {
        accessToken,
        
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });


    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Password Incorrect");
    }

    const hashPassword: string = await bcrypt.hash(payload.newPassword, 10);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashPassword,
        }
    })
}

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    const resetPassToken = jwtHelper.generateToken(
        { email: userData.email, role: userData.role },
        envVars.reset_pass_secret as Secret,
        envVars.reset_pass_token_expires_in as string
    );

    const resetPassLink = envVars.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;


    try {
        await sendEmail({
            to: userData.email,
            subject: "Password Reset",
            templateName: "forgetPassword",
            templateData: {
                name: userData.name,
                resetUILink: resetPassLink,
            },
        });
    } catch (err) {
        console.error("Email failed but request succeeded");
    }

};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {
    if (!payload.password) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Password is required");
    }

    if (!payload.id) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User ID is required");
    }
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelper.verifyToken(token, envVars.reset_pass_secret as string);
    if (!isValidToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "Forbidden Access");
    }

    const password = await bcrypt.hash(payload.password, 10);
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
}


export const AuthService = {
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken
}

