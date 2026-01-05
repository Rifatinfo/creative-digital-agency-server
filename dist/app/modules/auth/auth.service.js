"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const enums_1 = require("../../../generated/prisma/enums");
const db_1 = require("../../config/db");
const AppError_1 = __importDefault(require("../../middlewares/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwthelper_1 = require("../../middlewares/jwthelper");
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../utils/sendEmail");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: enums_1.UserStatus.ACTIVE
        }
    });
    // console.log(payload);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (!user.password) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User has no password set");
    }
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password is incorrect");
    }
    const accessToken = jwthelper_1.jwtHelper.generateToken({ email: user.email, role: user.role }, env_1.envVars.JWT_SECRET, "10h");
    const refreshToken = jwthelper_1.jwtHelper.generateToken({ email: user.email, role: user.role }, env_1.envVars.JWT_SECRET, "90d");
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwthelper_1.jwtHelper.verifyToken(token, env_1.envVars.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: enums_1.UserStatus.ACTIVE
        }
    });
    const accessToken = jwthelper_1.jwtHelper.generateToken({
        email: userData.email,
        role: userData.role
    }, env_1.envVars.JWT_SECRET, env_1.envVars.JWT_SECRET);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: enums_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password Incorrect");
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.newPassword, 10);
    yield db_1.prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashPassword,
        }
    });
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: enums_1.UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const resetPassToken = jwthelper_1.jwtHelper.generateToken({ email: userData.email, role: userData.role }, env_1.envVars.reset_pass_secret, env_1.envVars.reset_pass_token_expires_in);
    const resetPassLink = env_1.envVars.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    try {
        yield (0, sendEmail_1.sendEmail)({
            to: userData.email,
            subject: "Password Reset",
            templateName: "forgetPassword",
            templateData: {
                name: userData.name,
                resetUILink: resetPassLink,
            },
        });
    }
    catch (err) {
        console.error("Email failed but request succeeded");
    }
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.password) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password is required");
    }
    if (!payload.id) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User ID is required");
    }
    const userData = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: enums_1.UserStatus.ACTIVE
        }
    });
    const isValidToken = jwthelper_1.jwtHelper.verifyToken(token, env_1.envVars.reset_pass_secret);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden Access");
    }
    const password = yield bcryptjs_1.default.hash(payload.password, 10);
    yield db_1.prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
});
exports.AuthService = {
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken
};
