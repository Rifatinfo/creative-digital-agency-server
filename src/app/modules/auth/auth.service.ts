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
    console.log(payload);

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
    const accessToken = jwtHelper.generateToken({ email: user.email, role: user.role }, "abcd", "1h");
    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role }, "abcd", "90d");
    return {
        accessToken,
        refreshToken,
    }
}

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

    const resetPassToken = jwtHelper.generateToken(
        {email : userData.email, role : userData.role},
        envVars.reset_pass_secret as Secret,
        envVars.reset_pass_token_expires_in as string
    );

    const resetPassLink = envVars.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

     sendEmail({
        to: userData.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: userData.name,
            resetPassLink
        }
    })

}
export const AuthService = {
    login,
    changePassword,
    forgotPassword
}